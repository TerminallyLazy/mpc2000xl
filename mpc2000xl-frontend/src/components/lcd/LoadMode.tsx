import React from 'react';
import { Sample } from '../../types';
import { SoundBankSelector } from '../SoundBankSelector';

interface LoadModeProps {
  onSampleSelect: (sampleId: string) => void;
  samples: Sample[];
}

export const LoadMode: React.FC<LoadModeProps> = ({
  onSampleSelect,
  samples
}) => {


  return (
    <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
      <div className="mb-2 text-lg">LOAD MODE</div>
      <SoundBankSelector />
      <div className="mt-4 grid gap-2">
        {samples.map(sample => (
          <div
            key={sample.id}
            className="cursor-pointer hover:text-green-300"
            onClick={() => onSampleSelect(sample.id)}
          >
            {sample.name}
          </div>
        ))}
      </div>
    </div>
  );
};
