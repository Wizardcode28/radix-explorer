import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrayElement, Bucket, SortStep, RadixSortState } from '@/types/radixSort';

const getDigitName = (position: number, isString: boolean): string => {
  if (!isString) {
    const names = ['units', 'tens', 'hundreds', 'thousands', 'ten-thousands'];
    return names[position] || `10^${position}`;
  }
  return position === 0 ? 'last char' : `${position + 1}th last char`;
};

const getDigit = (val: number | string, position: number, isString: boolean): string | number => {
  if (isString) {
    const str = String(val);
    // For LSD string sort, we look from right to left
    // position 0 = last char, position 1 = 2nd last char, etc.
    const index = str.length - 1 - position;
    if (index < 0) return ''; // Padding for shorter strings
    return str[index];
  }
  return Math.floor((val as number) / Math.pow(10, position)) % 10;
};

const getMaxDigits = (arr: (number | string)[]): number => {
  if (arr.length === 0) return 1;
  // Check if we're sorting strings or numbers based on the first element
  const isString = typeof arr[0] === 'string' || (typeof arr[0] === 'number' && arr.some(x => typeof x === 'string'));

  if (isString) {
    return Math.max(...arr.map(x => String(x).length));
  }

  const max = Math.max(...(arr as number[]));
  return max === 0 ? 1 : Math.floor(Math.log10(max)) + 1;
};

const createArrayElement = (value: number | string, index: number): ArrayElement => ({
  value,
  id: `${value}-${index}-${Date.now()}-${Math.random()}`,
  isActive: false,
  currentDigit: null,
});

const createEmptyBuckets = (keys: (string | number)[]): Bucket[] => {
  return keys.map(k => ({
    key: k,
    label: k === '' ? 'Empty' : String(k),
    elements: [],
  }));
};

export const useRadixSort = (initialArray: (number | string)[] = [170, 45, 75, 90, 802, 24, 2, 66]) => {
  const [state, setState] = useState<RadixSortState>(() => ({
    originalArray: initialArray,
    currentArray: initialArray.map(createArrayElement),
    steps: [],
    currentStepIndex: -1,
    isPlaying: false,
    speed: 1000,
    maxDigits: getMaxDigits(initialArray),
    sortOrder: 'asc',
  }));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateSteps = useCallback((arr: (number | string)[], order: 'asc' | 'desc'): SortStep[] => {
    const steps: SortStep[] = [];
    const maxDigits = getMaxDigits(arr);
    let currentElements = arr.map(createArrayElement);
    const isStringMode = arr.some(x => typeof x === 'string');

    // Initial step
    steps.push({
      phase: 'initial',
      digitPosition: 0,
      digitName: 'Start',
      array: currentElements.map(el => ({ ...el })),
      buckets: [],
      currentElementIndex: null,
      explanation: 'Initial array ready for sorting',
      detailedExplanation: `We have ${arr.length} items to sort. The maximum length is ${maxDigits}, so we'll process ${maxDigits} positions from right to left.${order === 'desc' ? ' Sorting in descending order.' : ''}`,
    });

    for (let digitPos = 0; digitPos < maxDigits; digitPos++) {
      const digitName = getDigitName(digitPos, isStringMode);

      // Determine unique keys for buckets at this position
      const currentDigits = currentElements.map(el => getDigit(el.value, digitPos, isStringMode));
      const uniqueDigits = Array.from(new Set(currentDigits)).sort();

      // For descending sort during distribution phase, we still maintain bucket order based on digits
      // But we will collect them in reverse order or use reverse bucket logic if we want to be explicit.
      // Standard LSD Radix Sort for descending:
      // Option A: Map digit d to (9-d) or similar inversion.
      // Option B: Collect from buckets in reverse order (Standard way for simple digit-based logic).

      let buckets = createEmptyBuckets(uniqueDigits);

      // Distribution phase - one step per element
      for (let i = 0; i < currentElements.length; i++) {
        const element = currentElements[i];
        const digit = getDigit(element.value, digitPos, isStringMode);

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
        const targetBucketIndex = newBuckets.findIndex(b => b.key === digit);
        if (targetBucketIndex !== -1) {
          newBuckets[targetBucketIndex].elements.push({
            ...element,
            isActive: true,
            currentDigit: digit,
          });
        }

        steps.push({
          phase: 'distribute',
          digitPosition: digitPos,
          digitName,
          array: snapshotArray,
          buckets: newBuckets,
          currentElementIndex: i,
          explanation: `Moving "${element.value}" to bucket "${digit === '' ? 'Empty' : digit}"`,
          detailedExplanation: `Looking at the ${digitName} of "${element.value}": The value is "${digit}", so we place it into the corresponding bucket.`,
        });

        buckets = newBuckets;
      }

      // Collect phase - gather all elements from buckets
      // If descending, we collect from buckets in reverse order
      const collectedElements: ArrayElement[] = [];
      const bucketsToCollect = order === 'asc' ? buckets : [...buckets].reverse();

      for (const bucket of bucketsToCollect) {
        for (const el of bucket.elements) {
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
        buckets: createEmptyBuckets(uniqueDigits), // Show empty buckets after collection
        currentElementIndex: null,
        explanation: `Collected elements from buckets ${order === 'desc' ? '(Reverse order for Descending)' : ''}`,
        detailedExplanation: `We've collected all elements from the buckets in ${order === 'desc' ? 'reverse ' : ''}order. The array is now sorted based on the ${digitName}.`,
      });
    }

    // Final step
    steps.push({
      phase: 'complete',
      digitPosition: maxDigits - 1,
      digitName: 'complete',
      array: currentElements.map(el => ({ ...el, isActive: false })),
      buckets: [],
      currentElementIndex: null,
      explanation: 'Sorting complete! 🎉',
      detailedExplanation: `The array is now fully sorted! We processed ${maxDigits} positions.`,
    });

    return steps;
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const setArray = useCallback((arr: number[]) => {
    stopAutoPlay();
    // Maintain current sort order when setting new array
    const steps = generateSteps(arr, state.sortOrder || 'asc');
    setState(prev => ({
      ...prev,
      originalArray: arr,
      currentArray: arr.map(createArrayElement),
      steps,
      currentStepIndex: -1,
      isPlaying: false,
      speed: state.speed,
      maxDigits: getMaxDigits(arr),
    }));
  }, [generateSteps, state.speed, state.sortOrder, stopAutoPlay]);

  const setSortOrder = useCallback((order: 'asc' | 'desc') => {
    stopAutoPlay();
    const steps = generateSteps(state.originalArray, order);
    setState(prev => ({
      ...prev,
      sortOrder: order,
      steps,
      currentStepIndex: -1,
      isPlaying: false,
    }));
  }, [generateSteps, state.originalArray, stopAutoPlay]);

  const start = useCallback(() => {
    if (state.steps.length === 0) {
      const steps = generateSteps(state.originalArray, state.sortOrder || 'asc');
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
  }, [state.steps.length, state.originalArray, generateSteps, state.sortOrder]);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.steps.length === 0) {
        const steps = generateSteps(prev.originalArray, prev.sortOrder || 'asc');
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
  }, [stopAutoPlay]);

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
