export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  profile: string;
  profile_medium: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  kudos_count: number;
  achievement_count: number;
  average_speed: number; // m/s
  max_speed: number; // m/s
  average_heartrate?: number;
  max_heartrate?: number;
  suffer_score?: number;
  start_latlng?: [number, number]; // [lat, lng]
  end_latlng?: [number, number];
  location_city?: string;
  location_state?: string;
  location_country?: string;
  map?: {
    id: string;
    summary_polyline: string; // Encoded polyline of the route
    polyline?: string;
  };
}

export interface LocationStats {
  city: string;
  country: string;
  count: number;
  totalDistance: number; // km
  lat: number;
  lng: number;
}

export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: StravaAthlete;
}

export interface RouteData {
  polyline: string;
  name: string;
  distance: number;
  type: string;
}

export interface WrappedStats {
  totalDistance: number; // km
  totalTime: number; // hours
  totalElevation: number; // meters
  totalActivities: number;
  totalKudos: number;
  longestActivity: StravaActivity | null;
  fastestActivity: StravaActivity | null;
  activityTypes: Record<string, number>;
  monthlyDistribution: Record<string, number>;
  averagePerActivity: {
    distance: number;
    time: number;
    elevation: number;
  };
  streaks: {
    longestStreak: number;
    currentStreak: number;
  };
  personalBests: {
    longestDistance: number;
    longestTime: number;
    highestElevation: number;
    mostKudos: number;
  };
  topLocations: LocationStats[];
  topRoutes: RouteData[]; // Top activities with route data
  allPolylines: string[]; // All route polylines for heatmap
}

