import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({ label, value, onChange, options, error, isDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedLabel = options.find(opt => opt.value === value)?.label || value;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={`w-full border rounded-xl cursor-pointer group relative shadow-sm outline-none transition-all duration-300
          ${isDark 
            ? `bg-slate-900/50 border-slate-700 text-slate-200 hover:bg-slate-900/80 hover:border-slate-600 ${isOpen ? '!border-green-500 ring-1 ring-green-500 bg-slate-900' : ''}` 
            : `bg-white border-gray-200 text-gray-900 hover:border-green-500 ${isOpen ? '!border-green-500 ring-1 ring-green-500' : ''}`
          }
          ${error ? '!border-red-500' : ''}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between px-4 py-3 h-full">
            <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'} ${error ? 'text-red-600' : ''}`}>{selectedLabel}</span>
             
            {/* Chevron */}
            <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-600' : (isDark ? 'text-slate-500 group-hover:text-green-500' : 'text-gray-400 group-hover:text-green-600')}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 8 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 left-0 right-0 top-full border rounded-2xl shadow-xl overflow-hidden backdrop-blur-md
              ${isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white border-slate-200'}
            `}
          >
            <div className="py-2 max-h-[200px] overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    px-5 py-3 text-sm font-bold cursor-pointer transition-all duration-200
                    flex items-center justify-between
                    ${option.value === value 
                      ? (isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700')
                      : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')
                    }
                  `}
                >
                  {option.label}
                  {option.value === value && (
                    <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
