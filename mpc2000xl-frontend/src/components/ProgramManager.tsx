import React, { useState, useEffect } from 'react';
import { Program } from '../types';

interface ProgramManagerProps {
  currentProgram: Program | null;
  onProgramSelect: (program: Program | null) => void;
}

export const ProgramManager: React.FC<ProgramManagerProps> = ({
  currentProgram,
  onProgramSelect
}) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/programs');
        const data = await response.json();
        setPrograms(data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const createNewProgram = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          name: `Program ${programs.length + 1}`,
          pad_assignments: {
            A: {}, B: {}, C: {}, D: {}
          },
          current_bank: 'A' as const
        })
      });
      const newProgram = await response.json();
      setPrograms(prev => [...prev, newProgram]);
      onProgramSelect(newProgram);
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  return (
    <div className="bg-gray-800 text-green-400 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg">Programs</h2>
        <button
          onClick={createNewProgram}
          className="px-4 py-2 border border-green-400 hover:bg-green-900"
        >
          New Program
        </button>
      </div>
      
      {loading ? (
        <div>Loading programs...</div>
      ) : (
        <div className="grid gap-2">
          {programs.map(program => (
            <div
              key={program.id}
              className={`p-2 border cursor-pointer ${
                currentProgram?.id === program.id
                  ? 'bg-green-900 border-green-400'
                  : 'border-gray-600 hover:border-green-400'
              }`}
              onClick={() => onProgramSelect(program)}
            >
              {program.name}
            </div>
          ))}
          {programs.length === 0 && (
            <div className="text-gray-500">No programs available</div>
          )}
        </div>
      )}
    </div>
  );
};
