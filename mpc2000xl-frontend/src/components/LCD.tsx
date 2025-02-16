import React from 'react';
import { LCDMode } from '../types';

interface LCDParameter {
  label: string;
  value: string | number;
  selected?: boolean;
}

interface LCDProps {
  mode: LCDMode;
  line1: string;
  line2: string;
  parameters?: LCDParameter[];
  statusIndicators?: {
    recording?: boolean;
    playing?: boolean;
    tempo?: number;
    bank?: 'A' | 'B' | 'C' | 'D';
  };
  menuItems?: string[];
  selectedItem?: number;
  onMenuSelect?: (index: number) => void;
  activeParameter?: {
    label: string;
    value: number;
  };
}

const formatValue = (value: string | number): string => {
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return value.toFixed(1);
  }
  return value;
};

export const LCD: React.FC<LCDProps> = ({
  mode,
  line1,
  line2,
  parameters = [],
  statusIndicators = {},
  menuItems = [],
  selectedItem = 0,
  onMenuSelect,
  activeParameter
}) => {
  const showMenu = menuItems.length > 0 && mode !== 'MAIN';

  return (
    <div className="bg-lcd-bg/90 text-lcd-text font-mono rounded-sm backdrop-blur-md shadow-lg border border-control-text/10 animate-fade-in" devinid="lcd-display">
      {/* Status Bar */}
      <div className="px-4 pt-2 flex justify-between text-xs">
        <div>{mode}</div>
        <div className="flex gap-4">
          {statusIndicators.recording && <span className="text-primary">REC</span>}
          {statusIndicators.playing && <span>PLAYING</span>}
          {statusIndicators.tempo && <span>{statusIndicators.tempo}BPM</span>}
          {statusIndicators.bank && <span>BANK {statusIndicators.bank}</span>}
        </div>
      </div>

      {/* Main Display - 2x16 character format */}
      <div className="p-4 w-[320px] h-[80px] flex flex-col justify-center border-b border-control-text/20 font-['Courier_New'] tracking-wider">
        <div className="text-sm mb-2 overflow-hidden whitespace-pre">{line1.padEnd(16, ' ').slice(0, 16)}</div>
        <div className="text-sm overflow-hidden whitespace-pre">{line2.padEnd(16, ' ').slice(0, 16)}</div>
      </div>

      {/* Parameters */}
      {parameters && parameters.length > 0 && (
        <div className="px-4 py-2 grid grid-cols-2 gap-2 text-xs border-b border-control-text/20">
          {parameters.map((param, index) => (
            <div 
              key={index}
              className={`flex justify-between ${
                activeParameter?.label === param.label ? 'bg-primary/20' : ''
              } transition-colors duration-150`}
            >
              <span>{param.label}:</span>
              <span>{formatValue(param.value)}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Active Parameter Display */}
      {activeParameter && (
        <div className="px-4 py-2 text-sm border-t border-control-text/20 bg-lcd-bg">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lcd-text">{activeParameter.label}</span>
            <span className="text-lcd-text">{formatValue(activeParameter.value)}</span>
          </div>
          <div className="mt-1 text-xs text-control-text/60">
            Use ↑↓ to select parameter, Data Wheel to adjust
          </div>
        </div>
      )}

      {/* Menu Items */}
      {showMenu && (
        <div className="p-2 max-h-[160px] overflow-y-auto">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`px-2 py-1 cursor-pointer text-xs ${
                index === selectedItem ? 'bg-primary/20' : 'hover:bg-control-text/10'
              }`}
              onClick={() => onMenuSelect?.(index)}
            >
              {index === selectedItem ? '> ' : '  '}{item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
