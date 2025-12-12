import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  total: number;
  current: number;
}

export function ProgressIndicator({ total, current }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className="progress-dot"
          initial={false}
          animate={{
            width: index === current ? 24 : 8,
            background: index === current ? 'white' : 'rgba(255, 255, 255, 0.3)',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

