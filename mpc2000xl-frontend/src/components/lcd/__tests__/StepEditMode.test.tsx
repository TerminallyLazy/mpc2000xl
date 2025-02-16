import { render, screen, fireEvent } from '@testing-library/react';
import { StepEditMode } from '../StepEditMode';
import { Pattern } from '../../../types';

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
    
    // Check length input exists with correct value
    const lengthInput = screen.getByRole('spinbutton', { name: /length/i });
    expect(lengthInput).toHaveValue(mockPattern.length);
  });

  it('displays step grid with correct number of steps', () => {
    render(
      <StepEditMode
        currentPattern={mockPattern}
        onEventChange={mockOnEventChange}
        onPatternChange={mockOnPatternChange}
      />
    );

    const steps = screen.getAllByRole('button');
    expect(steps).toHaveLength(mockPattern.length);
  });

  it('shows event parameters when step with event is selected', () => {
    render(
      <StepEditMode
        currentPattern={mockPattern}
        onEventChange={mockOnEventChange}
        onPatternChange={mockOnPatternChange}
      />
    );

    // Click first step (which has an event)
    fireEvent.click(screen.getByText('1'));

    expect(screen.getByLabelText('Note')).toHaveValue(60);
    expect(screen.getByLabelText('Velocity')).toHaveValue(100);
    expect(screen.getByLabelText('Duration')).toHaveValue(1);
    expect(screen.getByLabelText('Gate')).toHaveValue(100);
  });

  it('calls onEventChange when event parameters are updated', () => {
    render(
      <StepEditMode
        currentPattern={mockPattern}
        onEventChange={mockOnEventChange}
        onPatternChange={mockOnPatternChange}
      />
    );

    // Select step with event
    fireEvent.click(screen.getByText('1'));

    // Update note value
    fireEvent.change(screen.getByLabelText('Note'), { target: { value: '72' } });

    expect(mockOnEventChange).toHaveBeenCalledWith(
      expect.objectContaining({
        note: 72,
        stepIndex: 0
      })
    );
  });
});
