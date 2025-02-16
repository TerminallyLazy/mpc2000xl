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

    // Create new event by clicking first step
    const stepButtons = screen.getAllByText('1');
    const stepButton = stepButtons[0];
    fireEvent.click(stepButton);

    expect(mockOnEventChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'noteOn',
        stepIndex: 0,
        note: 60,
        velocity: 100
      })
    );

    // Edit event parameters using the note input
    const noteInput = screen.getByRole('spinbutton', { name: /note/i });
    fireEvent.change(noteInput, { target: { value: '72' } });

    expect(mockOnEventChange).toHaveBeenCalledWith(
      expect.objectContaining({
        note: 72,
        stepIndex: 0,
        type: 'noteOn',
        velocity: 100,
        time: 0,
        duration: 1,
        gate: 100
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

    // Click Test Pattern to show pattern controls
    fireEvent.click(screen.getByText('Test Pattern'));

    // Wait for pattern controls to appear
    await new Promise(resolve => setTimeout(resolve, 0));

    // Change resolution using the pattern resolution select
    const resolutionSelect = screen.getByLabelText('Resolution (steps/beat)', { exact: true });
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
