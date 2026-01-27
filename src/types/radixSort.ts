export interface ArrayElement {
  value: number | string;
  id: string;
  isActive: boolean;
  currentDigit: number | string | null;
}

export interface Bucket {
  key: string | number;
  label: string;
  elements: ArrayElement[];
}

export interface SortStep {
  phase: 'initial' | 'distribute' | 'collect' | 'complete';
  digitPosition: number; // 0 = units, 1 = tens, 2 = hundreds, etc.
  digitName: string;
  array: ArrayElement[];
  buckets: Bucket[];
  currentElementIndex: number | null;
  explanation: string;
  detailedExplanation: string;
}

export interface RadixSortState {
  originalArray: (number | string)[];
  currentArray: ArrayElement[];
  steps: SortStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number; // milliseconds between steps
  maxDigits: number;
  sortOrder?: 'asc' | 'desc';
}
