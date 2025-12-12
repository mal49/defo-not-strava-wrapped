import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { getActivityEmoji } from '../../services/dataProcessing';

interface ActivityTypesSlideProps {
  activityTypes: Record<string, number>;
}

const COLORS = [
  { main: '#fc4c02', glow: 'rgba(252, 76, 2, 0.4)' },
  { main: '#00d4aa', glow: 'rgba(0, 212, 170, 0.4)' },
  { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  { main: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
  { main: '#ffd93d', glow: 'rgba(255, 217, 61, 0.4)' },
  { main: '#ff7f6e', glow: 'rgba(255, 127, 110, 0.4)' },
];

export function ActivityTypesSlide({ activityTypes }: ActivityTypesSlideProps) {
  const sortedTypes = Object.entries(activityTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const total = sortedTypes.reduce((sum, [, count]) => sum + count, 0);
  
  const chartData = sortedTypes.map(([name, value], index) => ({
    name,
    value,
    percentage: ((value / total) * 100).toFixed(1),
    color: COLORS[index % COLORS.length],
  }));

  const topActivity = sortedTypes[0];
  const topPercentage = ((topActivity[1] / total) * 100).toFixed(0);

  // Calculate cumulative percentages for the ring segments
  let cumulativePercentage = 0;
  const segments = chartData.map((item) => {
    const startPercentage = cumulativePercentage;
    const percentage = (item.value / total) * 100;
    cumulativePercentage += percentage;
    return {
      ...item,
      startPercentage,
      endPercentage: cumulativePercentage,
    };
  });

  return (
    <SlideWrapper className="relative overflow-hidden">
      {/* Dark gradient background with texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Ambient glow from top activity color */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px]"
        style={{ backgroundColor: COLORS[0].main }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-white/40 uppercase">
            Activity Breakdown
          </span>
          <h2 className="text-2xl font-bold text-white mt-2 tracking-tight">
            Your Movement Mix
          </h2>
        </motion.div>

        {/* Custom Ring Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: 'spring', stiffness: 100 }}
          className="relative w-56 h-56 mx-auto mb-10"
        >
          {/* SVG Ring */}
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="12"
            />
            
            {/* Animated segments */}
            {segments.map((segment, index) => {
              const circumference = 2 * Math.PI * 42;
              const dashLength = (segment.endPercentage - segment.startPercentage) / 100 * circumference;
              const dashOffset = -(segment.startPercentage / 100 * circumference);
              const gapSize = segments.length > 1 ? 2 : 0;
              
              return (
                <motion.circle
                  key={segment.name}
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={segment.color.main}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${dashLength - gapSize} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  initial={{ opacity: 0, strokeDasharray: `0 ${circumference}` }}
                  animate={{ 
                    opacity: 1, 
                    strokeDasharray: `${dashLength - gapSize} ${circumference}` 
                  }}
                  transition={{ 
                    delay: 0.6 + index * 0.15, 
                    duration: 0.8, 
                    ease: 'easeOut' 
                  }}
                  style={{
                    filter: `drop-shadow(0 0 8px ${segment.color.glow})`,
                  }}
                />
              );
            })}
          </svg>
          
          {/* Center content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="text-5xl mb-1">{getActivityEmoji(topActivity[0])}</span>
            <span className="text-3xl font-bold text-white">{topPercentage}%</span>
            <span className="text-xs text-white/50 uppercase tracking-wider">{topActivity[0]}</span>
          </motion.div>
        </motion.div>

        {/* Activity List */}
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1, type: 'spring', stiffness: 100 }}
              className="group relative"
            >
              {/* Background bar showing percentage */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                  className="h-full opacity-20 rounded-2xl"
                  style={{ backgroundColor: item.color.main }}
                />
              </div>
              
              {/* Content */}
              <div 
                className="relative flex items-center justify-between px-4 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  {/* Color indicator with glow */}
                  <div className="relative">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ 
                        backgroundColor: item.color.main,
                        boxShadow: `0 0 10px ${item.color.glow}`,
                      }}
                    />
                  </div>
                  
                  {/* Emoji */}
                  <span className="text-xl">{getActivityEmoji(item.name)}</span>
                  
                  {/* Activity name */}
                  <span className="text-white/90 font-medium text-sm">{item.name}</span>
                </div>
                
                {/* Stats */}
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-bold text-lg tabular-nums">{item.value}</span>
                  <span 
                    className="text-xs font-medium tabular-nums"
                    style={{ color: item.color.main }}
                  >
                    {item.percentage}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer stat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-center"
        >
          <span className="text-white/30 text-xs">
            {total} total activities across {sortedTypes.length} types
          </span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

