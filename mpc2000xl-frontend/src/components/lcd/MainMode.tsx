import React from 'react';
import { Program } from '../../types';

interface MainModeProps {
  currentProgram: Program | null;
  onProgramSelect: (program: Program | null) => void;
  programs: Program[];
}

export const MainMode: React.FC<MainModeProps> = ({
  currentProgram,
  onProgramSelect,
  programs
}) => {
  return (
    <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
      <div className="mb-2 text-lg">MAIN MODE</div>
      <div className="flex justify-between items-center">
        <div>Program: {currentProgram?.name || 'None'}</div>
        <select 
          className="bg-gray-700 text-green-400 border border-green-400 px-2 py-1"
          value={currentProgram?.id || ''}
          onChange={(e) => {
            const selectedProgram = programs.find(p => p.id === e.target.value);
            onProgramSelect(selectedProgram || null);
          }}
        >
          <option value="">Select Program</option>
          {programs.map(prog => (
            <option key={prog.id} value={prog.id}>
              {prog.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
