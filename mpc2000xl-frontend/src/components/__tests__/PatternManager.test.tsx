
import { render, screen, fireEvent } from '@testing-library/react';
import { PatternManager } from '../PatternManager';
import { Sequence, Pattern } from '../../types';

describe('PatternManager', () => {
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

  const mockOnSequenceChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pattern list and controls', () => {
    render(
      <PatternManager
        currentSequence={mockSequence}
        onSequenceChange={mockOnSequenceChange}
      />
    );

    expect(screen.getByText('Pattern Manager')).toBeInTheDocument();
    expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    expect(screen.getByText('Add Pattern')).toBeInTheDocument();
    expect(screen.getByText('Delete Pattern')).toBeInTheDocument();
  });

  it('adds new pattern', () => {
    render(
      <PatternManager
        currentSequence={mockSequence}
        onSequenceChange={mockOnSequenceChange}
      />
    );

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
  });

  it('updates pattern length', () => {
    render(
      <PatternManager
        currentSequence={mockSequence}
        onSequenceChange={mockOnSequenceChange}
      />
    );

    const lengthInput = screen.getByLabelText('Length (steps)');
    fireEvent.change(lengthInput, { target: { value: '32' } });

    expect(mockOnSequenceChange).toHaveBeenCalledWith(
      expect.objectContaining({
        patterns: [
          expect.objectContaining({
            length: 32
          })
        ]
      })
    );
  });

  it('updates pattern resolution', () => {
    render(
      <PatternManager
        currentSequence={mockSequence}
        onSequenceChange={mockOnSequenceChange}
      />
    );

    const resolutionSelect = screen.getByLabelText('Resolution (steps/beat)');
    fireEvent.change(resolutionSelect, { target: { value: '16' } });

    expect(mockOnSequenceChange).toHaveBeenCalledWith(
      expect.objectContaining({
        patterns: [
          expect.objectContaining({
            resolution: 16
          })
        ]
      })
    );
  });

  it('prevents deleting last pattern', () => {
    render(
      <PatternManager
        currentSequence={mockSequence}
        onSequenceChange={mockOnSequenceChange}
      />
    );

    const deleteButton = screen.getByText('Delete Pattern');
    fireEvent.click(deleteButton);

    expect(mockOnSequenceChange).not.toHaveBeenCalled();
  });
});
