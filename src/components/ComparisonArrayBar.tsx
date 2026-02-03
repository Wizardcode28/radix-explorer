import { motion } from 'framer-motion';
import { ComparisonArrayElement } from '@/types/comparisonSort';

interface ComparisonArrayBarProps {
    element: ComparisonArrayElement;
    maxValue: number;
    index: number;
    totalCount: number;
}

export const ComparisonArrayBar = ({ element, maxValue, index, totalCount }: ComparisonArrayBarProps) => {
    const minHeight = 40;
    const maxHeight = 200;

    // Calculate value for height (string length * 10 or numeric value)
    const val = typeof element.value === 'number' ? element.value : String(element.value).length * 10;
    // Fallback for visual scaling if value is very small
    const visualVal = Math.max(val, 5);
    const height = Math.max(minHeight, (visualVal / Math.max(maxValue, 1)) * maxHeight);

    // Calculate width
    const baseWidth = Math.max(20, Math.min(60, 600 / totalCount));

    const getColors = (status: ComparisonArrayElement['status']) => {
        switch (status) {
            case 'sorted': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
            case 'comparing': return 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]';
            case 'swapping': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
            case 'pivot': return 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]';
            case 'merged': return 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]';
            default: return 'bg-cyan-500';
        }
    };

    return (
        <motion.div
            layout
            transition={{
                duration: 0.2,
            }}
            className="flex flex-col items-center gap-2"
            style={{ width: baseWidth }}
        >
            <div className="flex flex-col justify-end h-full w-full items-center">
                <motion.span
                    className={`text-[10px] sm:text-xs font-semibold mb-1 truncate w-full text-center ${element.status !== 'default' ? 'text-primary' : 'text-muted-foreground'
                        }`}
                >
                    {element.value}
                </motion.span>

                <motion.div
                    className={`w-full rounded-t-md transition-colors duration-200 ${getColors(element.status)}`}
                    style={{ height }}
                    initial={{ height: 0 }}
                    animate={{ height }}
                />
            </div>
        </motion.div>
    );
};
