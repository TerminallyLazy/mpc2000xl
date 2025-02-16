import React from 'react';
import { Program, PadAssignment } from '../../types';

interface ProgramModeProps {
  currentProgram: Program | null;
  currentBank: 'A' | 'B' | 'C' | 'D';
  onBankChange: (bank: 'A' | 'B' | 'C' | 'D') => void;
  onPadAssign: (bank: 'A' | 'B' | 'C' | 'D', pad: number, assignment: PadAssignment) => void;
}

export const ProgramMode: React.FC<ProgramModeProps> = ({
  currentProgram,
  currentBank,
  onBankChange,
  onPadAssign
}) => {
  const handlePadClick = (pad: number) => {
    if (!currentProgram) return;
    
    // Initialize bank if it doesn't exist
    if (!currentProgram.pad_assignments[currentBank]) {
      currentProgram.pad_assignments[currentBank] = {};
    }
    
    onPadAssign(currentBank, pad, {
      sample_id: undefined,
      velocity: 100,
      tune: 0,
      volume: 100
    });
  };
  if (!currentProgram) {
    return (
      <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
        <div className="mb-2 text-lg">PROGRAM MODE</div>
        <div>No program selected</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
      <div className="mb-2 text-lg">PROGRAM MODE</div>
      <div className="mb-4">Program: {currentProgram.name}</div>
      <div className="flex gap-4 mb-4">
        {['A', 'B', 'C', 'D'].map(bank => (
          <button
            key={bank}
            className={`px-4 py-2 border ${
              bank === currentBank
                ? 'bg-green-900 border-green-400'
                : 'border-gray-600 hover:border-green-400'
            }`}
            onClick={() => onBankChange(bank as 'A' | 'B' | 'C' | 'D')}
          >
            Bank {bank}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 16 }).map((_, i) => {
          const assignment = currentProgram.pad_assignments[currentBank]?.[i];
          return (
            <div key={i} className="text-sm">
              <div>Pad {i + 1}</div>
              <div 
                className="cursor-pointer hover:text-green-300"
                onClick={() => handlePadClick(i)}
              >
                {assignment?.sample_id ? 'Assigned' : 'Empty'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
