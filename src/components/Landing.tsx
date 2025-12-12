import { motion } from 'framer-motion';
import { getAuthUrl } from '../services/stravaApi';
import { useState } from 'react';
import { FileUpload } from './FileUpload';

export function Landing() {
  const [isLoading, setIsLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const url = await getAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      setIsLoading(false);
    }
  };

  // Show file upload screen
  if (showFileUpload) {
    return <FileUpload onBack={() => setShowFileUpload(false)} />;
  }

  return (
    <div className="slide-container relative overflow-hidden bg-zinc-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[430px] mx-auto min-h-dvh flex flex-col items-center justify-center text-center px-8">
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-3xl gradient-orange flex items-center justify-center shadow-2xl shadow-orange-500/30">
            <span className="text-5xl">🏃</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Strava
            <span className="text-gradient-orange"> Wrapped</span>
          </h1>
          <p className="text-white/60 text-lg">Your year in motion</p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="my-10 space-y-3"
        >
          {[
            { emoji: '📊', text: 'Total distance & time' },
            { emoji: '🏔️', text: 'Elevation conquered' },
            { emoji: '📅', text: 'Monthly breakdown' },
            { emoji: '🏆', text: 'Personal highlights' },
            { emoji: '📱', text: 'Shareable summary' },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center gap-3 text-left"
            >
              <span className="text-2xl">{feature.emoji}</span>
              <span className="text-white/80">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="w-full space-y-3"
        >
          {/* Connect with Strava button */}
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="btn-primary w-full max-w-xs mx-auto flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                Connect with Strava
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 max-w-xs mx-auto">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Upload file button */}
          <button
            onClick={() => setShowFileUpload(true)}
            className="w-full max-w-xs mx-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl
                       bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                       text-white/80 hover:text-white transition-all duration-200"
          >
            <span className="text-xl">📁</span>
            Upload Strava Export
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-white/30 text-xs mt-8"
        >
          Your data stays private. We only read your activities.
        </motion.p>
      </div>
    </div>
  );
}
