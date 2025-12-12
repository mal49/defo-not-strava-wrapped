import type { StravaActivity, WrappedStats, LocationStats, RouteData } from '../types/strava';

export function processActivities(activities: StravaActivity[]): WrappedStats {
  if (activities.length === 0) {
    return {
      totalDistance: 0,
      totalTime: 0,
      totalElevation: 0,
      totalActivities: 0,
      totalKudos: 0,
      longestActivity: null,
      fastestActivity: null,
      activityTypes: {},
      monthlyDistribution: {},
      averagePerActivity: { distance: 0, time: 0, elevation: 0 },
      streaks: { longestStreak: 0, currentStreak: 0 },
      personalBests: {
        longestDistance: 0,
        longestTime: 0,
        highestElevation: 0,
        mostKudos: 0,
      },
      topLocations: [],
      topRoutes: [],
    };
  }

  // Basic totals
  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0) / 1000; // km
  const totalTime = activities.reduce((sum, a) => sum + a.moving_time, 0) / 3600; // hours
  const totalElevation = activities.reduce((sum, a) => sum + a.total_elevation_gain, 0);
  const totalKudos = activities.reduce((sum, a) => sum + a.kudos_count, 0);

  // Activity types breakdown
  const activityTypes: Record<string, number> = {};
  activities.forEach((a) => {
    const type = a.sport_type || a.type;
    activityTypes[type] = (activityTypes[type] || 0) + 1;
  });

  // Monthly distribution
  const monthlyDistribution: Record<string, number> = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach((m) => (monthlyDistribution[m] = 0));
  
  activities.forEach((a) => {
    const month = new Date(a.start_date_local).getMonth();
    monthlyDistribution[months[month]]++;
  });

  // Longest activity by distance
  const longestActivity = activities.reduce((longest, current) =>
    current.distance > (longest?.distance || 0) ? current : longest
  , activities[0]);

  // Fastest activity (by average speed, for runs/rides)
  const speedActivities = activities.filter(a => 
    ['Run', 'Ride', 'VirtualRide', 'VirtualRun'].includes(a.sport_type || a.type)
  );
  const fastestActivity = speedActivities.length > 0
    ? speedActivities.reduce((fastest, current) =>
        current.average_speed > (fastest?.average_speed || 0) ? current : fastest
      , speedActivities[0])
    : null;

  // Personal bests
  const personalBests = {
    longestDistance: Math.max(...activities.map(a => a.distance)) / 1000,
    longestTime: Math.max(...activities.map(a => a.moving_time)) / 3600,
    highestElevation: Math.max(...activities.map(a => a.total_elevation_gain)),
    mostKudos: Math.max(...activities.map(a => a.kudos_count)),
  };

  // Calculate streaks
  const streaks = calculateStreaks(activities);

  // Averages
  const averagePerActivity = {
    distance: totalDistance / activities.length,
    time: totalTime / activities.length,
    elevation: totalElevation / activities.length,
  };

  // Process locations
  const topLocations = processLocations(activities);

  // Get top routes (activities with polyline data, sorted by distance)
  const topRoutes = processRoutes(activities);

  return {
    totalDistance,
    totalTime,
    totalElevation,
    totalActivities: activities.length,
    totalKudos,
    longestActivity,
    fastestActivity,
    activityTypes,
    monthlyDistribution,
    averagePerActivity,
    streaks,
    personalBests,
    topLocations,
    topRoutes,
  };
}

function processRoutes(activities: StravaActivity[]): RouteData[] {
  // Filter activities that have polyline data and sort by distance
  return activities
    .filter(a => a.map?.summary_polyline && a.map.summary_polyline.length > 0)
    .sort((a, b) => b.distance - a.distance)
    .slice(0, 10) // Get top 10 longest routes
    .map(a => ({
      polyline: a.map!.summary_polyline,
      name: a.name,
      distance: a.distance / 1000, // km
      type: a.sport_type || a.type,
    }));
}

function processLocations(activities: StravaActivity[]): LocationStats[] {
  const locationMap = new Map<string, LocationStats>();

  activities.forEach((activity) => {
    // Check if we have valid coordinates first
    const hasValidCoords = activity.start_latlng && 
      Array.isArray(activity.start_latlng) && 
      activity.start_latlng.length === 2 &&
      !isNaN(activity.start_latlng[0]) && 
      !isNaN(activity.start_latlng[1]) &&
      activity.start_latlng[0] !== 0 &&
      activity.start_latlng[1] !== 0;

    // Use city/country if available
    if (activity.location_city || activity.location_country) {
      const city = activity.location_city || 'Unknown';
      const country = activity.location_country || '';
      const key = `city-${city}-${country}`;

      if (!locationMap.has(key)) {
        locationMap.set(key, {
          city,
          country,
          count: 0,
          totalDistance: 0,
          lat: hasValidCoords ? activity.start_latlng![0] : 0,
          lng: hasValidCoords ? activity.start_latlng![1] : 0,
        });
      }

      const loc = locationMap.get(key)!;
      loc.count++;
      loc.totalDistance += activity.distance / 1000;
    } else if (hasValidCoords) {
      // Group by approximate location (rounded to 2 decimal places ~1km precision)
      const lat = Math.round(activity.start_latlng![0] * 100) / 100;
      const lng = Math.round(activity.start_latlng![1] * 100) / 100;
      const key = `coords-${lat}-${lng}`;

      if (!locationMap.has(key)) {
        locationMap.set(key, {
          city: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
          country: '',
          count: 0,
          totalDistance: 0,
          lat: activity.start_latlng![0],
          lng: activity.start_latlng![1],
        });
      }

      const loc = locationMap.get(key)!;
      loc.count++;
      loc.totalDistance += activity.distance / 1000;
    }
    // Skip activities without valid location data
  });

  // Sort by count and return top 5
  return Array.from(locationMap.values())
    .filter(loc => loc.city !== 'NaN°, NaN°' && !loc.city.includes('NaN'))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function calculateStreaks(activities: StravaActivity[]): { longestStreak: number; currentStreak: number } {
  if (activities.length === 0) {
    return { longestStreak: 0, currentStreak: 0 };
  }

  // Get unique activity dates
  const activityDates = new Set(
    activities.map((a) => {
      const date = new Date(a.start_date_local);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    })
  );

  const sortedDates = Array.from(activityDates)
    .map((d) => {
      const [year, month, day] = d.split('-').map(Number);
      return new Date(year, month, day);
    })
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 1;
  let currentStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    
    if (diff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak (from most recent activity)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivityDate = sortedDates[sortedDates.length - 1];
  const daysSinceLastActivity = Math.floor(
    (today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastActivity <= 1) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  return { longestStreak, currentStreak };
}

export function formatDistance(km: number): string {
  if (km >= 1000) {
    return `${(km / 1000).toFixed(1)}k`;
  }
  return km.toFixed(1);
}

export function formatTime(hours: number): string {
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  }
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

export function formatElevation(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}k`;
  }
  return Math.round(meters).toString();
}

export function getActivityEmoji(type: string): string {
  const emojis: Record<string, string> = {
    Run: '🏃',
    Ride: '🚴',
    Swim: '🏊',
    Walk: '🚶',
    Hike: '🥾',
    VirtualRide: '🚴‍♂️',
    VirtualRun: '🏃‍♂️',
    WeightTraining: '🏋️',
    Yoga: '🧘',
    Workout: '💪',
    Soccer: '⚽',
    Tennis: '🎾',
    Rowing: '🚣',
    Kayaking: '🛶',
    Skiing: '⛷️',
    Snowboard: '🏂',
    Golf: '🏌️',
    Surfing: '🏄',
    Skateboard: '🛹',
    RockClimbing: '🧗',
  };
  return emojis[type] || '🏅';
}

