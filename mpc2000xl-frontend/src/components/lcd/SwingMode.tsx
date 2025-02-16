import React from 'react';
import { SwingSettings } from '../../types';

interface SwingModeProps {
  settings: SwingSettings;
  onSettingsChange: (settings: SwingSettings) => void;
}

export const SwingMode: React.FC<SwingModeProps> = ({
  settings,
  onSettingsChange
}) => {
  const handlePercentageChange = (value: number) => {
    // Clamp value between 50-75 and round to nearest 5
    const clampedValue = Math.min(75, Math.max(50, value));
    const roundedValue = Math.round(clampedValue / 5) * 5;
    
    onSettingsChange({
      ...settings,
      percentage: roundedValue
    });
  };

  const handleResolutionChange = (value: number) => {
    onSettingsChange({
      ...settings,
      resolution: value
    });
  };

  return (
    <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
      <div className="mb-2 text-lg">SWING MODE</div>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Swing (%)</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="50"
            max="75"
            value={settings.percentage}
            onChange={(e) => handlePercentageChange(Number(e.target.value))}
            className="flex-1 accent-green-500"
          />
          <span className="text-sm w-12">{settings.percentage}%</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Resolution</label>
        <select
          value={settings.resolution}
          onChange={(e) => handleResolutionChange(Number(e.target.value))}
          className="w-full p-2 bg-gray-700 rounded border border-gray-600"
        >
          <option value={4}>1/4 Note</option>
          <option value={8}>1/8 Note</option>
          <option value={16}>1/16 Note</option>
          <option value={32}>1/32 Note</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Enable Swing</label>
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => onSettingsChange({
            ...settings,
            enabled: e.target.checked
          })}
          className="form-checkbox h-4 w-4 text-green-500 bg-gray-700 border-gray-600 rounded"
        />
      </div>
    </div>
  );
};
