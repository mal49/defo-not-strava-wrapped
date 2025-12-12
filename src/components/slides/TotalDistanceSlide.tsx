import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { AnimatedNumber } from '../ui/AnimatedNumber';

interface TotalDistanceSlideProps {
  distance: number; // in km
}

export function TotalDistanceSlide({ distance }: TotalDistanceSlideProps) {
  // Fun comparisons
  const marathons = (distance / 42.195).toFixed(1);
  const earthCircumference = 40075;
  const percentOfEarth = ((distance / earthCircumference) * 100).toFixed(2);

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-coral-500">
      {/* Animated background circles */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 right-10 w-32 h-32 rounded-full bg-white/10"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-32 left-10 w-24 h-24 rounded-full bg-white/10"
      />

      <div className="relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/80 text-lg mb-2 uppercase tracking-wider"
        >
          You traveled
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          className="mb-2"
        >
          <AnimatedNumber
            value={distance}
            decimals={1}
            className="stat-number text-7xl md:text-8xl text-white"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/90 text-2xl font-semibold mb-12"
        >
          kilometers
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <div className="glass-card px-6 py-4 bg-white/10">
            <p className="text-white/70 text-sm">That's like running</p>
            <p className="text-white text-xl font-bold">{marathons} marathons 🏃</p>
          </div>

          <div className="glass-card px-6 py-4 bg-white/10">
            <p className="text-white/70 text-sm">You've covered</p>
            <p className="text-white text-xl font-bold">{percentOfEarth}% of Earth's circumference 🌍</p>
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

