import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Mountain } from 'lucide-react';

interface ElevationSlideProps {
  elevation: number; // in meters
}

export function ElevationSlide({ elevation }: ElevationSlideProps) {
  const everestHeight = 8849;
  const everests = (elevation / everestHeight).toFixed(2);
  const burjKhalifa = 828;
  const burjKhalifas = Math.round(elevation / burjKhalifa);

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-zinc-900">
      {/* Mountain silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            d="M0,150 L50,80 L100,120 L150,40 L200,100 L250,20 L300,90 L350,50 L400,150 Z"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Snow particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, 300],
            x: [0, Math.sin(i) * 50],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: '10%',
          }}
        />
      ))}

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6"
        >
          <Mountain className="w-16 h-16 mx-auto text-white/80" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-lg mb-2 uppercase tracking-wider"
        >
          You climbed
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          className="mb-2"
        >
          <AnimatedNumber
            value={elevation}
            decimals={0}
            className="stat-number text-6xl md:text-7xl text-white"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/90 text-2xl font-semibold mb-12"
        >
          meters of elevation
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <div className="glass-card px-6 py-4 bg-white/10">
            <p className="text-white/70 text-sm">That's like climbing</p>
            <p className="text-white text-xl font-bold">
              Mount Everest {everests}x 🏔️
            </p>
          </div>

          <div className="glass-card px-6 py-4 bg-white/10">
            <p className="text-white/70 text-sm">Or scaling</p>
            <p className="text-white text-xl font-bold">
              {burjKhalifas} Burj Khalifas 🏙️
            </p>
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

