import React from 'react';
import { Sample } from '../../types';
import { SampleEditor } from '../../components/SampleEditor';

interface TrimModeProps {
  currentSample: Sample | null;
  onStartPointChange: (value: number) => void;
  onEndPointChange: (value: number) => void;
  onLoopPointChange: (value: number) => void;
  onTuneChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
}

export const TrimMode: React.FC<TrimModeProps> = ({
  currentSample,
  onStartPointChange,
  onEndPointChange,
  onLoopPointChange,
  onTuneChange,
  onVolumeChange
}) => {
  if (!currentSample) {
    return (
      <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
        <div className="mb-2 text-lg">TRIM MODE</div>
        <div>No sample selected</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
      <div className="mb-2 text-lg">TRIM MODE</div>
      <div className="mb-4">Sample: {currentSample.name}</div>
      <SampleEditor
        sample={currentSample}
        onStartPointChange={onStartPointChange}
        onEndPointChange={onEndPointChange}
        onLoopPointChange={onLoopPointChange}
        onTuneChange={onTuneChange}
        onVolumeChange={onVolumeChange}
      />
    </div>
  );
};
