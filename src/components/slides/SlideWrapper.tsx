import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeIn } from '../../constants';

interface SlideWrapperProps {
  children: ReactNode;
  className?: string;
}

export function SlideWrapper({ children, className = '' }: SlideWrapperProps) {
  return (
    <motion.div
      {...fadeIn}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`slide-container flex items-center justify-center ${className}`}
    >
      <div className="w-full max-w-[430px] min-h-dvh flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </motion.div>
  );
}

