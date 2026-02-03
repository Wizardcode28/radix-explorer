import { useState, useCallback, useRef, useEffect } from 'react';
import {
    ComparisonSortState,
    ComparisonSortStep,
    ComparisonArrayElement,
    SortAlgorithm,
    SortOrder
} from '@/types/comparisonSort';
import {
    generateBubbleSortSteps,
    generateSelectionSortSteps,
    generateInsertionSortSteps,
    generateMergeSortSteps,
    generateQuickSortSteps
} from '@/lib/comparisonAlgorithms';

const createArrayElement = (value: number | string, index: number): ComparisonArrayElement => ({
    value,
    id: `${value}-${index}-${Date.now()}-${Math.random()}`,
    status: 'default',
});

export const useComparisonSort = (initialArray: (number | string)[] = [50, 20, 90, 10, 30]) => {
    const [state, setState] = useState<ComparisonSortState>(() => ({
        originalArray: initialArray,
        steps: [],
        currentStepIndex: -1,
        isPlaying: false,
        speed: 500,
        algorithm: 'bubble',
        sortOrder: 'asc',
    }));

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const generateSteps = useCallback((arr: (number | string)[], algo: SortAlgorithm, order: SortOrder): ComparisonSortStep[] => {
        const elements = arr.map(createArrayElement);
        switch (algo) {
            case 'bubble': return generateBubbleSortSteps(elements, order);
            case 'selection': return generateSelectionSortSteps(elements, order);
            case 'insertion': return generateInsertionSortSteps(elements, order);
            case 'merge': return generateMergeSortSteps(elements, order);
            case 'quick': return generateQuickSortSteps(elements, order);
            default: return [];
        }
    }, []);

    const stopAutoPlay = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setState(prev => ({ ...prev, isPlaying: false }));
    }, []);

    const setArray = useCallback((arr: (number | string)[]) => {
        stopAutoPlay();
        setState(prev => {
            const steps = generateSteps(arr, prev.algorithm, prev.sortOrder);
            return {
                ...prev,
                originalArray: arr,
                steps,
                currentStepIndex: -1,
                isPlaying: false,
            };
        });
    }, [generateSteps, stopAutoPlay]);

    const setAlgorithm = useCallback((algo: SortAlgorithm) => {
        stopAutoPlay();
        setState(prev => {
            const steps = generateSteps(prev.originalArray, algo, prev.sortOrder);
            return {
                ...prev,
                algorithm: algo,
                steps,
                currentStepIndex: -1,
            };
        });
    }, [generateSteps, stopAutoPlay]);

    const setSortOrder = useCallback((order: SortOrder) => {
        stopAutoPlay();
        setState(prev => {
            const steps = generateSteps(prev.originalArray, prev.algorithm, order);
            return {
                ...prev,
                sortOrder: order,
                steps,
                currentStepIndex: -1,
            };
        });
    }, [generateSteps, stopAutoPlay]);

    const start = useCallback(() => {
        setState(prev => {
            let steps = prev.steps;
            if (steps.length === 0) {
                steps = generateSteps(prev.originalArray, prev.algorithm, prev.sortOrder);
            }
            return {
                ...prev,
                steps,
                currentStepIndex: 0,
            };
        });
    }, [generateSteps]);

    const nextStep = useCallback(() => {
        setState(prev => {
            let steps = prev.steps;
            if (steps.length === 0) {
                steps = generateSteps(prev.originalArray, prev.algorithm, prev.sortOrder);
                return { ...prev, steps, currentStepIndex: 0 };
            }

            if (prev.currentStepIndex < steps.length - 1) {
                return { ...prev, currentStepIndex: prev.currentStepIndex + 1 };
            }
            return prev;
        });
    }, [generateSteps]);

    const prevStep = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStepIndex: Math.max(0, prev.currentStepIndex - 1),
        }));
    }, []);

    const reset = useCallback(() => {
        stopAutoPlay();
        setState(prev => ({
            ...prev,
            currentStepIndex: -1,
            isPlaying: false,
        }));
    }, [stopAutoPlay]);

    const toggleAutoPlay = useCallback(() => {
        setState(prev => {
            if (prev.isPlaying) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                return { ...prev, isPlaying: false };
            } else {
                // Start playing
                // If at end or start, restart? Or just resume?
                return { ...prev, isPlaying: true };
            }
        });
    }, []);

    const setSpeed = useCallback((speed: number) => {
        setState(prev => ({ ...prev, speed }));
    }, []);

    // Auto-play effect
    useEffect(() => {
        if (state.isPlaying) {
            intervalRef.current = setInterval(() => {
                setState(prev => {
                    if (prev.currentStepIndex >= prev.steps.length - 1) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        return { ...prev, isPlaying: false };
                    }
                    return {
                        ...prev,
                        currentStepIndex: prev.currentStepIndex + 1,
                    };
                });
            }, state.speed);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [state.isPlaying, state.speed]);

    const currentStep = state.currentStepIndex >= 0 && state.currentStepIndex < state.steps.length
        ? state.steps[state.currentStepIndex]
        : null;

    // If -1, show initial state (unsorted)
    const displayArray = currentStep
        ? currentStep.array
        : state.originalArray.map((val, idx) => createArrayElement(val, idx));

    const isComplete = currentStep?.phase === 'complete';
    const hasStarted = state.currentStepIndex >= 0;
    const canGoNext = state.steps.length > 0 && state.currentStepIndex < state.steps.length - 1;
    const canGoPrev = state.currentStepIndex > 0;

    return {
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
        stopAutoPlay,
        setSpeed,
    };
};
