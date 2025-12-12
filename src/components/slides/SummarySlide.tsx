import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { Download } from 'lucide-react';
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import type { WrappedStats } from '../../types/strava';
import { getActivityEmoji } from '../../services/dataProcessing';

interface SummarySlideProps {
  stats: WrappedStats;
  year: number;
  athleteName: string;
  profilePicture?: string;
}

export function SummarySlide({ stats, year, athleteName, profilePicture }: SummarySlideProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const topActivityType = Object.entries(stats.activityTypes)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Activity';

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      // Clone the element to avoid modifying the original
      const element = cardRef.current;
      
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#18181b',
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        filter: (node) => {
          // Skip images that might cause CORS issues
          if (node instanceof HTMLImageElement) {
            return false;
          }
          return true;
        },
      });
      
      const link = document.createElement('a');
      link.download = `strava-wrapped-${year}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download:', error);
      alert('Failed to save image. Please try again or take a screenshot instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SlideWrapper className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/80 text-lg mb-6 uppercase tracking-wider text-center"
        >
          Your {year} Summary
        </motion.p>

        {/* Shareable Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <div
            ref={cardRef}
            className="bg-zinc-800/90 rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-sm"
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/60 text-sm">Strava Wrapped</p>
              <p className="text-white font-bold text-xl">{year}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white font-semibold">{athleteName}</p>
                <p className="text-orange-500 text-sm">
                  {getActivityEmoji(topActivityType)} {topActivityType} lover
                </p>
              </div>
              {profilePicture && (
                <img
                  src={profilePicture}
                  alt={athleteName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/50"
                />
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="stat-number text-2xl text-orange-500">
                {stats.totalDistance.toFixed(0)}
              </p>
              <p className="text-white/60 text-sm">kilometers</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="stat-number text-2xl text-teal-400">
                {stats.totalTime.toFixed(0)}
              </p>
              <p className="text-white/60 text-sm">hours</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="stat-number text-2xl text-purple-400">
                {stats.totalActivities}
              </p>
              <p className="text-white/60 text-sm">activities</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="stat-number text-2xl text-yellow-400">
                {stats.totalElevation.toFixed(0)}
              </p>
              <p className="text-white/60 text-sm">meters climbed</p>
            </div>
          </div>

          {/* Activity breakdown mini */}
          <div className="flex gap-2 justify-center flex-wrap">
            {Object.entries(stats.activityTypes)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([type, count]) => (
                <div
                  key={type}
                  className="bg-white/5 rounded-full px-3 py-1 flex items-center gap-1"
                >
                  <span>{getActivityEmoji(type)}</span>
                  <span className="text-white/80 text-sm">{count}</span>
                </div>
              ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/40 text-xs">strava-wrapped</span>
            <div className="flex gap-1">
              {['🏃', '🚴', '🏊', '💪'].map((emoji, i) => (
                <span key={i} className="text-sm opacity-60">{emoji}</span>
              ))}
            </div>
          </div>
          </div>
        </motion.div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-primary flex items-center gap-2 px-8 py-3"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Saving...' : 'Save Image'}
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/40 text-sm text-center mt-6"
        >
          Thanks for an amazing year! 🎉
        </motion.p>
      </div>
    </SlideWrapper>
  );
}

