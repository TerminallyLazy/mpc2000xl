import { render, screen, fireEvent } from '@testing-library/react';
import { StepEditMode } from '../lcd/StepEditMode';
import { PatternManager } from '../PatternManager';
import { StepGrid } from '../StepGrid';
import { Pattern, Sequence } from '../../types';

describe('Step Editor Integration', () => {
  const mockPattern: Pattern = {
    id: '1',
    name: 'Test Pattern',
    events: [],
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

  it('creates and edits events across components', async () => {
    render(
      <>
        <StepEditMode
          currentPattern={mockPattern}
          onEventChange={mockOnEventChange}
          onPatternChange={mockOnPatternChange}
        />
        <StepGrid
          events={mockPattern.events}
          resolution={mockPattern.resolution}
          onEventChange={mockOnEventChange}
        />
        <PatternManager
          currentSequence={mockSequence}
          onSequenceChange={mockOnSequenceChange}
        />
      </>
    );

    // Create new event
    const stepButton = screen.getAllByText('1')[0];
    fireEvent.click(stepButton);

    // Wait for next tick to allow event handlers to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockOnEventChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'noteOn',
        stepIndex: 0,
        note: 60,
        velocity: 100
      })
    );

    // Edit event parameters
    const noteInput = screen.getByLabelText('Note');
    fireEvent.change(noteInput, { target: { value: '72' } });

    expect(mockOnEventChange).toHaveBeenCalledWith(
      expect.objectContaining({
        note: 72
      })
    );

    // Change pattern length
    const lengthInput = screen.getByLabelText('Length (steps)');
    fireEvent.change(lengthInput, { target: { value: '32' } });

    expect(mockOnPatternChange).toHaveBeenCalledWith(
      expect.objectContaining({
        length: 32
      })
    );
  });

  it('manages patterns and sequences correctly', async () => {
    render(
      <PatternManager
        currentSequence={mockSequence}
        onSequenceChange={mockOnSequenceChange}
      />
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

    // Change resolution
    const resolutionSelect = screen.getByLabelText('Resolution (steps/beat)', { exact: false });
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
