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
    
    // Create component with mock settings
    const { rerender } = render(
      <SwingMode
        settings={initialSettings}
        onSettingsChange={onSettingsChange}
      />
    );

    const slider = screen.getByRole('slider');
    
    // Test valid range (should snap to nearest 5)
    fireEvent.change(slider, { target: { value: '65' } });
    expect(onSettingsChange).toHaveBeenCalledTimes(1);
    expect(onSettingsChange).toHaveBeenLastCalledWith({
      ...initialSettings,
      percentage: 65
    });

    // Update component with new settings
    const settings65 = { ...initialSettings, percentage: 65 };
    rerender(
      <SwingMode
        settings={settings65}
        onSettingsChange={onSettingsChange}
      />
    );

    // Test upper limit
    fireEvent.change(slider, { target: { value: '75' } });
    expect(onSettingsChange).toHaveBeenCalledTimes(2);
    expect(onSettingsChange).toHaveBeenLastCalledWith({
      ...settings65,
      percentage: 75
    });

    // Update component with new settings
    const settings75 = { ...settings65, percentage: 75 };
    rerender(
      <SwingMode
        settings={settings75}
        onSettingsChange={onSettingsChange}
      />
    );

    // Test lower limit
    fireEvent.change(slider, { target: { value: '50' } });
    expect(onSettingsChange).toHaveBeenCalledTimes(3);
    expect(onSettingsChange).toHaveBeenLastCalledWith({
      ...settings75,
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
