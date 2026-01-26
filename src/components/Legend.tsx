import { motion } from 'framer-motion';

export const Legend = () => {
  const items = [
    { color: 'bg-bar', label: 'Default Element' },
    { color: 'bg-bar-active', label: 'Currently Processing' },
    { color: 'bg-bar-sorted', label: 'Sorted' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-4 shadow-soft"
    >
      <h3 className="text-sm font-medium text-foreground mb-3">Legend</h3>
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${item.color}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-border">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Bucket Colors</h4>
        <div className="flex flex-wrap gap-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <div
              key={digit}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold bg-bucket-${digit}`}
              style={{
                backgroundColor: `hsl(var(--bucket-${digit}))`,
              }}
            >
              {digit}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
