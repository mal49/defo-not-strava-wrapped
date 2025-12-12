import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { MONTHS } from '../../constants';

interface MonthlyDistributionSlideProps {
  distribution: Record<string, number>;
}

export function MonthlyDistributionSlide({ distribution }: MonthlyDistributionSlideProps) {
  const months = MONTHS;
  const maxValue = Math.max(...Object.values(distribution), 1);
  const totalActivities = Object.values(distribution).reduce((sum, val) => sum + val, 0);
  
  // Find most active month
  const mostActiveMonth = Object.entries(distribution).reduce((a, b) => 
    b[1] > a[1] ? b : a
  , ['Jan', 0]);

  // Find least active month (with at least 1 activity)
  const activeMonths = Object.entries(distribution).filter(([, count]) => count > 0);
  const leastActiveMonth = activeMonths.length > 0 
    ? activeMonths.reduce((a, b) => b[1] < a[1] ? b : a)
    : ['N/A', 0];

  // Calculate average per month
  const avgPerMonth = activeMonths.length > 0 
    ? (totalActivities / activeMonths.length).toFixed(1)
    : '0';

  // Find streak (consecutive months with activity)
  let currentStreak = 0;
  let maxStreak = 0;
  months.forEach((month) => {
    if (distribution[month] > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  // Get season emoji based on month
  const getSeasonEmoji = (month: string) => {
    const seasonMap: Record<string, string> = {
      'Dec': '❄️', 'Jan': '❄️', 'Feb': '❄️',
      'Mar': '🌸', 'Apr': '🌸', 'May': '🌸',
      'Jun': '☀️', 'Jul': '☀️', 'Aug': '☀️',
      'Sep': '🍂', 'Oct': '🍂', 'Nov': '🍂',
    };
    return seasonMap[month] || '📅';
  };

  // Color gradient based on activity intensity
  const getBarColor = (value: number, isMostActive: boolean) => {
    if (isMostActive) {
      return {
        gradient: 'from-amber-400 via-orange-500 to-red-500',
        glow: 'rgba(251, 146, 60, 0.5)',
      };
    }
    const intensity = value / maxValue;
    if (intensity > 0.7) return { gradient: 'from-emerald-400 to-teal-500', glow: 'rgba(52, 211, 153, 0.3)' };
    if (intensity > 0.4) return { gradient: 'from-sky-400 to-blue-500', glow: 'rgba(56, 189, 248, 0.3)' };
    return { gradient: 'from-slate-400 to-slate-500', glow: 'rgba(148, 163, 184, 0.2)' };
  };

  return (
    <SlideWrapper className="relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial gradient accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 blur-[100px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 blur-[100px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-white/40 uppercase">
            Monthly Rhythm
          </span>
          <h2 className="text-2xl font-bold text-white mt-2 tracking-tight">
            Your Year at a Glance
          </h2>
        </motion.div>

        {/* Chart container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 mb-6"
        >
          {/* Bar chart */}
          <div className="flex items-end justify-between gap-2 h-40 mb-4">
            {months.map((month, index) => {
              const value = distribution[month] || 0;
              const height = maxValue > 0 ? Math.max((value / maxValue) * 100, value > 0 ? 8 : 0) : 0;
              const isMostActive = month === mostActiveMonth[0];
              const colors = getBarColor(value, isMostActive);

              return (
                <div key={month} className="flex-1 flex flex-col items-center">
                  {/* Value label */}
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: value > 0 ? 1 : 0, y: 0 }}
                    transition={{ delay: 1 + index * 0.05 }}
                    className={`text-xs font-bold mb-4 tabular-nums ${
                      isMostActive ? 'text-amber-400' : 'text-white/60'
                    }`}
                  >
                    {value > 0 ? value : ''}
                  </motion.span>
                  
                  {/* Bar */}
                  <div className="w-full h-32 flex items-end">
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${height}%`, opacity: 1 }}
                      transition={{ 
                        delay: 0.5 + index * 0.06, 
                        duration: 0.6,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className={`w-full rounded-lg bg-gradient-to-t ${colors.gradient} relative`}
                      style={{
                        boxShadow: value > 0 ? `0 0 20px ${colors.glow}` : 'none',
                        minHeight: value > 0 ? '8px' : '0',
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-50" />
                      
                      {/* Crown for most active */}
                      {isMostActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 1.5, type: 'spring' }}
                          className="absolute -top-6 left-1/2 -translate-x-1/2"
                        >
                          <span className="text-lg">👑</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Month labels */}
          <div className="flex justify-between">
            {months.map((month, index) => {
              const isMostActive = month === mostActiveMonth[0];
              return (
                <motion.span
                  key={month}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.03 }}
                  className={`flex-1 text-center text-xs font-medium ${
                    isMostActive ? 'text-amber-400' : 'text-white/40'
                  }`}
                >
                  {month.substring(0, 1)}
                </motion.span>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.3, type: 'spring', stiffness: 100 }}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Card background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10" />
          <div className="absolute inset-0 border border-amber-500/20 rounded-2xl" />
          
          <div className="relative px-5 py-5">
            {/* Top row - Peak Month */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  🏆 Best Month
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{mostActiveMonth[0]}</span>
                  <span className="text-xl">{getSeasonEmoji(mostActiveMonth[0])}</span>
                </div>
                <p className="text-amber-400 text-sm font-semibold">
                  {mostActiveMonth[1]} activities
                </p>
              </div>
              
              {/* Circular progress showing percentage of year */}
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="url(#peakGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(mostActiveMonth[1] / totalActivities) * 94.2} 94.2`}
                    initial={{ strokeDasharray: '0 94.2' }}
                    animate={{ strokeDasharray: `${(mostActiveMonth[1] / totalActivities) * 94.2} 94.2` }}
                    transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="peakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {Math.round((mostActiveMonth[1] / totalActivities) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-4" />

            {/* Bottom row - Additional Stats */}
            <div className="grid grid-cols-3 gap-3">
              {/* Average per month */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-center"
              >
                <p className="text-white/40 text-[9px] font-medium uppercase tracking-wider mb-1">
                  Monthly Avg
                </p>
                <p className="text-white font-bold text-lg">{avgPerMonth}</p>
              </motion.div>

              {/* Active months streak */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="text-center border-x border-white/10"
              >
                <p className="text-white/40 text-[9px] font-medium uppercase tracking-wider mb-1">
                  Best Streak
                </p>
                <p className="text-white font-bold text-lg">{maxStreak} <span className="text-xs text-white/50">mo</span></p>
              </motion.div>

              {/* Slowest month */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 }}
                className="text-center"
              >
                <p className="text-white/40 text-[9px] font-medium uppercase tracking-wider mb-1">
                  Slowest
                </p>
                <p className="text-white font-bold text-lg">
                  {leastActiveMonth[0] !== 'N/A' ? String(leastActiveMonth[0]).substring(0, 3) : '—'}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center text-white/30 text-xs mt-6"
        >
          {totalActivities} activities throughout the year
        </motion.p>
      </div>
    </SlideWrapper>
  );
}

