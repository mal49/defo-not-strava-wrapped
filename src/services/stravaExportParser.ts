import JSZip from 'jszip';
import polyline from '@mapbox/polyline';
import pako from 'pako';
import FitParser from 'fit-file-parser';
import type { StravaActivity, StravaAthlete } from '../types/strava';

export interface ParsedExportData {
  activities: StravaActivity[];
  athlete: StravaAthlete;
  profilePicture?: string;
}

// Correct column indices based on actual Strava export CSV analysis
const COL = {
  ACTIVITY_ID: 0,
  ACTIVITY_DATE: 1,
  ACTIVITY_NAME: 2,
  ACTIVITY_TYPE: 3,
  ACTIVITY_DESCRIPTION: 4,
  ELAPSED_TIME_DISPLAY: 5,
  DISTANCE_KM: 6,
  MAX_HR_DISPLAY: 7,
  FILENAME: 12,
  ELAPSED_TIME_RAW: 15,
  MOVING_TIME: 16,
  DISTANCE_METERS: 17,
  MAX_SPEED: 18,
  AVERAGE_SPEED: 19,
  ELEVATION_GAIN: 20,
  ELEVATION_LOSS: 21,
  MAX_HR_RAW: 30,
  AVERAGE_HR: 31,
  CALORIES: 34,
  TOTAL_STEPS: 85,
};

/**
 * Parse CSV content handling multi-line quoted fields
 */
function parseCSV(csvContent: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(f => f)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      }
    } else {
      currentField += char;
    }
  }
  
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(f => f)) {
      rows.push(currentRow);
    }
  }
  
  return rows;
}

function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const value = parseFloat(timeStr.replace(/,/g, ''));
  return isNaN(value) ? 0 : value;
}

function parseDistanceKmToMeters(distanceKm: string): number {
  if (!distanceKm) return 0;
  
  let cleanStr = distanceKm.trim();
  
  const lastComma = cleanStr.lastIndexOf(',');
  const lastDot = cleanStr.lastIndexOf('.');
  
  if (lastComma > lastDot) {
    cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
  } else {
    cleanStr = cleanStr.replace(/,/g, '');
  }
  
  const valueKm = parseFloat(cleanStr);
  if (isNaN(valueKm)) return 0;
  
  return valueKm * 1000;
}

function parseNumber(str: string): number {
  if (!str) return 0;
  const value = parseFloat(str.replace(/,/g, ''));
  return isNaN(value) ? 0 : value;
}

/**
 * Simplify coordinates to reduce polyline size
 */
function simplifyCoords(coords: [number, number][], maxPoints: number = 200): [number, number][] {
  if (coords.length <= maxPoints) return coords;
  
  const step = Math.ceil(coords.length / maxPoints);
  const simplified: [number, number][] = [];
  
  for (let i = 0; i < coords.length; i += step) {
    simplified.push(coords[i]);
  }
  
  // Always include the last point
  if (simplified[simplified.length - 1] !== coords[coords.length - 1]) {
    simplified.push(coords[coords.length - 1]);
  }
  
  return simplified;
}

/**
 * Parse GPX file and extract coordinates
 */
function parseGPX(gpxContent: string): [number, number][] {
  const coords: [number, number][] = [];
  
  const trkptRegex = /<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)"/g;
  let match;
  
  while ((match = trkptRegex.exec(gpxContent)) !== null) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lon)) {
      coords.push([lat, lon]);
    }
  }
  
  return simplifyCoords(coords);
}

/**
 * Parse FIT file and extract coordinates
 */
async function parseFIT(fitData: Uint8Array): Promise<[number, number][]> {
  return new Promise((resolve) => {
    try {
      const fitParser = new FitParser({
        force: true,
        mode: 'list',
      });
      
      // Convert Uint8Array to Buffer for fit-file-parser
      const buffer = Buffer.from(fitData);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fitParser.parse(buffer, (error: any, data: any) => {
        if (error || !data?.records) {
          resolve([]);
          return;
        }
        
        const coords: [number, number][] = data.records
          .filter((r: { position_lat?: number; position_long?: number }) => 
            r.position_lat !== undefined && 
            r.position_long !== undefined &&
            !isNaN(r.position_lat) &&
            !isNaN(r.position_long)
          )
          .map((r: { position_lat?: number; position_long?: number }) => 
            [r.position_lat!, r.position_long!] as [number, number]
          );
        
        resolve(simplifyCoords(coords));
      });
    } catch {
      resolve([]);
    }
  });
}

/**
 * Convert CSV row to StravaActivity
 */
function convertRowToActivity(values: string[], index: number): { activity: StravaActivity; filename: string | null } | null {
  const get = (col: number): string => values[col] || '';
  
  const activityIdStr = get(COL.ACTIVITY_ID);
  if (!activityIdStr || isNaN(parseInt(activityIdStr))) return null;
  
  const dateStr = get(COL.ACTIVITY_DATE);
  let startDate = new Date();
  if (dateStr) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      startDate = parsed;
    }
  }

  let distanceMeters = parseDistanceKmToMeters(get(COL.DISTANCE_KM));
  if (distanceMeters === 0) {
    distanceMeters = parseNumber(get(COL.DISTANCE_METERS));
  }
  
  const movingTime = parseTimeToSeconds(get(COL.MOVING_TIME)) || parseTimeToSeconds(get(COL.ELAPSED_TIME_DISPLAY));
  const elapsedTime = parseTimeToSeconds(get(COL.ELAPSED_TIME_RAW)) || parseTimeToSeconds(get(COL.ELAPSED_TIME_DISPLAY));
  const elevationGain = parseNumber(get(COL.ELEVATION_GAIN));
  const avgSpeed = parseNumber(get(COL.AVERAGE_SPEED));
  const maxSpeed = parseNumber(get(COL.MAX_SPEED));
  const avgHR = parseNumber(get(COL.AVERAGE_HR)) || undefined;
  const maxHR = parseNumber(get(COL.MAX_HR_RAW)) || parseNumber(get(COL.MAX_HR_DISPLAY)) || undefined;
  const activityType = get(COL.ACTIVITY_TYPE) || 'Workout';
  const filename = get(COL.FILENAME) || null;

  const activity: StravaActivity = {
    id: parseInt(activityIdStr) || Date.now() + index,
    name: get(COL.ACTIVITY_NAME) || `Activity ${index + 1}`,
    distance: distanceMeters,
    moving_time: movingTime,
    elapsed_time: elapsedTime || movingTime,
    total_elevation_gain: elevationGain,
    type: activityType,
    sport_type: activityType,
    start_date: startDate.toISOString(),
    start_date_local: startDate.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    kudos_count: 0,
    achievement_count: 0,
    average_speed: avgSpeed,
    max_speed: maxSpeed,
    average_heartrate: avgHR,
    max_heartrate: maxHR,
    start_latlng: undefined,
    end_latlng: undefined,
    location_city: undefined,
    location_state: undefined,
    location_country: undefined,
    map: undefined,
  };

  return { activity, filename };
}

/**
 * Parse Strava export ZIP file
 */
export async function parseStravaExport(file: File): Promise<ParsedExportData> {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);

  let activitiesCSV: string | null = null;
  let profilePicture: string | undefined = undefined;
  let athleteFirstName = 'Strava';
  let athleteLastName = 'Athlete';
  
  // Store activity files by filename
  const gpxFiles = new Map<string, string>();
  const fitFiles = new Map<string, Uint8Array>();

  // First pass: collect all files
  for (const [filename, zipEntry] of Object.entries(contents.files)) {
    if (zipEntry.dir) continue;
    
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.endsWith('activities.csv')) {
      activitiesCSV = await zipEntry.async('string');
    }
    
    if (lowerFilename.endsWith('profile.jpg') || 
        lowerFilename.endsWith('profile.png') || 
        lowerFilename.endsWith('profile.jpeg')) {
      try {
        const imageData = await zipEntry.async('base64');
        const extension = lowerFilename.split('.').pop() || 'jpg';
        const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
        profilePicture = `data:${mimeType};base64,${imageData}`;
      } catch (e) {
        console.error('Failed to load profile picture:', e);
      }
    }

    if (lowerFilename.endsWith('profile.csv')) {
      try {
        const profileCSV = await zipEntry.async('string');
        const rows = parseCSV(profileCSV);
        if (rows.length >= 2) {
          const headers = rows[0];
          const values = rows[1];
          
          const firstNameIdx = headers.findIndex(h => 
            h.toLowerCase().includes('first') && h.toLowerCase().includes('name')
          );
          const lastNameIdx = headers.findIndex(h => 
            h.toLowerCase().includes('last') && h.toLowerCase().includes('name')
          );
          
          if (firstNameIdx >= 0 && values[firstNameIdx]) {
            athleteFirstName = values[firstNameIdx];
          }
          if (lastNameIdx >= 0 && values[lastNameIdx]) {
            athleteLastName = values[lastNameIdx];
          }
        }
      } catch (e) {
        console.error('Failed to parse profile.csv:', e);
      }
    }
    
    // Collect GPX files (uncompressed)
    if (lowerFilename.endsWith('.gpx') && !lowerFilename.endsWith('.gpx.gz')) {
      try {
        const gpxContent = await zipEntry.async('string');
        gpxFiles.set(filename, gpxContent);
      } catch (e) {
        console.error(`Failed to load GPX file ${filename}:`, e);
      }
    }
    
    // Collect GPX.GZ files (compressed GPX)
    if (lowerFilename.endsWith('.gpx.gz')) {
      try {
        const gzData = await zipEntry.async('uint8array');
        const gpxData = pako.ungzip(gzData, { to: 'string' });
        gpxFiles.set(filename, gpxData);
      } catch (e) {
        console.error(`Failed to load GPX.GZ file ${filename}:`, e);
      }
    }
    
    // Collect FIT.GZ files
    if (lowerFilename.endsWith('.fit.gz')) {
      try {
        const gzData = await zipEntry.async('uint8array');
        // Decompress the gzip data
        const fitData = pako.ungzip(gzData);
        fitFiles.set(filename, fitData);
      } catch (e) {
        console.error(`Failed to load FIT file ${filename}:`, e);
      }
    }
  }

  if (!activitiesCSV) {
    throw new Error('Could not find activities.csv in the ZIP file. Please make sure you uploaded a valid Strava export.');
  }

  const rows = parseCSV(activitiesCSV);
  
  if (rows.length < 2) {
    throw new Error('No activities found in the export file.');
  }

  // Parse activities and attach route data
  const activities: StravaActivity[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    const result = convertRowToActivity(rows[i], i - 1);
    if (!result) continue;
    
    const { activity, filename } = result;
    
    let coords: [number, number][] = [];
    
    // Try GPX file (both .gpx and .gpx.gz are stored in gpxFiles)
    if (filename && (filename.endsWith('.gpx') || filename.endsWith('.gpx.gz'))) {
      const gpxContent = gpxFiles.get(filename) || 
                         gpxFiles.get(`/${filename}`) ||
                         gpxFiles.get(filename.replace(/^\//, ''));
      
      if (gpxContent) {
        coords = parseGPX(gpxContent);
      }
    }
    
    // Try FIT file if no GPX coords
    if (coords.length === 0 && filename && filename.endsWith('.fit.gz')) {
      const fitData = fitFiles.get(filename) || 
                      fitFiles.get(`/${filename}`) ||
                      fitFiles.get(filename.replace(/^\//, ''));
      
      if (fitData) {
        coords = await parseFIT(fitData);
      }
    }
    
    // Attach coordinates and polyline to activity
    if (coords.length > 1) {
      activity.start_latlng = coords[0];
      activity.end_latlng = coords[coords.length - 1];
      
      try {
        const encodedPolyline = polyline.encode(coords);
        activity.map = {
          id: `map_${activity.id}`,
          summary_polyline: encodedPolyline,
          polyline: encodedPolyline,
        };
      } catch (e) {
        console.error(`Failed to encode polyline for activity ${activity.id}:`, e);
      }
    }
    
    activities.push(activity);
  }
  
  if (activities.length === 0) {
    throw new Error('No activities found in the export file.');
  }

  const athlete: StravaAthlete = {
    id: Date.now(),
    username: 'athlete',
    firstname: athleteFirstName,
    lastname: athleteLastName,
    profile: profilePicture || '',
    profile_medium: profilePicture || '',
  };

  return {
    activities,
    athlete,
    profilePicture,
  };
}

/**
 * Filter activities by year
 */
export function filterActivitiesByYear(activities: StravaActivity[], year: number): StravaActivity[] {
  return activities.filter(activity => {
    const activityDate = new Date(activity.start_date_local);
    return activityDate.getFullYear() === year;
  });
}

/**
 * Get available years from activities
 */
export function getAvailableYearsFromActivities(activities: StravaActivity[]): number[] {
  const years = new Set<number>();
  
  activities.forEach(activity => {
    const activityDate = new Date(activity.start_date_local);
    const year = activityDate.getFullYear();
    if (!isNaN(year) && year > 2000 && year <= new Date().getFullYear() + 1) {
      years.add(year);
    }
  });

  return Array.from(years).sort((a, b) => b - a);
}
