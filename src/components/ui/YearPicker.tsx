import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface YearPickerProps {
  selectedYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
}

export function YearPicker({ selectedYear, availableYears, onYearChange }: YearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <span className="font-semibold">{selectedYear}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden min-w-[120px]"
            >
              <div className="max-h-[300px] overflow-y-auto py-2">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      onYearChange(year);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-center hover:bg-white/10 transition-colors ${
                      year === selectedYear ? 'text-orange-500 font-bold' : ''
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

