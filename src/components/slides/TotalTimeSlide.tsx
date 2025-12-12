import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Clock } from 'lucide-react';

interface TotalTimeSlideProps {
  hours: number;
}

export function TotalTimeSlide({ hours }: TotalTimeSlideProps) {
  const days = (hours / 24).toFixed(1);
  const movies = Math.round(hours / 2); // Average movie ~2 hours
  const songs = Math.round(hours * 20); // Average song ~3 minutes

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600">
      {/* Animated clock hands effect */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border-2 border-white/10"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full border border-white/5"
      />

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-4"
        >
          <Clock className="w-14 h-14 mx-auto text-white/80" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-base mb-2 uppercase tracking-wider"
        >
          Time in motion
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          className="mb-1"
        >
          <AnimatedNumber
            value={hours}
            decimals={1}
            className="stat-number text-6xl md:text-7xl text-white"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/90 text-xl font-semibold mb-8"
        >
          hours
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-3"
        >
          <div className="glass-card px-5 py-3 bg-white/10">
            <p className="text-white/70 text-xs">That's</p>
            <p className="text-white text-lg font-bold">{days} full days ☀️</p>
          </div>

          <div className="glass-card px-5 py-3 bg-white/10">
            <p className="text-white/70 text-xs">You could have watched</p>
            <p className="text-white text-lg font-bold">{movies} movies 🎬</p>
          </div>

          <div className="glass-card px-5 py-3 bg-white/10">
            <p className="text-white/70 text-xs">Or listened to</p>
            <p className="text-white text-lg font-bold">{songs.toLocaleString()} songs 🎵</p>
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

