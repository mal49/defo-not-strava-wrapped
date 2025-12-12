import type { StravaActivity, WrappedStats, RouteData } from '../types/strava';
import { MONTHS } from '../constants';

export function processActivities(activities: StravaActivity[]): WrappedStats {
  if (activities.length === 0) {
    return {
      totalDistance: 0,
      totalTime: 0,
      totalElevation: 0,
      totalActivities: 0,
      totalKudos: 0,
      longestActivity: null,
      activityTypes: {},
      monthlyDistribution: {},
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
  MONTHS.forEach((m) => (monthlyDistribution[m] = 0));
  
  activities.forEach((a) => {
    const month = new Date(a.start_date_local).getMonth();
    monthlyDistribution[MONTHS[month]]++;
  });

  // Longest activity by distance
  const longestActivity = activities.reduce((longest, current) =>
    current.distance > (longest?.distance || 0) ? current : longest
  , activities[0]);

  // Get top routes (activities with polyline data, sorted by distance)
  const topRoutes = processRoutes(activities);

  return {
    totalDistance,
    totalTime,
    totalElevation,
    totalActivities: activities.length,
    totalKudos,
    longestActivity,
    activityTypes,
    monthlyDistribution,
    topRoutes,
  };
}

function processRoutes(activities: StravaActivity[]): RouteData[] {
  // Filter activities that have polyline data and sort by distance (longest first)
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

