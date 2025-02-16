import React, { useState } from 'react';
import { StepEvent } from '../types';

interface StepGridProps {
  events: StepEvent[];
  resolution: number;
  onEventChange: (event: StepEvent) => void;
}

export const StepGrid: React.FC<StepGridProps> = ({
  events,
  resolution,
  onEventChange
}) => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const getEventAtStep = (stepIndex: number) => {
    return events.find(e => e.stepIndex === stepIndex);
  };

  const handleStepClick = (stepIndex: number) => {
    setSelectedStep(stepIndex);
    const existingEvent = getEventAtStep(stepIndex);
    
    if (!existingEvent) {
      // Create new event
      const newEvent: StepEvent = {
        type: 'noteOn',
        stepIndex,
        time: stepIndex * (60000 / resolution),
        note: 60,
        velocity: 100,
        duration: 1,
        gate: 100
      };
      onEventChange(newEvent);
    }
  };

  const handleEventUpdate = (stepIndex: number, updates: Partial<StepEvent>) => {
    const existingEvent = getEventAtStep(stepIndex);
    if (!existingEvent) return;

    onEventChange({
      ...existingEvent,
      ...updates
    });
  };

  const handleDeleteEvent = (stepIndex: number) => {
    const existingEvent = getEventAtStep(stepIndex);
    if (!existingEvent) return;

    onEventChange({
      ...existingEvent,
      type: 'noteOff',
      velocity: 0
    });
  };

  return (
    <div className="bg-gray-800 text-green-400 font-mono">
      {/* Step Grid */}
      <div className="grid grid-cols-16 gap-1 mb-4">
        {Array.from({ length: 16 }, (_, i) => {
          const event = getEventAtStep(i);
          return (
            <button
              key={i}
              className={`
                p-2 border relative
                ${selectedStep === i ? 'bg-green-900 border-green-400' : 'border-gray-600'}
                ${event ? 'text-green-400' : 'text-gray-600'}
              `}
              onClick={() => handleStepClick(i)}
            >
              {i + 1}
              {event && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-400"
                     style={{ opacity: event.velocity ? event.velocity / 127 : 0 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Event Parameters */}
      {selectedStep !== null && getEventAtStep(selectedStep) && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Note</label>
            <input
              type="number"
              min={0}
              max={127}
              value={getEventAtStep(selectedStep)?.note || 0}
              onChange={e => handleEventUpdate(selectedStep, { note: Number(e.target.value) })}
              className="bg-gray-700 text-green-400 p-1 w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Velocity</label>
            <input
              type="number"
              min={0}
              max={127}
              value={getEventAtStep(selectedStep)?.velocity || 0}
              onChange={e => handleEventUpdate(selectedStep, { velocity: Number(e.target.value) })}
              className="bg-gray-700 text-green-400 p-1 w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Gate</label>
            <input
              type="number"
              min={1}
              max={100}
              value={getEventAtStep(selectedStep)?.gate || 100}
              onChange={e => handleEventUpdate(selectedStep, { gate: Number(e.target.value) })}
              className="bg-gray-700 text-green-400 p-1 w-full"
            />
          </div>
          <button
            className="px-4 py-2 border border-red-400 hover:bg-red-900 text-red-400"
            onClick={() => handleDeleteEvent(selectedStep)}
          >
            Delete Event
          </button>
        </div>
      )}
    </div>
  );
};
