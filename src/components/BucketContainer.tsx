import { motion, AnimatePresence } from 'framer-motion';
import { Bucket } from '@/types/radixSort';

interface BucketContainerProps {
  bucket: Bucket;
  isActive: boolean;
}

const bucketColorClasses: Record<number, string> = {
  0: 'border-bucket-0 bg-bucket-0/10',
  1: 'border-bucket-1 bg-bucket-1/10',
  2: 'border-bucket-2 bg-bucket-2/10',
  3: 'border-bucket-3 bg-bucket-3/10',
  4: 'border-bucket-4 bg-bucket-4/10',
  5: 'border-bucket-5 bg-bucket-5/10',
  6: 'border-bucket-6 bg-bucket-6/10',
  7: 'border-bucket-7 bg-bucket-7/10',
  8: 'border-bucket-8 bg-bucket-8/10',
  9: 'border-bucket-9 bg-bucket-9/10',
};

const bucketLabelClasses: Record<number, string> = {
  0: 'bg-bucket-0',
  1: 'bg-bucket-1',
  2: 'bg-bucket-2',
  3: 'bg-bucket-3',
  4: 'bg-bucket-4',
  5: 'bg-bucket-5',
  6: 'bg-bucket-6',
  7: 'bg-bucket-7',
  8: 'bg-bucket-8',
  9: 'bg-bucket-9',
};

export const BucketContainer = ({ bucket, isActive }: BucketContainerProps) => {
  return (
    <motion.div
      className={`flex flex-col items-center transition-all duration-300 ${
        isActive ? 'scale-105' : ''
      }`}
      animate={{ scale: isActive ? 1.05 : 1 }}
    >
      {/* Bucket label */}
      <div 
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md mb-2 ${
          bucketLabelClasses[bucket.digit]
        }`}
      >
        {bucket.digit}
      </div>
      
      {/* Bucket container */}
      <div
        className={`min-w-[50px] min-h-[100px] border-2 border-dashed rounded-lg p-2 flex flex-col-reverse items-center gap-1 transition-all duration-300 ${
          bucketColorClasses[bucket.digit]
        } ${isActive ? 'border-solid shadow-md' : ''}`}
      >
        <AnimatePresence mode="popLayout">
          {bucket.elements.map((element, idx) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`w-10 h-8 rounded flex items-center justify-center text-white font-mono text-xs font-medium shadow-sm ${
                bucketLabelClasses[bucket.digit]
              }`}
            >
              {element.value}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {bucket.elements.length === 0 && (
          <span className="text-muted-foreground/50 text-xs">empty</span>
        )}
      </div>
      
      {/* Count badge */}
      {bucket.elements.length > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-1 text-xs text-muted-foreground font-medium"
        >
          ({bucket.elements.length})
        </motion.span>
      )}
    </motion.div>
  );
};
