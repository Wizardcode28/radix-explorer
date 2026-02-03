
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

type SortAlgorithm = 'bubble' | 'merge' | 'quick' | 'selection' | 'insertion';

export const ComparisonSortVisualizer = () => {
    const [array, setArray] = useState<number[]>([]);
    const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
    const [numElements, setNumElements] = useState(20);
    const [speed, setSpeed] = useState(1);
    const [isSorting, setIsSorting] = useState(false);
    const [comparingIndices, setComparingIndices] = useState<number[]>([]);
    const [sortedIndices, setSortedIndices] = useState<number[]>([]);
    const [swapCount, setSwapCount] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const [arrayMode, setArrayMode] = useState<'random' | 'custom'>('random');

    // Refs for mutable state during async operations
    const isSortingRef = useRef(false);
    const speedRef = useRef(1);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    useEffect(() => {
        generateArray();
        return () => {
            isSortingRef.current = false;
        };
    }, [numElements]);

    // Update array generation when mode changes? 
    // Usually user switches mode then must action something. 
    // If switch to random, auto generate?
    useEffect(() => {
        if (arrayMode === 'random') {
            generateArray();
        }
    }, [arrayMode]);

    const generateArray = () => {
        if (isSortingRef.current) return;

        const newArray = [];
        for (let i = 0; i < numElements; i++) {
            newArray.push(Math.floor(Math.random() * 191) + 10);
        }
        setArray(newArray);
        resetState();
    };

    const handleCustomInputSubmit = () => {
        const values = customInput.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
        if (values.length === 0) return;

        // Validation handled visually or alert if needed
        const validValues = values.map(v => Math.max(10, Math.min(200, v)));

        setArray(validValues);
        setNumElements(validValues.length);
        setIsSorting(false);
        isSortingRef.current = false;
        resetState();
    };

    const resetState = () => {
        setComparingIndices([]);
        setSortedIndices([]);
        setSwapCount(0);
        setIsSorting(false);
        isSortingRef.current = false;
    };

    const delay = () => new Promise(resolve => setTimeout(resolve, 500 / speedRef.current));

    const startSorting = async () => {
        if (isSortingRef.current) return;

        isSortingRef.current = true;
        setIsSorting(true);
        setSortedIndices([]);
        setSwapCount(0);

        try {
            switch (algorithm) {
                case 'bubble': await bubbleSort(); break;
                case 'selection': await selectionSort(); break;
                case 'insertion': await insertionSort(); break;
                case 'merge': await mergeSortWrapper(); break;
                case 'quick': await quickSortWrapper(); break;
            }
        } catch (e) {
            console.log("Stopped");
        }

        isSortingRef.current = false;
        setIsSorting(false);
    };

    const stopSorting = () => {
        isSortingRef.current = false;
        setIsSorting(false);
    };

    // --- Bubble Sort ---
    const bubbleSort = async () => {
        const arr = [...array];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (!isSortingRef.current) return;

                setComparingIndices([j, j + 1]);
                await delay();

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setArray([...arr]);
                    setSwapCount(prev => prev + 1);
                }
            }
            if (isSortingRef.current) setSortedIndices(prev => [...prev, arr.length - i - 1]);
        }
        setComparingIndices([]);
        // Mark remaining as sorted
        if (isSortingRef.current) {
            setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
        }
    };

    // --- Selection Sort ---
    const selectionSort = async () => {
        const arr = [...array];
        for (let i = 0; i < arr.length; i++) {
            let minIdx = i;
            for (let j = i + 1; j < arr.length; j++) {
                if (!isSortingRef.current) return;
                setComparingIndices([minIdx, j]);
                await delay();
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                if (!isSortingRef.current) return;
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                setArray([...arr]);
                setSwapCount(prev => prev + 1);
            }
            if (isSortingRef.current) setSortedIndices(prev => [...prev, i]);
        }
        setComparingIndices([]);
        if (isSortingRef.current) setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    };

    // --- Insertion Sort ---
    const insertionSort = async () => {
        const arr = [...array];
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                if (!isSortingRef.current) return;
                setComparingIndices([j, j + 1]);
                arr[j + 1] = arr[j];
                setArray([...arr]);
                await delay();
                j--;
            }
            arr[j + 1] = key;
            setArray([...arr]);
            if (!isSortingRef.current) return;
            // setSortedIndices could be tricky here as partial left is sorted
        }
        setComparingIndices([]);
        if (isSortingRef.current) setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    };

    // --- Merge Sort ---
    const mergeSortWrapper = async () => {
        const arr = [...array];
        await mergeSort(arr, 0, arr.length - 1);
        if (isSortingRef.current) setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    };

    const mergeSort = async (arr: number[], start: number, end: number) => {
        if (start >= end || !isSortingRef.current) return;
        const mid = Math.floor((start + end) / 2);
        await mergeSort(arr, start, mid);
        await mergeSort(arr, mid + 1, end);
        await merge(arr, start, mid, end);
    };

    const merge = async (arr: number[], start: number, mid: number, end: number) => {
        if (!isSortingRef.current) return;
        const left = arr.slice(start, mid + 1);
        const right = arr.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;

        // We can't visualize exact array swaps easily with just one array state in Merge, 
        // as it's not in-place usually. 
        // We will overwrite the main array step by step to visualize.

        while (i < left.length && j < right.length) {
            if (!isSortingRef.current) return;
            setComparingIndices([start + i, mid + 1 + j]); // Approximation of indices

            if (left[i] <= right[j]) {
                arr[k] = left[i];
                i++;
            } else {
                arr[k] = right[j];
                j++;
            }
            setArray([...arr]);
            await delay();
            k++;
        }

        while (i < left.length) {
            if (!isSortingRef.current) return;
            arr[k] = left[i];
            setArray([...arr]);
            await delay();
            i++;
            k++;
        }
        while (j < right.length) {
            if (!isSortingRef.current) return;
            arr[k] = right[j];
            setArray([...arr]);
            await delay();
            j++;
            k++;
        }
    };

    // --- Quick Sort ---
    const quickSortWrapper = async () => {
        const arr = [...array];
        await quickSort(arr, 0, arr.length - 1);
        if (isSortingRef.current) setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    };

    const quickSort = async (arr: number[], low: number, high: number) => {
        if (low < high && isSortingRef.current) {
            const pi = await partition(arr, low, high);
            await quickSort(arr, low, pi - 1);
            await quickSort(arr, pi + 1, high);
        }
    };

    const partition = async (arr: number[], low: number, high: number) => {
        if (!isSortingRef.current) return -1;
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (!isSortingRef.current) return -1;
            setComparingIndices([j, high]);
            await delay();

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]);
                setSwapCount(prev => prev + 1);
            }
        }
        if (!isSortingRef.current) return -1;
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setArray([...arr]);
        setSwapCount(prev => prev + 1);

        return i + 1;
    };


    return (
        <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold">Comparison Sort Visualizer</h1>
                <p className="text-muted-foreground">Visualize classic sorting algorithms step-by-step</p>
            </div>

            <Card className="p-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="grid gap-2">
                        <Label>Algorithm</Label>
                        <Select value={algorithm} onValueChange={(v: any) => setAlgorithm(v)} disabled={isSorting}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bubble">Bubble Sort</SelectItem>
                                <SelectItem value="merge">Merge Sort</SelectItem>
                                <SelectItem value="quick">Quick Sort</SelectItem>
                                <SelectItem value="selection">Selection Sort</SelectItem>
                                <SelectItem value="insertion">Insertion Sort</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Speed ({speed}x)</Label>
                        <Slider
                            value={[speed]}
                            onValueChange={(v) => setSpeed(v[0])}
                            min={0.5}
                            max={5}
                            step={0.5}
                            className="w-[150px]"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Size ({numElements})</Label>
                        <Input
                            type="number"
                            value={numElements}
                            onChange={(e) => setNumElements(parseInt(e.target.value))}
                            min={5}
                            max={200}
                            disabled={isSorting || arrayMode === 'custom'}
                            className="w-[100px]"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Mode</Label>
                        <Select value={arrayMode} onValueChange={(v: any) => setArrayMode(v)} disabled={isSorting}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="random">Random</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {arrayMode === 'custom' && (
                        <div className="grid gap-2 flex-1 min-w-[200px]">
                            <Label>Custom Input (comma separated)</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    placeholder="10, 50, 20..."
                                />
                                <Button onClick={handleCustomInputSubmit} variant="secondary">Set</Button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 ml-auto">
                        {!isSorting ? (
                            <Button onClick={startSorting} className="bg-blue-600 hover:bg-blue-700 w-24">Sort</Button>
                        ) : (
                            <Button onClick={stopSorting} variant="destructive" className="w-24">Stop</Button>
                        )}
                        <Button onClick={() => generateArray()} variant="outline" disabled={isSorting}>Shuffle</Button>
                    </div>
                </div>
            </Card>

            <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">Swaps: {swapCount}</div>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-cyan-500 rounded"></div> Unsorted</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div> Comparing</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div> Sorted</div>
                </div>
            </div>

            <div className="flex items-end justify-center gap-[1px] h-[500px] border rounded-lg p-4 bg-white dark:bg-black/20 overflow-hidden relative">
                {array.map((val, idx) => (
                    <div
                        key={idx}
                        className={`transition-all duration-100 rounded-t-sm flex items-end justify-center pb-1 ${comparingIndices.includes(idx) ? 'bg-yellow-400' :
                            sortedIndices.includes(idx) ? 'bg-green-500' : 'bg-cyan-500'
                            }`}
                        style={{
                            height: `${Math.max((val / 200) * 100, 1)}%`,
                            width: `${100 / numElements}%`
                        }}
                    >
                        {numElements <= 40 && (
                            <span className="text-[10px] sm:text-xs font-medium text-black -rotate-90 sm:rotate-0 truncate px-0.5">
                                {val}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
