import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Shuffle,
  PlayCircle
} from 'lucide-react';

interface ControlPanelProps {
  onSetArray: (arr: (number | string)[]) => void;
  onStart: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onToggleAutoPlay: () => void;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  hasStarted: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  isComplete: boolean;
  speed: number;
  sortOrder?: 'asc' | 'desc';
  onSortOrderChange?: (order: 'asc' | 'desc') => void;
}

export const ControlPanel = ({
  onSetArray,
  onStart,
  onNextStep,
  onPrevStep,
  onReset,
  onToggleAutoPlay,
  onSpeedChange,
  isPlaying,
  hasStarted,
  canGoNext,
  canGoPrev,
  isComplete,
  speed,
  sortOrder = 'asc',
  onSortOrderChange,
}: ControlPanelProps) => {
  const [inputValue, setInputValue] = useState('170, 45, 75, 90, 802, 24, 2, 66');
  const [error, setError] = useState('');

  const handleArraySubmit = () => {
    try {
      const parts = inputValue
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '');

      if (parts.length === 0) {
        throw new Error('Please enter at least one item');
      }

      if (parts.length > 20) {
        throw new Error('Maximum 20 items allowed for visualization');
      }

      // Try to parse all as numbers first
      const allNumbers = parts.every(p => !isNaN(parseFloat(p)) && isFinite(Number(p)));

      if (allNumbers) {
        const numArr = parts.map(p => {
          const num = Number(p);
          if (num > 9999) throw new Error('Numbers must be less than 10000');
          return num;
        });
        setError('');
        onSetArray(numArr);
      } else {
        // Treat as strings
        const strArr = parts;
        if (strArr.some(s => s.length > 15)) {
          throw new Error('Strings must be 15 characters or less');
        }
        setError('');
        onSetArray(strArr as any); // Type assertion needed or update prop type
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid input');
    }
  };

  const handleGenerateRandom = () => {
    const isString = Math.random() > 0.5;
    const count = Math.floor(Math.random() * 6) + 5; // 5-10 items

    if (!isString) {
      const maxValue = Math.random() > 0.5 ? 999 : 99; // Mix of 2 and 3 digit numbers
      const arr = Array.from({ length: count }, () =>
        Math.floor(Math.random() * maxValue) + 1
      );
      const newValue = arr.join(', ');
      setInputValue(newValue);
      setError('');
      onSetArray(arr);
    } else {
      // Generate random strings
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const arr = Array.from({ length: count }, () => {
        const len = Math.floor(Math.random() * 5) + 2; // 2-6 chars for random
        return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      });
      const newValue = arr.join(', ');
      setInputValue(newValue);
      setError('');
      onSetArray(arr as any);
    }
  };

  // Convert speed to a display value (inverted for slider)
  const speedValue = 2000 - speed;

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-soft space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Controls</h2>
        <p className="text-sm text-muted-foreground">Configure and control the visualization</p>
      </div>

      {/* Array Input */}
      <div className="space-y-2">
        <Label htmlFor="array-input" className="text-sm font-medium">
          Array Input
        </Label>
        <div className="flex gap-2">
          <Input
            id="array-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter numbers or strings separated by commas"
            className="font-mono text-sm"
          />
        </div>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
        <div className="flex gap-2">
          <Button
            onClick={handleArraySubmit}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            Set Array
          </Button>
          <Button
            onClick={handleGenerateRandom}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Shuffle className="w-4 h-4 mr-1" />
            Random
          </Button>
        </div>
      </div>

      {/* Sort Order */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Sort Order</Label>
        <div className="flex bg-muted p-1 rounded-md">
          <button
            className={`flex-1 text-xs font-medium py-1.5 px-2 rounded-sm transition-all ${sortOrder === 'asc' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => onSortOrderChange && onSortOrderChange('asc')}
          >
            Ascending
          </button>
          <button
            className={`flex-1 text-xs font-medium py-1.5 px-2 rounded-sm transition-all ${sortOrder === 'desc' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => onSortOrderChange && onSortOrderChange('desc')}
          >
            Descending
          </button>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Playback</Label>

        <div className="grid grid-cols-2 gap-2">
          {!hasStarted ? (
            <Button
              onClick={onStart}
              className="col-span-2"
              size="lg"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Visualization
            </Button>
          ) : (
            <>
              <Button
                onClick={onPrevStep}
                disabled={!canGoPrev || isPlaying}
                variant="outline"
                size="default"
              >
                <SkipBack className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                onClick={onNextStep}
                disabled={!canGoNext || isPlaying}
                variant="outline"
                size="default"
              >
                Next
                <SkipForward className="w-4 h-4 ml-1" />
              </Button>
            </>
          )}
        </div>

        {hasStarted && (
          <div className="flex gap-2">
            <Button
              onClick={onToggleAutoPlay}
              disabled={isComplete}
              variant={isPlaying ? "destructive" : "default"}
              className="flex-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Auto Play
                </>
              )}
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              disabled={isPlaying}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Speed Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">Animation Speed</Label>
          <span className="text-xs text-muted-foreground font-mono">
            {speed}ms
          </span>
        </div>
        <Slider
          value={[speedValue]}
          onValueChange={([v]) => onSpeedChange(2000 - v)}
          min={0}
          max={1800}
          step={100}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
        <h3 className="text-sm font-medium text-foreground">Quick Guide</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Enter non-negative integers or strings separated by commas</li>
          <li>• Max string length: 15 characters</li>
          <li>• Use "Start" to begin step-by-step visualization</li>
          <li>• "Auto Play" animates through all steps</li>
          <li>• Adjust speed slider for faster/slower animation</li>
        </ul>
      </div>
    </div>
  );
};
