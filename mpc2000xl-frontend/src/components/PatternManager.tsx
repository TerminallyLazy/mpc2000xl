import React, { useState } from 'react';
import { Pattern, Sequence } from '../types';
import { generateId } from '../utils/id';

interface PatternManagerProps {
  currentSequence: Sequence;
  onSequenceChange: (sequence: Sequence) => void;
}

export const PatternManager: React.FC<PatternManagerProps> = ({
  currentSequence,
  onSequenceChange
}) => {
  const [selectedPattern, setSelectedPattern] = useState<number>(currentSequence.currentPattern);

  const handlePatternChange = (index: number) => {
    setSelectedPattern(index);
    onSequenceChange({
      ...currentSequence,
      currentPattern: index
    });
  };

  const handlePatternUpdate = (updatedPattern: Pattern) => {
    const newPatterns = [...currentSequence.patterns];
    newPatterns[selectedPattern] = updatedPattern;
    onSequenceChange({
      ...currentSequence,
      patterns: newPatterns
    });
  };

  const handleAddPattern = () => {
    const newPattern: Pattern = {
      id: generateId(),
      name: `Pattern ${currentSequence.patterns.length + 1}`,
      events: [],
      length: 16,
      resolution: 4
    };

    onSequenceChange({
      ...currentSequence,
      patterns: [...currentSequence.patterns, newPattern],
      currentPattern: currentSequence.patterns.length
    });
    setSelectedPattern(currentSequence.patterns.length);
  };

  const handleDeletePattern = (index: number) => {
    if (currentSequence.patterns.length <= 1) return; // Keep at least one pattern

    const newPatterns = currentSequence.patterns.filter((_, i) => i !== index);
    const newCurrentPattern = Math.min(selectedPattern, newPatterns.length - 1);

    onSequenceChange({
      ...currentSequence,
      patterns: newPatterns,
      currentPattern: newCurrentPattern
    });
    setSelectedPattern(newCurrentPattern);
  };

  const handlePatternLength = (length: number) => {
    const currentPattern = currentSequence.patterns[selectedPattern];
    handlePatternUpdate({
      ...currentPattern,
      length,
      events: currentPattern.events.filter(e => e.stepIndex < length)
    });
  };

  const handleResolution = (resolution: number) => {
    const currentPattern = currentSequence.patterns[selectedPattern];
    handlePatternUpdate({
      ...currentPattern,
      resolution
    });
  };

  const currentPattern = currentSequence.patterns[selectedPattern];

  return (
    <div className="bg-gray-800 text-green-400 font-mono p-4">
      <div className="mb-4">
        <h2 className="text-lg mb-2">Pattern Manager</h2>
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 border border-green-400 hover:bg-green-900"
            onClick={handleAddPattern}
          >
            Add Pattern
          </button>
          <button
            className="px-4 py-2 border border-green-400 hover:bg-green-900"
            onClick={() => handleDeletePattern(selectedPattern)}
            disabled={currentSequence.patterns.length <= 1}
          >
            Delete Pattern
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {currentSequence.patterns.map((pattern, index) => (
          <button
            key={pattern.id}
            className={`
              p-2 border
              ${selectedPattern === index ? 'bg-green-900 border-green-400' : 'border-gray-600'}
            `}
            onClick={() => handlePatternChange(index)}
          >
            {pattern.name}
          </button>
        ))}
      </div>

      {currentPattern && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pattern-length" className="block mb-1">Length (steps)</label>
            <input
              id="pattern-length"
              type="number"
              min={1}
              max={64}
              value={currentPattern.length}
              onChange={(e) => handlePatternLength(Number(e.target.value))}
              className="bg-gray-700 text-green-400 p-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="pattern-resolution" className="block mb-1">Resolution (steps/beat)</label>
            <select
              id="pattern-resolution"
              value={currentPattern.resolution}
              onChange={(e) => handleResolution(Number(e.target.value))}
              className="bg-gray-700 text-green-400 p-1 w-full"
            >
              <option value={4}>1/4</option>
              <option value={8}>1/8</option>
              <option value={16}>1/16</option>
              <option value={32}>1/32</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
