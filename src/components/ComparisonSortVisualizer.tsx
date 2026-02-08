
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useComparisonSort } from '@/hooks/useComparisonSort';
import { ComparisonArrayBar } from './ComparisonArrayBar';
import { ControlPanel } from './ControlPanel';
import { ComparisonExplanationPanel } from './ComparisonExplanationPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export const ComparisonSortVisualizer = () => {
    const {
        state,
        currentStep,
        displayArray,
        isComplete,
        hasStarted,
        canGoNext,
        canGoPrev,
        setArray,
        setAlgorithm,
        setSortOrder,
        start,
        nextStep,
        prevStep,
        reset,
        toggleAutoPlay,
        setSpeed,
    } = useComparisonSort();

    // Helper for max value for bar scaling
    const maxValue = state.originalArray.length > 0
        ? Math.max(...state.originalArray.map(v => typeof v === 'number' ? v : String(v).length * 10))
        : 1;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4"
            >
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent mb-2">
                    Comparison Sort Visualizer
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Visualize classic comparison sorting algorithms step-by-step with details.
                </p>
            </motion.header>

            <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                {/* Left Panel */}
                <div className="space-y-4">
                    {/* Algorithm Selector - Extra control not in ControlPanel */}
                    <div className="bg-card rounded-xl border border-border p-5 shadow-soft space-y-3">
                        <Label>Algorithm</Label>
                        <Select
                            value={state.algorithm}
                            onValueChange={(v: any) => setAlgorithm(v)}
                            disabled={state.isPlaying || (hasStarted && !isComplete && state.currentStepIndex > 0)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bubble">Bubble Sort</SelectItem>
                                <SelectItem value="selection">Selection Sort</SelectItem>
                                <SelectItem value="insertion">Insertion Sort</SelectItem>
                                <SelectItem value="merge">Merge Sort</SelectItem>
                                <SelectItem value="quick">Quick Sort</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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
                        sortOrder={state.sortOrder}
                        onSortOrderChange={setSortOrder}
                    />


                </div>

                {/* Right Panel */}
                <div className="space-y-6">
                    <ComparisonExplanationPanel
                        currentStep={currentStep}
                        stepNumber={state.currentStepIndex}
                        totalSteps={state.steps.length}
                    />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-card rounded-xl border border-border p-6 shadow-soft"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Visualization</h2>
                            <div className="flex gap-4 text-xs">
                                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-cyan-500 rounded"></div> Default</div>
                                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded"></div> Compare</div>
                                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Swap</div>
                                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Sorted</div>
                            </div>
                        </div>

                        <div className="flex items-end justify-center gap-2 min-h-[300px] overflow-x-auto py-4 px-2 bg-muted/10 rounded-lg">
                            <AnimatePresence mode="popLayout">
                                {displayArray.map((element, index) => (
                                    <ComparisonArrayBar
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
                </div>
            </div>
        </div>
    );
};
