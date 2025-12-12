import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseStravaExport } from '../services/stravaExportParser';
import { useAuth } from '../context/AuthContext';

interface FileUploadProps {
  onBack: () => void;
}

export function FileUpload({ onBack }: FileUploadProps) {
  const { loginWithFileUpload } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setError('Please upload a ZIP file from your Strava export.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress('Reading ZIP file...');

    try {
      setProgress('Parsing activities...');
      const { activities, athlete } = await parseStravaExport(file);
      
      setProgress(`Found ${activities.length} activities!`);
      
      // Small delay to show the success message
      await new Promise(resolve => setTimeout(resolve, 500));
      
      loginWithFileUpload(activities, athlete);
    } catch (err) {
      console.error('Error parsing file:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse the file. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

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
          className="absolute top-1/4 -right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[430px] mx-auto min-h-dvh flex flex-col items-center justify-center text-center px-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="absolute top-6 left-6 text-white/60 hover:text-white flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-teal-500/30">
            <span className="text-4xl">📁</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Upload Strava Export
          </h2>
          <p className="text-white/60 text-sm">
            Drop your Strava export ZIP file here
          </p>
        </motion.div>

        {/* Drop zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-8"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 cursor-pointer
              transition-all duration-300
              ${isDragging 
                ? 'border-teal-400 bg-teal-500/10' 
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
              }
              ${isProcessing ? 'pointer-events-none' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-12 h-12 border-3 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                  <p className="text-white/80">{progress}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className={`text-5xl transition-transform ${isDragging ? 'scale-110' : ''}`}>
                    {isDragging ? '📥' : '📤'}
                  </div>
                  <div>
                    <p className="text-white/80 mb-1">
                      {isDragging ? 'Drop it here!' : 'Click or drag to upload'}
                    </p>
                    <p className="text-white/40 text-xs">
                      Accepts .zip files from Strava export
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-left w-full"
        >
          <h3 className="text-white/80 font-medium mb-3 text-sm">How to get your Strava export:</h3>
          <ol className="text-white/50 text-xs space-y-2">
            <li className="flex gap-2">
              <span className="text-teal-400 font-bold">1.</span>
              Go to strava.com → Settings → My Account
            </li>
            <li className="flex gap-2">
              <span className="text-teal-400 font-bold">2.</span>
              Click "Download or Delete Your Account"
            </li>
            <li className="flex gap-2">
              <span className="text-teal-400 font-bold">3.</span>
              Click "Request Your Archive"
            </li>
            <li className="flex gap-2">
              <span className="text-teal-400 font-bold">4.</span>
              Wait for email with download link (may take a few hours)
            </li>
            <li className="flex gap-2">
              <span className="text-teal-400 font-bold">5.</span>
              Upload the ZIP file here
            </li>
          </ol>
        </motion.div>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/30 text-xs mt-6"
        >
          🔒 Your data is processed locally and never uploaded to any server.
        </motion.p>
      </div>
    </div>
  );
}

