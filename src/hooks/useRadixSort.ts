import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrayElement, Bucket, SortStep, RadixSortState } from '@/types/radixSort';

const getDigitName = (position: number): string => {
  const names = ['units', 'tens', 'hundreds', 'thousands', 'ten-thousands'];
  return names[position] || `10^${position}`;
};

const getDigit = (num: number, position: number): number => {
  return Math.floor(num / Math.pow(10, position)) % 10;
};

const getMaxDigits = (arr: number[]): number => {
  if (arr.length === 0) return 1;
  const max = Math.max(...arr);
  return max === 0 ? 1 : Math.floor(Math.log10(max)) + 1;
};

const createArrayElement = (value: number, index: number): ArrayElement => ({
  value,
  id: `${value}-${index}-${Date.now()}-${Math.random()}`,
  isActive: false,
  currentDigit: null,
});

const createEmptyBuckets = (): Bucket[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    digit: i,
    elements: [],
  }));
};

export const useRadixSort = (initialArray: number[] = [170, 45, 75, 90, 802, 24, 2, 66]) => {
  const [state, setState] = useState<RadixSortState>(() => ({
    originalArray: initialArray,
    currentArray: initialArray.map(createArrayElement),
    steps: [],
    currentStepIndex: -1,
    isPlaying: false,
    speed: 1000,
    maxDigits: getMaxDigits(initialArray),
  }));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateSteps = useCallback((arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const maxDigits = getMaxDigits(arr);
    let currentElements = arr.map(createArrayElement);

    // Initial step
    steps.push({
      phase: 'initial',
      digitPosition: 0,
      digitName: getDigitName(0),
      array: currentElements.map(el => ({ ...el })),
      buckets: createEmptyBuckets(),
      currentElementIndex: null,
      explanation: 'Initial array ready for sorting',
      detailedExplanation: `We have ${arr.length} numbers to sort. The largest number has ${maxDigits} digit(s), so we'll process ${maxDigits} digit position(s) from right to left (units → tens → hundreds...).`,
    });

    for (let digitPos = 0; digitPos < maxDigits; digitPos++) {
      const digitName = getDigitName(digitPos);
      let buckets = createEmptyBuckets();

      // Distribution phase - one step per element
      for (let i = 0; i < currentElements.length; i++) {
        const element = currentElements[i];
        const digit = getDigit(element.value, digitPos);
        
        // Create a snapshot showing current element being processed
        const snapshotArray = currentElements.map((el, idx) => ({
          ...el,
          isActive: idx === i,
          currentDigit: idx === i ? digit : null,
        }));

        // Add element to bucket
        const newBuckets = buckets.map(b => ({
          ...b,
          elements: [...b.elements],
        }));
        newBuckets[digit].elements.push({
          ...element,
          isActive: true,
          currentDigit: digit,
        });

        steps.push({
          phase: 'distribute',
          digitPosition: digitPos,
          digitName,
          array: snapshotArray,
          buckets: newBuckets,
          currentElementIndex: i,
          explanation: `Moving ${element.value} to bucket ${digit}`,
          detailedExplanation: `Looking at the ${digitName} digit of ${element.value}: The digit is ${digit}, so we place ${element.value} into bucket ${digit}. This maintains the relative order from previous passes (stability).`,
        });

        buckets = newBuckets;
      }

      // Collect phase - gather all elements from buckets
      const collectedElements: ArrayElement[] = [];
      for (let d = 0; d < 10; d++) {
        for (const el of buckets[d].elements) {
          collectedElements.push({
            ...el,
            isActive: false,
            currentDigit: null,
          });
        }
      }

      currentElements = collectedElements;

      steps.push({
        phase: 'collect',
        digitPosition: digitPos,
        digitName,
        array: collectedElements.map(el => ({ ...el })),
        buckets: createEmptyBuckets(),
        currentElementIndex: null,
        explanation: `Collected all elements from buckets (${digitName} pass complete)`,
        detailedExplanation: `We've now collected all elements from buckets 0-9 in order. After processing the ${digitName} digit, the array is partially sorted. ${digitPos < maxDigits - 1 ? `Next, we'll process the ${getDigitName(digitPos + 1)} digit.` : 'This was the last digit position!'}`,
      });
    }

    // Final step
    steps.push({
      phase: 'complete',
      digitPosition: maxDigits - 1,
      digitName: 'complete',
      array: currentElements.map(el => ({ ...el, isActive: false })),
      buckets: createEmptyBuckets(),
      currentElementIndex: null,
      explanation: 'Sorting complete! 🎉',
      detailedExplanation: `The array is now fully sorted! We processed ${maxDigits} digit position(s). Radix Sort's time complexity is O(d × n) where d is the number of digits and n is the number of elements.`,
    });

    return steps;
  }, []);

  const setArray = useCallback((arr: number[]) => {
    stopAutoPlay();
    const steps = generateSteps(arr);
    setState({
      originalArray: arr,
      currentArray: arr.map(createArrayElement),
      steps,
      currentStepIndex: -1,
      isPlaying: false,
      speed: state.speed,
      maxDigits: getMaxDigits(arr),
    });
  }, [generateSteps, state.speed]);

  const start = useCallback(() => {
    if (state.steps.length === 0) {
      const steps = generateSteps(state.originalArray);
      setState(prev => ({
        ...prev,
        steps,
        currentStepIndex: 0,
      }));
    } else {
      setState(prev => ({
        ...prev,
        currentStepIndex: 0,
      }));
    }
  }, [state.steps.length, state.originalArray, generateSteps]);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.steps.length === 0) {
        const steps = generateSteps(prev.originalArray);
        return {
          ...prev,
          steps,
          currentStepIndex: 0,
        };
      }
      if (prev.currentStepIndex < prev.steps.length - 1) {
        return {
          ...prev,
          currentStepIndex: prev.currentStepIndex + 1,
        };
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
      currentArray: prev.originalArray.map(createArrayElement),
      steps: [],
      currentStepIndex: -1,
      isPlaying: false,
    }));
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const toggleAutoPlay = useCallback(() => {
    if (state.isPlaying) {
      stopAutoPlay();
    } else {
      if (state.steps.length === 0 || state.currentStepIndex === -1) {
        start();
      }
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [state.isPlaying, state.steps.length, state.currentStepIndex, start, stopAutoPlay]);

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

  const isComplete = currentStep?.phase === 'complete';
  const hasStarted = state.currentStepIndex >= 0;
  const canGoNext = state.currentStepIndex < state.steps.length - 1;
  const canGoPrev = state.currentStepIndex > 0;

  return {
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
    stopAutoPlay,
    setSpeed,
  };
};
