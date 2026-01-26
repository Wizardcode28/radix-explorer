import { motion, AnimatePresence } from 'framer-motion';
import { SortStep } from '@/types/radixSort';
import { Info, CheckCircle2, ArrowRight, CircleDot } from 'lucide-react';

interface ExplanationPanelProps {
  currentStep: SortStep | null;
  stepNumber: number;
  totalSteps: number;
  maxDigits: number;
}

export const ExplanationPanel = ({ 
  currentStep, 
  stepNumber, 
  totalSteps,
  maxDigits 
}: ExplanationPanelProps) => {
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
    initial: { icon: CircleDot, color: 'text-primary', label: 'Ready' },
    distribute: { icon: ArrowRight, color: 'text-accent', label: 'Distributing' },
    collect: { icon: ArrowRight, color: 'text-primary', label: 'Collecting' },
    complete: { icon: CheckCircle2, color: 'text-bar-sorted', label: 'Complete' },
  };

  const currentPhaseInfo = phaseInfo[currentStep.phase];
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
            <span className={`font-medium ${currentPhaseInfo.color}`}>
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

        {/* Current Digit Info */}
        {currentStep.phase !== 'complete' && currentStep.phase !== 'initial' && (
          <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Processing:</span>
              <span className="font-semibold text-accent capitalize">
                {currentStep.digitName} digit
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              (Position {currentStep.digitPosition + 1} of {maxDigits})
            </div>
          </div>
        )}

        {/* Main Explanation */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">
            {currentStep.explanation}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentStep.detailedExplanation}
          </p>
        </div>

        {/* Radix Sort Info */}
        {currentStep.phase === 'initial' && (
          <div className="bg-primary/5 rounded-lg p-4 space-y-2 border border-primary/10">
            <h4 className="text-sm font-medium text-primary">About LSD Radix Sort</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              LSD (Least Significant Digit) Radix Sort processes digits from right to left. 
              It uses counting sort as a stable subroutine to distribute elements into buckets 
              based on each digit position, then collects them in order.
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
