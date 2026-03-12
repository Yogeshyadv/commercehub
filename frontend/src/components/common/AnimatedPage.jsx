import { motion } from 'framer-motion';

const variants = {
  initial:  { opacity: 0, y: 12 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
  exit:     { opacity: 0, y: -6, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
};

export default function AnimatedPage({ children, className = '' }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Reusable motion primitives ─────────────────────────────── */

/** Card that lifts slightly on hover */
export function MotionCard({ children, className = '', style, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/** Button that scales down on press */
export function MotionButton({ children, className = '', style, onClick, disabled, type = 'button', title }) {
  return (
    <motion.button
      type={type}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.1 }}
      className={className}
      style={style}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </motion.button>
  );
}

/** List item that fades + slides in, staggered by index */
export function MotionListItem({ children, className = '', style, index = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, delay: index * 0.04, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ backgroundColor: 'var(--surface-1)' }}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/** Right-side sliding drawer with AnimatePresence support */
export function MotionDrawer({ children, isOpen }) {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}

/** Fade-scale overlay backdrop */
export function MotionBackdrop({ onClick }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
    />
  );
}

/** Stats / KPI number counter (count-up feel via motion) */
export function MotionStat({ children, className = '', style }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
