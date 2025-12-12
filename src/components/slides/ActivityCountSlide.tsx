import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Activity } from 'lucide-react';

interface ActivityCountSlideProps {
  count: number;
  year: number;
}

export function ActivityCountSlide({ count, year }: ActivityCountSlideProps) {
  // Calculate activities per week/month
  const perWeek = (count / 52).toFixed(1);
  const perMonth = (count / 12).toFixed(1);
  
  // Determine consistency message
  let consistencyMessage = '';
  let consistencyEmoji = '';
  
  if (count >= 365) {
    consistencyMessage = "You're a machine!";
    consistencyEmoji = '🤖';
  } else if (count >= 200) {
    consistencyMessage = 'Incredibly dedicated!';
    consistencyEmoji = '🔥';
  } else if (count >= 100) {
    consistencyMessage = 'Solid consistency!';
    consistencyEmoji = '💪';
  } else if (count >= 50) {
    consistencyMessage = 'Great effort!';
    consistencyEmoji = '👏';
  } else {
    consistencyMessage = 'Every activity counts!';
    consistencyEmoji = '⭐';
  }

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600">
      {/* Floating activity icons */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            y: [-20, -200],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="absolute text-2xl"
          style={{
            left: `${10 + i * 12}%`,
            bottom: '10%',
          }}
        >
          {['🏃', '🚴', '🏊', '🥾', '💪', '🧘', '⛷️', '🚣'][i]}
        </motion.div>
      ))}

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-4"
        >
          <Activity className="w-14 h-14 mx-auto text-white/80" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-base mb-2 uppercase tracking-wider"
        >
          You logged
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          className="mb-1"
        >
          <AnimatedNumber
            value={count}
            decimals={0}
            className="stat-number text-6xl md:text-7xl text-white"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/90 text-xl font-semibold mb-6"
        >
          activities in {year}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mb-6"
        >
          <span className="text-4xl">{consistencyEmoji}</span>
          <p className="text-white text-lg font-bold mt-2">{consistencyMessage}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex gap-4 justify-center"
        >
          <div className="glass-card px-5 py-3 bg-white/10">
            <p className="text-white text-2xl font-bold">{perWeek}</p>
            <p className="text-white/70 text-sm">per week</p>
          </div>

          <div className="glass-card px-5 py-3 bg-white/10">
            <p className="text-white text-2xl font-bold">{perMonth}</p>
            <p className="text-white/70 text-sm">per month</p>
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

