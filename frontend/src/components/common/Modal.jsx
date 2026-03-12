import { useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className={clsx(
                'relative w-full rounded-2xl shadow-2xl',
                'bg-white dark:bg-[#111111]',
                'border border-gray-200 dark:border-white/[0.08]',
                'shadow-black/10 dark:shadow-black/60',
                sizeMap[size]
              )}
            >
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.07]">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-gray-400 dark:text-[#6060a0]
                      hover:text-gray-700 dark:hover:text-white
                      hover:bg-gray-100 dark:hover:bg-white/[0.07]
                      transition-colors"
                  >
                    <HiX className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="p-6">{children}</div>
              {footer && (
                <div className="flex items-center justify-end gap-3 px-6 py-4
                  border-t border-gray-100 dark:border-white/[0.07]
                  bg-gray-50 dark:bg-white/[0.02] rounded-b-2xl">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
