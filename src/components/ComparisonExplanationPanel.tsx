import { motion, AnimatePresence } from 'framer-motion';
import { ComparisonSortStep } from '@/types/comparisonSort';
import { Info, CheckCircle2, ArrowRight, ArrowLeftRight, Split, Merge } from 'lucide-react';

interface ComparisonExplanationPanelProps {
    currentStep: ComparisonSortStep | null;
    stepNumber: number;
    totalSteps: number;
}

export const ComparisonExplanationPanel = ({
    currentStep,
    stepNumber,
    totalSteps,
}: ComparisonExplanationPanelProps) => {
    if (!currentStep) {
        return (
            <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Info className="w-5 h-5" />
                    <span>Click "Start Visualization" to begin</span>
                </div>
            </div>
        );
    }

    const phaseInfo = {
        initial: { icon: Info, color: 'text-primary', label: 'Setup' },
        compare: { icon: ArrowRight, color: 'text-yellow-500', label: 'Comparing' },
        swap: { icon: ArrowLeftRight, color: 'text-red-500', label: 'Swapping' },
        overwrite: { icon: ArrowRight, color: 'text-blue-500', label: 'Overwriting' },
        partition: { icon: Split, color: 'text-purple-500', label: 'Partitioning' },
        merge: { icon: Merge, color: 'text-blue-600', label: 'Merging' },
        complete: { icon: CheckCircle2, color: 'text-green-500', label: 'Complete' },
    };

    const currentPhaseInfo = phaseInfo[currentStep.phase] || phaseInfo.initial;
    const PhaseIcon = currentPhaseInfo.icon;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={stepNumber}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-card rounded-xl border border-border p-5 shadow-soft space-y-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PhaseIcon className={`w-5 h-5 ${currentPhaseInfo.color}`} />
                        <span className={`font-medium ${currentPhaseInfo.color} capitalize`}>
                            {currentPhaseInfo.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Step {stepNumber + 1} of {totalSteps}
                        </span>
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${((stepNumber + 1) / totalSteps) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Explanation */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-foreground text-lg">
                        {currentStep.explanation}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {currentStep.detailedExplanation}
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
