import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SwingMode } from '../SwingMode';
import { SwingSettings } from '../../../types';

describe('SwingMode', () => {
  const defaultSettings: SwingSettings = {
    enabled: true,
    percentage: 50,
    resolution: 16
  };

  it('renders with default settings', () => {
    const onSettingsChange = jest.fn();
    render(
      <SwingMode
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );

    expect(screen.getByText('SWING MODE')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('updates percentage within valid range', () => {
    const onSettingsChange = jest.fn();
    const initialSettings = { ...defaultSettings, percentage: 50 };
    render(
      <SwingMode
        settings={initialSettings}
        onSettingsChange={onSettingsChange}
      />
    );

    const slider = screen.getByRole('slider');
    
    // Test valid range (should round to nearest 5)
    fireEvent.change(slider, { target: { value: '63' } });
    expect(onSettingsChange).nthCalledWith(1, {
      ...initialSettings,
      percentage: 65
    });

    // Test upper limit
    fireEvent.change(slider, { target: { value: '80' } });
    expect(onSettingsChange).nthCalledWith(2, {
      ...initialSettings,
      percentage: 75
    });

    // Test lower limit
    fireEvent.change(slider, { target: { value: '45' } });
    expect(onSettingsChange).nthCalledWith(3, {
      ...initialSettings,
      percentage: 50
    });
  });

  it('updates resolution', () => {
    const onSettingsChange = jest.fn();
    render(
      <SwingMode
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '8' } });

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...defaultSettings,
      resolution: 8
    });
  });

  it('toggles swing enable/disable', () => {
    const onSettingsChange = jest.fn();
    render(
      <SwingMode
        settings={defaultSettings}
        onSettingsChange={onSettingsChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onSettingsChange).toHaveBeenCalledWith({
      ...defaultSettings,
      enabled: false
    });
  });
});
