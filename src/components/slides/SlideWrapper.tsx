import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SlideWrapperProps {
  children: ReactNode;
  gradient?: string;
  className?: string;
}

export function SlideWrapper({ children, gradient = 'gradient-dark', className = '' }: SlideWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`slide-container flex items-center justify-center ${gradient} ${className}`}
    >
      <div className="w-full max-w-[430px] min-h-dvh flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </motion.div>
  );
}

