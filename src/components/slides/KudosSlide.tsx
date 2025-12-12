import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Heart } from 'lucide-react';

interface KudosSlideProps {
  totalKudos: number;
  totalActivities: number;
  isKudosGiven?: boolean;
}

export function KudosSlide({ totalKudos, totalActivities, isKudosGiven = false }: KudosSlideProps) {
  const avgKudos = totalActivities > 0 ? (totalKudos / totalActivities).toFixed(1) : '0';

  // Fun kudos messages - different for given vs received
  let kudosMessage = '';
  let kudosEmoji = '';

  if (isKudosGiven) {
    // Messages for kudos given
    if (totalKudos >= 1000) {
      kudosMessage = "You're the ultimate hype person!";
      kudosEmoji = '🎉';
    } else if (totalKudos >= 500) {
      kudosMessage = 'Community champion!';
      kudosEmoji = '🏆';
    } else if (totalKudos >= 200) {
      kudosMessage = 'Spreading the love!';
      kudosEmoji = '💕';
    } else if (totalKudos >= 50) {
      kudosMessage = 'Great supporter!';
      kudosEmoji = '👏';
    } else {
      kudosMessage = 'Every kudos counts!';
      kudosEmoji = '💪';
    }
  } else {
    // Messages for kudos received
    if (totalKudos >= 1000) {
      kudosMessage = "You're basically famous!";
      kudosEmoji = '🌟';
    } else if (totalKudos >= 500) {
      kudosMessage = 'Community favorite!';
      kudosEmoji = '❤️‍🔥';
    } else if (totalKudos >= 200) {
      kudosMessage = 'The love is real!';
      kudosEmoji = '💕';
    } else if (totalKudos >= 50) {
      kudosMessage = 'Your friends support you!';
      kudosEmoji = '👏';
    } else {
      kudosMessage = 'Quality over quantity!';
      kudosEmoji = '💪';
    }
  }

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-red-500 via-rose-500 to-pink-600">
      {/* Floating hearts */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-50, -300],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute text-2xl"
          style={{
            left: `${5 + i * 6}%`,
            bottom: '20%',
          }}
        >
          {['❤️', '🧡', '💛', '💚', '💙', '💜'][i % 6]}
        </motion.div>
      ))}

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.2, 1] }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <Heart className="w-16 h-16 mx-auto text-white fill-white" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/80 text-lg mb-2 uppercase tracking-wider"
        >
          {isKudosGiven ? 'You gave' : 'You received'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
          className="mb-2"
        >
          <AnimatedNumber
            value={totalKudos}
            decimals={0}
            className="stat-number text-7xl md:text-8xl text-white"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/90 text-2xl font-semibold mb-8"
        >
          kudos 👏
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-8"
        >
          <span className="text-5xl">{kudosEmoji}</span>
          <p className="text-white text-xl font-bold mt-2">{kudosMessage}</p>
        </motion.div>

        {!isKudosGiven && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="glass-card px-6 py-4 bg-white/10 inline-block"
          >
            <p className="text-white/70 text-sm">Average per activity</p>
            <p className="text-white text-2xl font-bold">{avgKudos} kudos</p>
          </motion.div>
        )}
      </div>
    </SlideWrapper>
  );
}

