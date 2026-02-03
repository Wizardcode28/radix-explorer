import { ComparisonArrayElement, ComparisonSortStep, SortOrder } from '@/types/comparisonSort';

const createSnapshot = (
    array: ComparisonArrayElement[],
    indices: number[],
    status: ComparisonArrayElement['status'],
    phase: ComparisonSortStep['phase'],
    explanation: string,
    detailedExplanation: string
): ComparisonSortStep => {
    // Create deep copy of array
    const newArray = array.map(el => ({ ...el }));

    // Apply status to specific indices, verify bounds
    indices.forEach(idx => {
        if (newArray[idx]) {
            newArray[idx].status = status;
        }
    });

    return {
        phase,
        array: newArray,
        indices,
        explanation,
        detailedExplanation
    };
};

// Helper for comparison that handles strings and numbers
const compare = (a: number | string, b: number | string, order: SortOrder): boolean => {
    if (order === 'asc') {
        return a > b;
    } else {
        return a < b;
    }
};

const formatVal = (val: number | string) => typeof val === 'string' ? `"${val}"` : val;

// --- Bubble Sort ---
export const generateBubbleSortSteps = (initialArray: ComparisonArrayElement[], order: SortOrder): ComparisonSortStep[] => {
    const steps: ComparisonSortStep[] = [];
    const arr = initialArray.map(el => ({ ...el, status: 'default' as ComparisonArrayElement['status'] }));
    const n = arr.length;

    steps.push(createSnapshot(arr, [], 'default', 'initial', 'Starting Bubble Sort', `We have ${n} elements to sort.`));

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            // Compare Step
            steps.push(createSnapshot(
                arr.map((el, idx) => ({ ...el, status: (idx >= n - i) ? 'sorted' : 'default' })),
                [j, j + 1],
                'comparing',
                'compare',
                `Comparing ${formatVal(arr[j].value)} and ${formatVal(arr[j + 1].value)}`,
                `Checking if ${formatVal(arr[j].value)} should come after ${formatVal(arr[j + 1].value)}.`
            ));

            if (compare(arr[j].value, arr[j + 1].value, order)) {
                // Swap Step
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                steps.push(createSnapshot(
                    arr.map((el, idx) => ({ ...el, status: (idx >= n - i) ? 'sorted' : 'default' })),
                    [j, j + 1],
                    'swapping',
                    'swap',
                    `Swapping ${formatVal(arr[j].value)} and ${formatVal(arr[j + 1].value)}`,
                    `${formatVal(arr[j + 1].value)} is ${order === 'asc' ? 'greater' : 'smaller'} than ${formatVal(arr[j].value)}, so we swap them.`
                ));
            }
        }
        // Mark last element as sorted
        arr[n - 1 - i].status = 'sorted';
        steps.push(createSnapshot(
            arr,
            [n - 1 - i],
            'sorted',
            'complete', // Using complete phase for sorted element update
            `${formatVal(arr[n - 1 - i].value)} is now sorted`,
            `The largest remaining element has bubbled up to its correct position.`
        ));

        if (!swapped) {
            steps.push(createSnapshot(
                arr,
                [],
                'default',
                'initial',
                'Optimization triggered',
                'No swaps occurred in this pass, so the array is already sorted.'
            ));
            break;
        }
    }

    // Mark all as sorted
    arr.forEach(el => el.status = 'sorted');
    steps.push(createSnapshot(arr, [], 'sorted', 'complete', 'Sort Complete!', 'All elements are sorted.'));

    return steps;
};

// --- Selection Sort ---
export const generateSelectionSortSteps = (initialArray: ComparisonArrayElement[], order: SortOrder): ComparisonSortStep[] => {
    const steps: ComparisonSortStep[] = [];
    const arr = initialArray.map(el => ({ ...el, status: 'default' as ComparisonArrayElement['status'] }));
    const n = arr.length;

    steps.push(createSnapshot(arr, [], 'default', 'initial', 'Starting Selection Sort', `We have ${n} elements to sort.`));

    for (let i = 0; i < n; i++) {
        let minIdx = i;
        // Highlight starting minimum
        steps.push(createSnapshot(
            arr.map((el, idx) => ({ ...el, status: idx < i ? 'sorted' : 'default' })),
            [i],
            'pivot',
            'initial',
            `Current minimum: ${formatVal(arr[i].value)}`,
            `Assume the first unsorted element is the minimum/maximum.`
        ));

        for (let j = i + 1; j < n; j++) {
            // Compare
            // We want to show the current min (pivot) and the one we are checking (comparing)
            const viewArr = arr.map((el, idx) => {
                if (idx < i) return { ...el, status: 'sorted' as const };
                if (idx === minIdx) return { ...el, status: 'pivot' as const };
                if (idx === j) return { ...el, status: 'comparing' as const };
                return { ...el, status: 'default' as const };
            });

            steps.push({
                phase: 'compare',
                array: viewArr,
                indices: [minIdx, j],
                explanation: `Comparing ${formatVal(arr[j].value)} with current min ${formatVal(arr[minIdx].value)}`,
                detailedExplanation: `Looking for a value ${order === 'asc' ? 'smaller' : 'larger'} than ${formatVal(arr[minIdx].value)}.`
            });

            // Logic invert for selection sort: we look for smallest in asc, largest in desc
            // compare(a, b, asc) -> a > b. 
            // If asc, we want arr[j] < arr[minIdx] -> !compare(arr[j], arr[minIdx], 'asc') if strict?
            // simpler: 
            const isBetter = order === 'asc' ? arr[j].value < arr[minIdx].value : arr[j].value > arr[minIdx].value;

            if (isBetter) {
                minIdx = j;
                // Highlight new min
                const newMinArr = arr.map((el, idx) => {
                    if (idx < i) return { ...el, status: 'sorted' as const };
                    if (idx === minIdx) return { ...el, status: 'pivot' as const };
                    return { ...el, status: 'default' as const };
                });
                steps.push({
                    phase: 'compare',
                    array: newMinArr,
                    indices: [minIdx],
                    explanation: `Found new ${order === 'asc' ? 'minimum' : 'maximum'}: ${formatVal(arr[minIdx].value)}`,
                    detailedExplanation: `Updating our record of the ${order === 'asc' ? 'smallest' : 'largest'} element found so far.`
                });
            }
        }

        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            steps.push(createSnapshot(
                arr.map((el, idx) => ({ ...el, status: idx < i ? 'sorted' : 'default' })),
                [i, minIdx],
                'swapping',
                'swap',
                `Swapping ${formatVal(arr[i].value)} with ${formatVal(arr[minIdx].value)}`,
                `Moving the found element tuple to its correct position.`
            ));
        }

        arr[i].status = 'sorted';
    }

    // Ensure all sorted
    arr.forEach(el => el.status = 'sorted');
    steps.push(createSnapshot(arr, [], 'sorted', 'complete', 'Sort Complete!', 'All elements are sorted.'));

    return steps;
};

// --- Insertion Sort ---
export const generateInsertionSortSteps = (initialArray: ComparisonArrayElement[], order: SortOrder): ComparisonSortStep[] => {
    const steps: ComparisonSortStep[] = [];
    const arr = initialArray.map(el => ({ ...el, status: 'default' as ComparisonArrayElement['status'] }));
    const n = arr.length;

    steps.push(createSnapshot(arr, [], 'default', 'initial', 'Starting Insertion Sort', `We have ${n} elements to sort.`));

    // First element is trivially sorted
    arr[0].status = 'sorted';

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        steps.push(createSnapshot(
            arr,
            [i],
            'pivot',
            'initial',
            `Selected ${formatVal(key.value)} to insert`,
            `Taking the next unsorted element to place it in the sorted portion.`
        ));

        // For animation, we might want to conceptually remove 'key' or highlight it. 
        // We will just highlight it as Pivot.

        // compare(arr[j], key, order) means arr[j] > key (if asc)
        while (j >= 0 && compare(arr[j].value, key.value, order)) {
            // Compare
            steps.push(createSnapshot(
                arr,
                [j, j + 1],
                'comparing',
                'compare',
                `Comparing ${formatVal(arr[j].value)} with key ${formatVal(key.value)}`,
                `${formatVal(arr[j].value)} is ${order === 'asc' ? 'larger' : 'smaller'} than ${formatVal(key.value)}, so we shift it.`
            ));

            arr[j + 1] = arr[j];
            arr[j] = { ...key }; // Temporarily put key here for visualization or just leave simple
            // Actually standard insertion sort visualization shows the swap/shift

            steps.push(createSnapshot(
                arr,
                [j, j + 1],
                'swapping',
                'swap',
                `shifting ${formatVal(arr[j + 1].value)}`,
                `Moving sorted element to make space.`
            ));

            j--;
        }
        arr[j + 1] = key;

        // Mark up to i as sorted
        for (let k = 0; k <= i; k++) arr[k].status = 'sorted';

        steps.push(createSnapshot(
            arr,
            [j + 1],
            'sorted',
            'overwrite',
            `Inserted ${formatVal(key.value)} at position ${j + 1}`,
            `Element is now in its correct sorted position.`
        ));
    }

    arr.forEach(el => el.status = 'sorted');
    steps.push(createSnapshot(arr, [], 'sorted', 'complete', 'Sort Complete!', 'All elements are sorted.'));

    return steps;
};

// --- Merge Sort ---
export const generateMergeSortSteps = (initialArray: ComparisonArrayElement[], order: SortOrder): ComparisonSortStep[] => {
    const steps: ComparisonSortStep[] = [];
    let arr = initialArray.map(el => ({ ...el, status: 'default' as ComparisonArrayElement['status'] }));

    steps.push(createSnapshot(arr, [], 'default', 'initial', 'Starting Merge Sort', 'Recursive divide and conquer approach.'));

    const merge = (start: number, mid: number, end: number) => {
        const leftArr = arr.slice(start, mid + 1);
        const rightArr = arr.slice(mid + 1, end + 1);

        let i = 0, j = 0, k = start;

        steps.push(createSnapshot(
            arr,
            Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
            'comparing',
            'split',
            `Merging range [${start}-${mid}] and [${mid + 1}-${end}]`,
            `Comparing elements from two sorted subarrays to merge them.`
        ));

        while (i < leftArr.length && j < rightArr.length) {
            // Compare left[i] and right[j]
            const valLeft = leftArr[i];
            const valRight = rightArr[j];

            const shouldPickLeft = order === 'asc' ? valLeft.value <= valRight.value : valLeft.value >= valRight.value;

            steps.push(createSnapshot(
                arr,
                Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
                'comparing',
                'compare',
                `Comparing ${formatVal(valLeft.value)} (Left) and ${formatVal(valRight.value)} (Right)`,
                `We check which value is ${order === 'asc' ? 'smaller' : 'larger'} to place it next in the merged sequence.`
            ));

            const valToPlace = shouldPickLeft ? valLeft : valRight;

            // Find where this value currently is in the main array to swap it to k
            const currentIdx = arr.indexOf(valToPlace);

            if (currentIdx !== k && currentIdx !== -1) {
                // Swap to bring the correct element to position k
                [arr[k], arr[currentIdx]] = [arr[currentIdx], arr[k]];

                steps.push(createSnapshot(
                    arr,
                    [k, currentIdx],
                    'swapping',
                    'swap', // Use swap phase for better visual
                    `Moving ${formatVal(valToPlace.value)} to position ${k}`,
                    `Placing the next sorted element into its correct position.`
                ));
            } else {
                steps.push(createSnapshot(
                    arr,
                    [k],
                    'swapping',
                    'overwrite',
                    `Placed ${formatVal(valToPlace.value)} at position ${k}`,
                    `Element was already in correct position.`
                ));
            }

            if (shouldPickLeft) i++;
            else j++;

            k++;
        }

        while (i < leftArr.length) {
            const valToPlace = leftArr[i];
            const currentIdx = arr.indexOf(valToPlace);
            if (currentIdx !== k && currentIdx !== -1) {
                [arr[k], arr[currentIdx]] = [arr[currentIdx], arr[k]];
                steps.push(createSnapshot(
                    arr,
                    [k, currentIdx],
                    'swapping',
                    'swap',
                    `Moving remaining Left: ${formatVal(valToPlace.value)} to position ${k}`,
                    `Flushing remaining elements from left subarray.`
                ));
            }
            i++; k++;
        }
        while (j < rightArr.length) {
            const valToPlace = rightArr[j];
            const currentIdx = arr.indexOf(valToPlace);
            if (currentIdx !== k && currentIdx !== -1) {
                [arr[k], arr[currentIdx]] = [arr[currentIdx], arr[k]];
                steps.push(createSnapshot(
                    arr,
                    [k, currentIdx],
                    'swapping',
                    'swap',
                    `Moving remaining Right: ${formatVal(valToPlace.value)} to position ${k}`,
                    `Flushing remaining elements from right subarray.`
                ));
            }
            j++; k++;
        }
    };

    const mergeSortRecursive = (start: number, end: number) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);

        // Visualize Divide
        steps.push(createSnapshot(
            arr,
            Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
            'comparing', // Highlight current range
            'split',
            `Dividing range indexes [${start}-${end}]`,
            `Splitting the array into two halves: [${start}-${mid}] and [${mid + 1}-${end}]. Recursively sorting them.`
        ));

        mergeSortRecursive(start, mid);
        mergeSortRecursive(mid + 1, end);
        merge(start, mid, end);
    };

    mergeSortRecursive(0, arr.length - 1);

    arr.forEach(el => el.status = 'sorted');
    steps.push(createSnapshot(arr, [], 'sorted', 'complete', 'Sort Complete!', 'All elements are sorted.'));

    return steps;
};

// --- Quick Sort ---
export const generateQuickSortSteps = (initialArray: ComparisonArrayElement[], order: SortOrder): ComparisonSortStep[] => {
    const steps: ComparisonSortStep[] = [];
    const arr = initialArray.map(el => ({ ...el, status: 'default' as ComparisonArrayElement['status'] }));

    steps.push(createSnapshot(arr, [], 'default', 'initial', 'Starting Quick Sort', 'Divide and conquer using pivots.'));

    const partition = (low: number, high: number): number => {
        const pivot = arr[high];

        steps.push(createSnapshot(
            arr,
            [high],
            'pivot',
            'partition',
            `Chosen pivot: ${formatVal(pivot.value)}`,
            `Everything ${order === 'asc' ? 'smaller' : 'larger'} than pivot will move to left.`
        ));

        let i = low - 1;

        for (let j = low; j < high; j++) {
            const isConditionMet = order === 'asc' ? arr[j].value < pivot.value : arr[j].value > pivot.value;

            // Compare
            steps.push(createSnapshot(
                arr,
                [j, high],
                'comparing',
                'compare',
                `Comparing ${formatVal(arr[j].value)} with pivot ${formatVal(pivot.value)}`,
                `Is ${formatVal(arr[j].value)} ${order === 'asc' ? '<' : '>'} ${formatVal(pivot.value)}? ${isConditionMet ? 'Yes' : 'No'}.`
            ));

            if (isConditionMet) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                steps.push(createSnapshot(
                    arr,
                    [i, j],
                    'swapping',
                    'swap',
                    `Swapping ${formatVal(arr[i].value)} (idx ${i}) and ${formatVal(arr[j].value)} (idx ${j})`,
                    `Since the condition was met, we move ${formatVal(arr[i].value)} to the 'smaller' partition (left side).`
                ));
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        steps.push(createSnapshot(
            arr,
            [i + 1, high],
            'swapping',
            'swap',
            `Placing Pivot ${formatVal(arr[i + 1].value)} at correct index ${i + 1}`,
            `Pivot is now placed between the smaller (left) and larger (right) partitions. It is sorted.`
        ));

        // Mark pivot as sorted
        arr[i + 1].status = 'sorted';
        return i + 1;
    };

    const quickSortRecursive = (low: number, high: number) => {
        if (low < high) {
            // Visualize Range Focus
            steps.push(createSnapshot(
                arr,
                Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
                'comparing',
                'split', // Reusing split/partition concept
                `Processing Range [${low}-${high}]`,
                `Recursively sorting the sub-array from index ${low} to ${high}. First, we partition.`
            ));

            const pi = partition(low, high);
            quickSortRecursive(low, pi - 1);
            quickSortRecursive(pi + 1, high);
        } else if (low === high) {
            // Single element valid
            arr[low].status = 'sorted';
            steps.push(createSnapshot(arr, [low], 'sorted', 'complete', `Position ${low} is sorted`, `Single element range is already sorted.`));
        }
    };

    quickSortRecursive(0, arr.length - 1);

    arr.forEach(el => el.status = 'sorted');
    steps.push(createSnapshot(arr, [], 'sorted', 'complete', 'Sort Complete!', 'All elements are sorted.'));

    return steps;
};
