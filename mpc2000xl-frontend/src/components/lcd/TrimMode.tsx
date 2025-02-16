import React, { useState, useEffect, useCallback } from 'react';
import { Sample } from '../../types';
import { SampleEditor } from '../../components/SampleEditor';
import { TimeStretchOptions, timeStretchProcessor } from '../../utils/timeStretch';
import { audioEngine } from '../../utils/audio';

interface TrimModeProps {
  currentSample: Sample | null;
  onStartPointChange: (value: number) => void;
  onEndPointChange: (value: number) => void;
  onLoopPointChange: (value: number) => void;
  onTuneChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onTimeStretch?: (options: TimeStretchOptions) => void;
}

export const TrimMode: React.FC<TrimModeProps> = ({
  currentSample,
  onStartPointChange,
  onEndPointChange,
  onLoopPointChange,
  onTuneChange,
  onVolumeChange,
  onTimeStretch
}) => {
  const [timeStretchRatio, setTimeStretchRatio] = useState(100);
  const [quality, setQuality] = useState<'A' | 'B' | 'C'>('A');
  const [algorithmIndex, setAlgorithmIndex] = useState(0);
  const [previewBuffer, setPreviewBuffer] = useState<AudioBuffer | null>(null);
  const [algorithms, setAlgorithms] = useState<Array<{name: string; quality: 'A' | 'B' | 'C'; index: number}>>([]);
  const [showTimeStretch, setShowTimeStretch] = useState(false);

  useEffect(() => {
    setAlgorithms(timeStretchProcessor.getAlgorithms());
  }, []);

  const handlePreview = useCallback(async () => {
    if (!currentSample?.data) return;

    try {
      const audioContext = new AudioContext();
      const buffer = await audioContext.decodeAudioData(currentSample.data.slice(0));
      const options: TimeStretchOptions = {
        quality,
        ratio: timeStretchRatio,
        algorithmIndex
      };

      const processedBuffer = await timeStretchProcessor.processAudio(buffer, options);
      setPreviewBuffer(processedBuffer);
      
      // Create temporary blob URL for preview
      // Convert AudioBuffer to Float32Array for preview
      const channelData = processedBuffer.getChannelData(0);
      const blob = new Blob([channelData.buffer], { type: 'audio/wav' });
      const tempId = `preview-${Date.now()}`;
      await audioEngine.loadSample(tempId, await blob.arrayBuffer());
      await audioEngine.playSample(tempId);
      audioEngine.disposeSample(tempId);
    } catch (error) {
      console.error('Preview error:', error);
    }
  }, [currentSample, quality, timeStretchRatio, algorithmIndex]);

  const handleTimeStretch = async () => {
    if (!currentSample || !previewBuffer || !onTimeStretch) return;

    onTimeStretch({
      quality,
      ratio: timeStretchRatio,
      algorithmIndex
    });
    setShowTimeStretch(false);
  };

  if (!currentSample) {
    return (
      <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
        <div className="mb-2 text-lg">TRIM MODE</div>
        <div>No sample selected</div>
      </div>
    );
  }

  const currentAlgorithms = algorithms.filter(algo => algo.quality === quality);

  return (
    <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
      <div className="mb-2 text-lg">TRIM MODE</div>
      <div className="mb-4">Sample: {currentSample.name}</div>
      
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowTimeStretch(!showTimeStretch)}
          className="px-4 py-2 bg-gray-700 text-green-400 rounded hover:bg-gray-600"
        >
          {showTimeStretch ? 'Hide Time Stretch' : 'Show Time Stretch'}
        </button>
      </div>

      {showTimeStretch ? (
        <div className="mb-6 border border-gray-700 p-4 rounded">
          <h3 className="text-lg mb-4">Time Stretch</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Ratio (%)</label>
              <input
                type="range"
                min="50"
                max="200"
                value={timeStretchRatio}
                onChange={(e) => {
                  setTimeStretchRatio(Number(e.target.value));
                  setPreviewBuffer(null);
                }}
                className="w-full accent-green-500"
              />
              <div className="text-sm mt-1">{timeStretchRatio}%</div>
            </div>
            <div>
              <label className="block text-sm mb-1">Quality</label>
              <select
                value={quality}
                onChange={(e) => {
                  setQuality(e.target.value as 'A' | 'B' | 'C');
                  setAlgorithmIndex(algorithms.find(a => a.quality === e.target.value)?.index || 0);
                  setPreviewBuffer(null);
                }}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
              >
                <option value="A">Standard (Fast)</option>
                <option value="B">Better (Medium)</option>
                <option value="C">Highest (Slow)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Algorithm</label>
            <select
              value={algorithmIndex}
              onChange={(e) => {
                setAlgorithmIndex(Number(e.target.value));
                setPreviewBuffer(null);
              }}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            >
              {currentAlgorithms.map((algo) => (
                <option key={algo.index} value={algo.index}>
                  {algo.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              disabled={!currentSample}
              className="flex-1 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Preview
            </button>
            <button
              onClick={handleTimeStretch}
              disabled={!previewBuffer || !onTimeStretch}
              className="flex-1 py-2 bg-green-700 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>
      ) : null}

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
