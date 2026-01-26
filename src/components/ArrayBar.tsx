import { motion } from 'framer-motion';
import { ArrayElement } from '@/types/radixSort';

interface ArrayBarProps {
  element: ArrayElement;
  maxValue: number;
  index: number;
  totalCount: number;
}

export const ArrayBar = ({ element, maxValue, index, totalCount }: ArrayBarProps) => {
  const minHeight = 30;
  const maxHeight = 180;
  const height = Math.max(minHeight, (element.value / maxValue) * maxHeight);
  
  // Calculate width based on container and count
  const baseWidth = Math.max(30, Math.min(60, 400 / totalCount));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: element.isActive ? 1.05 : 1,
      }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.02,
      }}
      className="flex flex-col items-center gap-1"
      style={{ width: baseWidth }}
    >
      {/* Value label */}
      <motion.span 
        className={`font-mono text-xs font-medium transition-colors duration-200 ${
          element.isActive ? 'text-accent' : 'text-foreground'
        }`}
        animate={{ scale: element.isActive ? 1.1 : 1 }}
      >
        {element.value}
      </motion.span>
      
      {/* Bar */}
      <motion.div
        className={`rounded-t-md transition-all duration-300 relative ${
          element.isActive 
            ? 'bg-bar-active shadow-glow animate-pulse-glow' 
            : 'bg-bar'
        }`}
        style={{ 
          height,
          width: '100%',
        }}
        animate={{
          backgroundColor: element.isActive 
            ? 'hsl(var(--bar-active))' 
            : 'hsl(var(--bar-default))',
        }}
      >
        {/* Digit highlight badge */}
        {element.currentDigit !== null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-md"
          >
            {element.currentDigit}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
