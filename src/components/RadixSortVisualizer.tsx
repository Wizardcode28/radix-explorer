import { motion, AnimatePresence } from 'framer-motion';
import { useRadixSort } from '@/hooks/useRadixSort';
import { ArrayBar } from './ArrayBar';
import { BucketContainer } from './BucketContainer';
import { ControlPanel } from './ControlPanel';
import { ExplanationPanel } from './ExplanationPanel';
import { Legend } from './Legend';

export const RadixSortVisualizer = () => {
  const {
    state,
    currentStep,
    isComplete,
    hasStarted,
    canGoNext,
    canGoPrev,
    setArray,
    start,
    nextStep,
    prevStep,
    reset,
    toggleAutoPlay,
    setSpeed,
  } = useRadixSort();

  const displayArray = currentStep?.array || state.currentArray;
  const displayBuckets = currentStep?.buckets || [];
  const maxValue = state.originalArray.length > 0
    ? Math.max(...state.originalArray.map(v => typeof v === 'number' ? v : String(v).length * 10)) // Simple heuristic for string height
    : 1;

  const currentDigit = currentStep?.phase === 'distribute'
    ? displayArray.find(el => el.isActive)?.currentDigit ?? null
    : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Radix Sort Visualizer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            An interactive visualization of LSD (Least Significant Digit) Radix Sort.
            Watch how elements are distributed into buckets based on each digit position.
          </p>
        </motion.header>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Left Panel - Controls */}
          <div className="space-y-4">
            <ControlPanel
              onSetArray={setArray}
              onStart={start}
              onNextStep={nextStep}
              onPrevStep={prevStep}
              onReset={reset}
              onToggleAutoPlay={toggleAutoPlay}
              onSpeedChange={setSpeed}
              isPlaying={state.isPlaying}
              hasStarted={hasStarted}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
              isComplete={isComplete}
              speed={state.speed}
            />
            <Legend />
          </div>

          {/* Right Panel - Visualization */}
          <div className="space-y-6">
            {/* Explanation Panel */}
            <ExplanationPanel
              currentStep={currentStep}
              stepNumber={state.currentStepIndex}
              totalSteps={state.steps.length}
              maxDigits={state.maxDigits}
            />

            {/* Array Visualization */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl border border-border p-6 shadow-soft"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Array</h2>
                {isComplete && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-bar-sorted text-white text-xs font-medium px-3 py-1 rounded-full"
                  >
                    ✓ Sorted
                  </motion.span>
                )}
              </div>

              <div className="flex items-end justify-center gap-2 min-h-[220px] overflow-x-auto py-4">
                <AnimatePresence mode="popLayout">
                  {displayArray.map((element, index) => (
                    <ArrayBar
                      key={element.id}
                      element={element}
                      maxValue={maxValue}
                      index={index}
                      totalCount={displayArray.length}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Buckets Visualization */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6 shadow-soft"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Buckets
                </h2>
                {currentStep?.phase === 'distribute' && (
                  <span className="text-sm text-muted-foreground">
                    Distributing by <span className="font-medium text-accent capitalize">{currentStep.digitName}</span>
                  </span>
                )}
              </div>

              <div className="flex justify-center gap-3 overflow-x-auto py-4 min-h-[140px]">
                <AnimatePresence mode="popLayout">
                  {displayBuckets.map((bucket) => (
                    <BucketContainer
                      key={bucket.key}
                      bucket={bucket}
                      isActive={currentDigit === bucket.key}
                    />
                  ))}
                  {displayBuckets.length === 0 && (
                    <div className="flex items-center justify-center w-full text-muted-foreground">
                      Waiting to start...
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 pt-6 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            LSD Radix Sort • Time Complexity: O(d × n) • Space Complexity: O(n + k)
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            where d = number of digits, n = number of elements, k = range of digit values (10)
          </p>
        </motion.footer>
      </div>
    </div>
  );
};
