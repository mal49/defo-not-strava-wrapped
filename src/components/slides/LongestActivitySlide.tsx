import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { Trophy } from 'lucide-react';
import type { StravaActivity } from '../../types/strava';
import { getActivityEmoji } from '../../services/dataProcessing';

interface LongestActivitySlideProps {
  activity: StravaActivity;
}

export function LongestActivitySlide({ activity }: LongestActivitySlideProps) {
  const distanceKm = (activity.distance / 1000).toFixed(2);
  const hours = Math.floor(activity.moving_time / 3600);
  const minutes = Math.floor((activity.moving_time % 3600) / 60);
  const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  const date = new Date(activity.start_date_local).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
  const emoji = getActivityEmoji(activity.sport_type || activity.type);

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500">
      {/* Confetti effect */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -20, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, 400],
            rotate: 360,
            x: Math.sin(i * 0.5) * 100,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'][i % 5],
          }}
        />
      ))}

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="mb-6"
        >
          <Trophy className="w-20 h-20 mx-auto text-white" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/90 text-lg mb-2 uppercase tracking-wider"
        >
          Your longest adventure
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="mb-8"
        >
          <span className="text-6xl">{emoji}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card px-6 py-6 bg-white/20 mb-6"
        >
          <h3 className="text-white text-xl font-bold mb-4 line-clamp-2">
            {activity.name}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="stat-number text-3xl text-white">{distanceKm}</p>
              <p className="text-white/70 text-sm">kilometers</p>
            </div>
            <div>
              <p className="stat-number text-3xl text-white">{timeStr}</p>
              <p className="text-white/70 text-sm">duration</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-4"
        >
          <div className="glass-card px-4 py-2 bg-white/10">
            <p className="text-white/70 text-xs">Date</p>
            <p className="text-white font-semibold">{date}</p>
          </div>
          
          {activity.total_elevation_gain > 0 && (
            <div className="glass-card px-4 py-2 bg-white/10">
              <p className="text-white/70 text-xs">Elevation</p>
              <p className="text-white font-semibold">{Math.round(activity.total_elevation_gain)}m</p>
            </div>
          )}
          
          {activity.kudos_count > 0 && (
            <div className="glass-card px-4 py-2 bg-white/10">
              <p className="text-white/70 text-xs">Kudos</p>
              <p className="text-white font-semibold">{activity.kudos_count} 👏</p>
            </div>
          )}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

