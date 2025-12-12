// Shared constants across the application

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

// Unified color palette for charts and routes
export const CHART_COLORS = [
  { main: '#fc4c02', glow: 'rgba(252, 76, 2, 0.4)' },   // Strava orange
  { main: '#00d4aa', glow: 'rgba(0, 212, 170, 0.4)' },  // Teal
  { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' }, // Purple
  { main: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' }, // Blue
  { main: '#ffd93d', glow: 'rgba(255, 217, 61, 0.4)' }, // Yellow
  { main: '#ff7f6e', glow: 'rgba(255, 127, 110, 0.4)' }, // Coral
  { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.4)' }, // Pink
  { main: '#84cc16', glow: 'rgba(132, 204, 22, 0.4)' },  // Lime
  { main: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },   // Cyan
  { main: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },  // Orange
] as const;

// Simple color array for routes/polylines
export const ROUTE_COLORS = CHART_COLORS.map(c => c.main);

// Reusable animation variant for framer-motion
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

