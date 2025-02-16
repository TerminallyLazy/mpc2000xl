import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepGrid } from '../StepGrid';
import { StepEvent } from '../../types';

describe('StepGrid', () => {
  const mockEvent: StepEvent = {
    type: 'noteOn',
    stepIndex: 0,
    time: 0,
    note: 60,
    velocity: 100,
    duration: 1,
    gate: 100
  };

  const mockOnEventChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders grid with correct number of steps', () => {
    render(
      <StepGrid
        events={[mockEvent]}
        resolution={4}
        onEventChange={mockOnEventChange}
      />
    );

    const steps = screen.getAllByRole('button');
    expect(steps).toHaveLength(16); // Default grid size
  });

  it('creates new event on step click', () => {
    render(
      <StepGrid
        events={[]}
        resolution={4}
        onEventChange={mockOnEventChange}
      />
    );

    // Click on empty step
    fireEvent.click(screen.getByText('1'));

    expect(mockOnEventChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'noteOn',
        stepIndex: 0,
        note: 60,
        velocity: 100
      })
    );
  });

  it('updates event parameters', () => {
    render(
      <StepGrid
        events={[mockEvent]}
        resolution={4}
        onEventChange={mockOnEventChange}
      />
    );

    // Select step with event
    fireEvent.click(screen.getByText('1'));

    // Update note value
    const noteInput = screen.getByLabelText('Note');
    fireEvent.change(noteInput, { target: { value: '72' } });

    expect(mockOnEventChange).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockEvent,
        note: 72
      })
    );
  });

  it('deletes event', () => {
    render(
      <StepGrid
        events={[mockEvent]}
        resolution={4}
        onEventChange={mockOnEventChange}
      />
    );

    // Select step with event
    fireEvent.click(screen.getByText('1'));

    // Click delete button
    fireEvent.click(screen.getByText('Delete Event'));

    expect(mockOnEventChange).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockEvent,
        type: 'noteOff',
        velocity: 0
      })
    );
  });
});
