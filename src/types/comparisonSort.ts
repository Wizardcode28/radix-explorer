export type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';
export type SortOrder = 'asc' | 'desc';
export type ElementStatus = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'merged';

export interface ComparisonArrayElement {
    value: number | string;
    id: string;
    status: ElementStatus;
}

export interface ComparisonSortStep {
    phase: 'compare' | 'swap' | 'overwrite' | 'initial' | 'complete' | 'partition' | 'merge' | 'split';
    array: ComparisonArrayElement[];
    indices: number[]; // Indices involved in the action
    explanation: string;
    detailedExplanation: string;
}

export interface ComparisonSortState {
    originalArray: (number | string)[];
    steps: ComparisonSortStep[];
    currentStepIndex: number;
    isPlaying: boolean;
    speed: number;
    algorithm: SortAlgorithm;
    sortOrder: SortOrder;
}
