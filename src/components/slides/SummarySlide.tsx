import { motion, AnimatePresence } from 'framer-motion';
import { SlideWrapper } from './SlideWrapper';
import { Download, Github, Instagram, X, Sparkles } from 'lucide-react';
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
      // Filter out problematic elements and handle CORS
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        filter: (node) => {
          // Skip elements that might cause issues
          if (node instanceof Element) {
            const tagName = node.tagName?.toLowerCase();
            // Skip external images that might have CORS issues
            if (tagName === 'img') {
              const src = node.getAttribute('src') || '';
              // Allow data URLs and relative paths
              if (src.startsWith('data:') || src.startsWith('/') || src.startsWith('./')) {
                return true;
              }
              // Skip external URLs that might have CORS issues
              return false;
            }
          }
          return true;
        },
        style: {
          // Ensure background is captured
          backgroundColor: '#0d0d0d',
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
      // Try alternative method with fewer options
      try {
        const dataUrl = await toPng(cardRef.current, {
          quality: 0.95,
          pixelRatio: 2,
          skipFonts: true,
          filter: () => true,
        });
        const link = document.createElement('a');
        link.download = `strava-wrapped-${year}.png`;
        link.href = dataUrl;
        link.click();
      } catch {
        alert('Failed to save image. Please take a screenshot instead (use your device\'s screenshot feature).');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SlideWrapper className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Shareable Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full"
        >
          <div
            ref={cardRef}
            className="relative rounded-[2rem] overflow-hidden"
            style={{ background: 'linear-gradient(165deg, #1a1a1a 0%, #0d0d0d 50%, #0a0a0a 100%)' }}
          >
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-[2rem] p-[1px] bg-gradient-to-br from-orange-500/50 via-purple-500/20 to-teal-500/30 -z-10" />
            
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-orange-500/10 to-transparent blur-2xl" />
            
            <div className="relative p-6">
              {/* Header with year */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                    </svg>
                  </div>
                  <span className="text-white/40 text-xs font-medium tracking-wider uppercase">Wrapped</span>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <span className="text-white font-bold text-sm">{year}</span>
                </div>
              </div>

              {/* Profile Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  {/* Glow ring */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-full blur-md opacity-60" />
                  {profilePicture ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/20">
                      <img
                        src={profilePicture}
                        alt={athleteName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-4xl font-bold text-white ring-2 ring-white/20">
                      {athleteName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-white font-bold text-2xl tracking-tight">{athleteName}</h2>
                <div className="flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                  <span className="text-lg">{getActivityEmoji(topActivityType)}</span>
                  <span className="text-orange-400 text-sm font-medium">{topActivityType} Athlete</span>
                </div>
              </div>

              {/* Hero Stat - Distance */}
              <div className="relative mb-4 p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-end justify-between">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Total Distance</p>
                    <div className="flex items-baseline gap-2">
                      <span className="stat-number text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                        {stats.totalDistance.toFixed(0)}
                      </span>
                      <span className="text-orange-400/70 text-xl font-semibold">km</span>
                    </div>
                  </div>
                  <div className="text-5xl opacity-80">🏃</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <p className="stat-number text-2xl font-bold text-teal-400">{stats.totalTime.toFixed(0)}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1">Hours</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <p className="stat-number text-2xl font-bold text-purple-400">{stats.totalActivities}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1">Activities</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <p className="stat-number text-2xl font-bold text-amber-400">{(stats.totalElevation / 1000).toFixed(1)}k</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1">Elevation</p>
                </div>
              </div>

              {/* Activity Pills */}
              <div className="flex gap-2 justify-center flex-wrap mb-6">
                {Object.entries(stats.activityTypes)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([type, count], index) => (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]"
                    >
                      <span className="text-base">{getActivityEmoji(type)}</span>
                      <span className="text-white/70 text-sm font-medium">{count}</span>
                    </motion.div>
                  ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-white/30 text-xs font-medium">Strava Wrapped</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-orange-500/50" />
                  <span className="text-white/20 text-[10px]">{year}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Saving...' : 'Save Image'}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/30 text-sm text-center mt-4"
        >
          Thanks for an amazing year! 🎉
        </motion.p>

        {/* About Dev Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setShowAboutDev(true)}
          className="mt-4 text-white/20 text-xs hover:text-white/50 transition-colors"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm"
            >
              <div className="relative rounded-3xl overflow-hidden bg-[#0d0d0d] border border-white/10 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={() => setShowAboutDev(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

                <div className="p-8">
                  {/* Avatar */}
                  <div className="flex justify-center mb-5">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-full blur-md opacity-60" />
                      <div className="relative w-20 h-20 rounded-full bg-[#0d0d0d] ring-2 ring-white/10 flex items-center justify-center">
                        <span className="text-4xl">👨‍💻</span>
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
                  <div className="space-y-2">
                    {/* GitHub */}
                    <a
                      href="https://github.com/mal49"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <Github className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">GitHub</p>
                        <p className="text-white/40 text-xs">@mal49</p>
                      </div>
                      <span className="text-white/20 group-hover:text-white/40 transition-colors">→</span>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com/imalanep_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">Instagram</p>
                        <p className="text-white/40 text-xs">@imalanep_</p>
                      </div>
                      <span className="text-white/20 group-hover:text-white/40 transition-colors">→</span>
                    </a>

                    {/* Threads */}
                    <a
                      href="https://threads.net/@imalanep_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/10">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.106-1.146 3.451-1.172.96-.019 1.856.09 2.689.327.012-.59-.007-1.152-.055-1.685-.112-1.187-.473-1.93-.948-2.404-.526-.526-1.303-.829-2.317-.903l.142-2.106c1.474.1 2.664.593 3.54 1.468.824.824 1.32 1.907 1.473 3.22.076.657.098 1.378.066 2.153.9.477 1.67 1.08 2.29 1.804.965 1.126 1.478 2.476 1.483 3.903.006 1.503-.48 2.98-1.407 4.274-1.164 1.627-2.913 2.785-5.2 3.442-1.252.36-2.62.538-4.063.538zm-.01-9.905c-.936.018-1.69.233-2.184.623-.472.372-.678.862-.649 1.54.039.703.36 1.216.957 1.524.646.333 1.5.434 2.312.39 1.076-.058 1.876-.453 2.378-1.175.3-.43.53-.988.682-1.67-.848-.27-1.77-.412-2.746-.412-.25 0-.5.007-.75.02v-.84z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">Threads</p>
                        <p className="text-white/40 text-xs">@imalanep_</p>
                      </div>
                      <span className="text-white/20 group-hover:text-white/40 transition-colors">→</span>
                    </a>
                  </div>

                  {/* Footer message */}
                  <p className="text-white/20 text-xs text-center mt-6">
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
