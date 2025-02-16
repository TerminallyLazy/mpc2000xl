import React, { useState } from 'react';
import { Pattern, StepEvent } from '../../types';

interface StepEditModeProps {
  currentPattern: Pattern;
  onEventChange: (event: StepEvent) => void;
  onPatternChange: (pattern: Pattern) => void;
}

export const StepEditMode: React.FC<StepEditModeProps> = ({
  currentPattern,
  onEventChange,
  onPatternChange
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<StepEvent | null>(null);

  const handleStepSelect = (stepIndex: number) => {
    setSelectedStep(stepIndex);
    const event = currentPattern.events.find(e => e.stepIndex === stepIndex);
    setSelectedEvent(event || null);
  };

  const handleEventUpdate = (updates: Partial<StepEvent>) => {
    if (!selectedEvent) return;
    
    const updatedEvent: StepEvent = {
      ...selectedEvent,
      ...updates
    };
    
    onEventChange(updatedEvent);
  };

  return (
    <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
      <div className="mb-2 text-lg">STEP EDIT</div>
      
      {/* Pattern Info */}
      <div className="mb-4">
        <div>Pattern: {currentPattern.name}</div>
        <div>Length: {currentPattern.length} steps</div>
        <div>Resolution: {currentPattern.resolution} steps/beat</div>
      </div>

      {/* Step Grid */}
      <div className="grid grid-cols-16 gap-1 mb-4">
        {Array.from({ length: currentPattern.length }, (_, i) => (
          <button
            key={i}
            className={`
              p-2 border
              ${selectedStep === i ? 'bg-green-900 border-green-400' : 'border-gray-600'}
              ${currentPattern.events.some(e => e.stepIndex === i) ? 'text-green-400' : 'text-gray-600'}
            `}
            onClick={() => handleStepSelect(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Event Parameters */}
      {selectedEvent && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Note</label>
            <input
              type="number"
              min={0}
              max={127}
              value={selectedEvent.note || 0}
              onChange={e => handleEventUpdate({ note: Number(e.target.value) })}
              className="bg-gray-700 text-green-400 p-1 w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Velocity</label>
            <input
              type="number"
              min={0}
              max={127}
              value={selectedEvent.velocity || 0}
              onChange={e => handleEventUpdate({ velocity: Number(e.target.value) })}
              className="bg-gray-700 text-green-400 p-1 w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Duration</label>
            <input
              type="number"
              min={1}
              max={currentPattern.length}
              value={selectedEvent.duration}
              onChange={e => handleEventUpdate({ duration: Number(e.target.value) })}
              className="bg-gray-700 text-green-400 p-1 w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Gate</label>
            <input
              type="number"
              min={1}
              max={100}
              value={selectedEvent.gate}
              onChange={e => handleEventUpdate({ gate: Number(e.target.value) })}
              className="bg-gray-700 text-green-400 p-1 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
