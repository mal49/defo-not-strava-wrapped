import { motion, AnimatePresence } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { Download, Github, Instagram, X } from 'lucide-react';
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
  const [showAboutDev, setShowAboutDev] = useState(false);

  const topActivityType = Object.entries(stats.activityTypes)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Activity';

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Shareable Card - Tall story format */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <div
            ref={cardRef}
            className="rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}
          >
            {/* Top gradient accent */}
            <div className="h-1.5 bg-gradient-to-r from-orange-500 via-teal-400 to-purple-500" />
            
            <div className="p-6">
              {/* Profile Section */}
              <div className="flex flex-col items-center mb-8 pt-2">
                {profilePicture ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-orange-500/60 shadow-lg shadow-orange-500/20 mb-3">
                    <img
                      src={profilePicture}
                      alt={athleteName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-3xl font-bold text-white mb-3 shadow-lg shadow-orange-500/20">
                    {athleteName.charAt(0).toUpperCase()}
                  </div>
                )}
                <h2 className="text-white font-bold text-xl">{athleteName}</h2>
                <p className="text-orange-400 text-sm flex items-center gap-1.5 mt-1">
                  <span>{getActivityEmoji(topActivityType)}</span>
                  {topActivityType} enthusiast
                </p>
              </div>

              {/* Year Badge */}
              <div className="text-center mb-8">
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">Year in Review</p>
                <p className="text-6xl font-bold text-white stat-number">{year}</p>
              </div>

              {/* Main Stats */}
              <div className="space-y-3 mb-8">
                {/* Distance - Hero stat */}
                <div className="bg-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="stat-number text-4xl text-orange-500">{stats.totalDistance.toFixed(0)}</p>
                    <p className="text-white/50 text-sm mt-1">kilometers traveled</p>
                  </div>
                  <div className="text-4xl">🏃</div>
                </div>

                {/* Two column stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="stat-number text-3xl text-teal-400">{stats.totalTime.toFixed(0)}</p>
                    <p className="text-white/50 text-xs mt-1">hours active</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="stat-number text-3xl text-purple-400">{stats.totalActivities}</p>
                    <p className="text-white/50 text-xs mt-1">activities</p>
                  </div>
                </div>

                {/* Elevation */}
                <div className="bg-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="stat-number text-4xl text-yellow-400">{stats.totalElevation.toLocaleString()}</p>
                    <p className="text-white/50 text-sm mt-1">meters climbed</p>
                  </div>
                  <div className="text-4xl">⛰️</div>
                </div>
              </div>

              {/* Activity Breakdown */}
              <div className="mb-6">
                <p className="text-white/30 text-xs uppercase tracking-wider mb-3 text-center">Activities</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {Object.entries(stats.activityTypes)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([type, count]) => (
                      <div
                        key={type}
                        className="bg-white/5 rounded-full px-4 py-2 flex items-center gap-2"
                      >
                        <span className="text-lg">{getActivityEmoji(type)}</span>
                        <span className="text-white font-semibold">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-500 to-orange-600" />
                  <span className="text-white/50 text-sm font-medium">Strava Wrapped</span>
                </div>
                <div className="flex gap-1.5">
                  {['🏃', '🚴', '🏊', '💪'].map((emoji, i) => (
                    <span key={i} className="text-sm opacity-40">{emoji}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
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
          transition={{ delay: 0.8 }}
          className="text-white/40 text-sm text-center mt-4"
        >
          Thanks for an amazing year! 🎉
        </motion.p>

        {/* About Dev Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setShowAboutDev(true)}
          className="mt-6 text-white/30 text-xs hover:text-white/60 transition-colors underline underline-offset-2"
        >
          About the Developer
        </motion.button>
      </div>

      {/* About Dev Modal */}
      <AnimatePresence>
        {showAboutDev && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAboutDev(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm"
            >
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={() => setShowAboutDev(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

                <div className="p-8">
                  {/* Avatar */}
                  <div className="flex justify-center mb-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 p-[3px]">
                      <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                        <span className="text-3xl">👨‍💻</span>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-white font-bold text-xl text-center mb-1">
                    Ikhmal Hanif
                  </h3>
                  <p className="text-white/40 text-sm text-center mb-6">
                    Creator of Strava Wrapped
                  </p>

                  {/* Social Links */}
                  <div className="space-y-3">
                    {/* GitHub */}
                    <a
                      href="https://github.com/mal49"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Github className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">GitHub</p>
                        <p className="text-white/40 text-xs">@mal49</p>
                      </div>
                      <span className="text-white/30 text-xs">→</span>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com/imalanep_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">Instagram</p>
                        <p className="text-white/40 text-xs">@imalanep_</p>
                      </div>
                      <span className="text-white/30 text-xs">→</span>
                    </a>

                    {/* Threads */}
                    <a
                      href="https://threads.net/@imalanep_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/20">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.106-1.146 3.451-1.172.96-.019 1.856.09 2.689.327.012-.59-.007-1.152-.055-1.685-.112-1.187-.473-1.93-.948-2.404-.526-.526-1.303-.829-2.317-.903l.142-2.106c1.474.1 2.664.593 3.54 1.468.824.824 1.32 1.907 1.473 3.22.076.657.098 1.378.066 2.153.9.477 1.67 1.08 2.29 1.804.965 1.126 1.478 2.476 1.483 3.903.006 1.503-.48 2.98-1.407 4.274-1.164 1.627-2.913 2.785-5.2 3.442-1.252.36-2.62.538-4.063.538zm-.01-9.905c-.936.018-1.69.233-2.184.623-.472.372-.678.862-.649 1.54.039.703.36 1.216.957 1.524.646.333 1.5.434 2.312.39 1.076-.058 1.876-.453 2.378-1.175.3-.43.53-.988.682-1.67-.848-.27-1.77-.412-2.746-.412-.25 0-.5.007-.75.02v-.84z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">Threads</p>
                        <p className="text-white/40 text-xs">@imalanep_</p>
                      </div>
                      <span className="text-white/30 text-xs">→</span>
                    </a>
                  </div>

                  {/* Footer message */}
                  <p className="text-white/30 text-xs text-center mt-6">
                    Built with ❤️ for the Strava community
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SlideWrapper>
  );
}

