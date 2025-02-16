import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepEditMode } from '../lcd/StepEditMode';
import { Pattern, StepEvent } from '../../types';

describe('StepEditMode', () => {
  const mockPattern: Pattern = {
    id: '1',
    name: 'Test Pattern',
    events: [
      {
        type: 'noteOn',
        stepIndex: 0,
        time: 0,
        note: 60,
        velocity: 100,
        duration: 1,
        gate: 100
      }
    ],
    length: 16,
    resolution: 4
  };

  const mockOnEventChange = jest.fn();
  const mockOnPatternChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pattern information', () => {
    render(
      <StepEditMode
        currentPattern={mockPattern}
        onEventChange={mockOnEventChange}
        onPatternChange={mockOnPatternChange}
      />
    );

    expect(screen.getByText('STEP EDIT')).toBeInTheDocument();
    expect(screen.getByText(`Pattern: ${mockPattern.name}`)).toBeInTheDocument();
    expect(screen.getByText(`Length: ${mockPattern.length} steps`)).toBeInTheDocument();
  });

  it('allows editing event parameters', () => {
    render(
      <StepEditMode
        currentPattern={mockPattern}
        onEventChange={mockOnEventChange}
        onPatternChange={mockOnPatternChange}
      />
    );

    // Select first step
    fireEvent.click(screen.getByText('1'));

    // Edit note value
    const noteInput = screen.getByLabelText('Note');
    fireEvent.change(noteInput, { target: { value: '72' } });

    expect(mockOnEventChange).toHaveBeenCalledWith(
      expect.objectContaining({
        note: 72,
        stepIndex: 0
      })
    );
  });

  it('updates pattern length', () => {
    render(
      <StepEditMode
        currentPattern={mockPattern}
        onEventChange={mockOnEventChange}
        onPatternChange={mockOnPatternChange}
      />
    );

    const lengthInput = screen.getByLabelText('Length (steps)');
    fireEvent.change(lengthInput, { target: { value: '32' } });

    expect(mockOnPatternChange).toHaveBeenCalledWith(
      expect.objectContaining({
        length: 32
      })
    );
  });
});
