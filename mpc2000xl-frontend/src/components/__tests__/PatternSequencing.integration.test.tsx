import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepEditMode } from '../lcd/StepEditMode';
import { PatternManager } from '../PatternManager';
import { Pattern, Sequence, StepEvent } from '../../types';

describe('Pattern Sequencing Integration', () => {
  const mockEvent: StepEvent = {
    type: 'noteOn',
    stepIndex: 0,
    time: 0,
    note: 60,
    velocity: 100,
    duration: 1,
    gate: 100
  };

  const mockPattern: Pattern = {
    id: '1',
    name: 'Test Pattern',
    events: [mockEvent],
    length: 16,
    resolution: 4
  };

  const mockSequence: Sequence = {
    id: '1',
    name: 'Test Sequence',
    patterns: [mockPattern],
    currentPattern: 0,
    tempo: 120
  };

  const mockOnEventChange = jest.fn();
  const mockOnPatternChange = jest.fn();
  const mockOnSequenceChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles pattern changes and event updates', () => {
    render(
      <>
        <StepEditMode
          currentPattern={mockPattern}
          onEventChange={mockOnEventChange}
          onPatternChange={mockOnPatternChange}
        />
        <PatternManager
          currentSequence={mockSequence}
          onSequenceChange={mockOnSequenceChange}
        />
      </>
    );

    // Add new pattern
    fireEvent.click(screen.getByText('Add Pattern'));

    expect(mockOnSequenceChange).toHaveBeenCalledWith(
      expect.objectContaining({
        patterns: expect.arrayContaining([
          mockPattern,
          expect.objectContaining({
            name: 'Pattern 2',
            length: 16,
            resolution: 4
          })
        ])
      })
    );

    // Update pattern length
    const lengthInput = screen.getByLabelText('Length (steps)');
    fireEvent.change(lengthInput, { target: { value: '32' } });

    expect(mockOnPatternChange).toHaveBeenCalledWith(
      expect.objectContaining({
        length: 32
      })
    );
  });

  it('maintains event timing across pattern changes', () => {
    render(
      <>
        <StepEditMode
          currentPattern={mockPattern}
          onEventChange={mockOnEventChange}
          onPatternChange={mockOnPatternChange}
        />
        <PatternManager
          currentSequence={mockSequence}
          onSequenceChange={mockOnSequenceChange}
        />
      </>
    );

    // Update event timing
    const event = screen.getByText('1');
    fireEvent.click(event);

    const gateInput = screen.getByLabelText('Gate');
    fireEvent.change(gateInput, { target: { value: '50' } });

    expect(mockOnEventChange).toHaveBeenCalledWith(
      expect.objectContaining({
        gate: 50,
        stepIndex: 0
      })
    );

    // Change pattern resolution
    const resolutionSelect = screen.getByLabelText('Resolution (steps/beat)');
    fireEvent.change(resolutionSelect, { target: { value: '16' } });

    expect(mockOnSequenceChange).toHaveBeenCalledWith(
      expect.objectContaining({
        patterns: expect.arrayContaining([
          expect.objectContaining({
            resolution: 16
          })
        ])
      })
    );
  });
});
