import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { Calendar } from 'lucide-react';

interface MonthlyDistributionSlideProps {
  distribution: Record<string, number>;
}

export function MonthlyDistributionSlide({ distribution }: MonthlyDistributionSlideProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxValue = Math.max(...Object.values(distribution), 1);
  
  // Find most active month
  const mostActiveMonth = Object.entries(distribution).reduce((a, b) => 
    b[1] > a[1] ? b : a
  , ['Jan', 0]);

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
      <div className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-3 text-center"
        >
          <Calendar className="w-10 h-10 mx-auto text-white/80" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-base mb-4 uppercase tracking-wider text-center"
        >
          Your year at a glance
        </motion.p>

        {/* Bar chart */}
        <div className="flex items-end justify-between gap-1 h-32 mb-3 px-2">
          {months.map((month, index) => {
            const value = distribution[month] || 0;
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const isMostActive = month === mostActiveMonth[0];

            return (
              <motion.div
                key={month}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${height}%`, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                className="flex-1 relative group"
              >
                <div
                  className={`w-full h-full rounded-t-md ${
                    isMostActive 
                      ? 'bg-gradient-to-t from-yellow-400 to-yellow-300' 
                      : 'bg-gradient-to-t from-white/40 to-white/60'
                  }`}
                />
                {value > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.05 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white/80 font-medium"
                  >
                    {value}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Month labels */}
        <div className="flex justify-between px-2 mb-5">
          {months.map((month, index) => (
            <motion.span
              key={month}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.03 }}
              className={`text-xs ${
                month === mostActiveMonth[0] ? 'text-yellow-300 font-bold' : 'text-white/60'
              }`}
            >
              {month.charAt(0)}
            </motion.span>
          ))}
        </div>

        {/* Most active month highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="glass-card px-5 py-3 bg-white/10 text-center"
        >
          <p className="text-white/70 text-xs mb-1">Your most active month</p>
          <p className="text-white text-xl font-bold">
            {mostActiveMonth[0]} 🔥
          </p>
          <p className="text-white/60 text-xs">
            {mostActiveMonth[1]} activities
          </p>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

