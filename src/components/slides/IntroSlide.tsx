import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';

interface IntroSlideProps {
  year: number;
  athleteName: string;
  profilePicture?: string;
}

export function IntroSlide({ year, athleteName, profilePicture }: IntroSlideProps) {
  return (
    <SlideWrapper className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-coral-500"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-tr from-teal-500 to-blue-500"
        />
      </div>

      <div className="relative z-10 text-center">
        {/* Profile Picture */}
        {profilePicture && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="mb-6"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-coral-500 to-teal-500 blur-md opacity-60 animate-pulse" />
              <img
                src={profilePicture}
                alt={athleteName}
                className="relative w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-2xl"
              />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="text-white/60 text-lg tracking-widest uppercase">Your</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="stat-number text-8xl md:text-9xl text-gradient-orange mb-4"
        >
          {year}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <span className="text-white/60 text-lg tracking-widest uppercase">Wrapped</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="glass-card px-6 py-4 inline-block"
        >
          <p className="text-white/80">
            Hey <span className="text-white font-semibold">{athleteName}</span>! 👋
          </p>
          <p className="text-white/60 text-sm mt-1">Let's see what you achieved</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-12 text-white/40 text-sm"
        >
          Tap anywhere to continue →
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

