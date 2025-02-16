import React from 'react';
import { LCDMode } from '../types';

interface ModeControlsProps {
  currentMode: LCDMode;
  onModeChange: (mode: LCDMode) => void;
  shiftActive: boolean;
}

interface ModeButton {
  primary: LCDMode;
  secondary: LCDMode;
  label: string;
}

const modeButtons: ModeButton[] = [
  { primary: 'MAIN', secondary: 'LOAD', label: 'MAIN/LOAD' },
  { primary: 'PROGRAM', secondary: 'SAVE', label: 'PROGRAM/SAVE' },
  { primary: 'TRIM', secondary: 'SETUP', label: 'TRIM/SETUP' },
  { primary: 'STEP_EDIT', secondary: 'LOAD', label: 'STEP EDIT' },
  { primary: 'PROGRAM', secondary: 'SAVE', label: 'TRACK MUTE' },
  { primary: 'TRIM', secondary: 'SETUP', label: 'TIMING CORR' }
];

export const ModeControls: React.FC<ModeControlsProps> = ({
  currentMode,
  onModeChange,
  shiftActive
}) => {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2">
      {modeButtons.map((button) => (
        <button
          key={button.primary}
          className={`
            px-4 py-2 border font-mono text-sm
            ${currentMode === (shiftActive ? button.secondary : button.primary)
              ? 'bg-primary/20 border-primary text-lcd-text'
              : 'border-control-text/20 text-control-text hover:border-primary hover:bg-primary/10'
            }
            transition-colors
          `}
          onClick={() => onModeChange(shiftActive ? button.secondary : button.primary)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};
