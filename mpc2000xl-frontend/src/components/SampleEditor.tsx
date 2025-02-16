import React, { useEffect, useRef } from 'react';
import { Sample } from '../types';

interface SampleEditorProps {
  sample: Sample;
  onStartPointChange: (value: number) => void;
  onEndPointChange: (value: number) => void;
  onLoopPointChange: (value: number) => void;
  onTuneChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
}

export const SampleEditor: React.FC<SampleEditorProps> = ({
  sample,
  onStartPointChange,
  onEndPointChange,
  onLoopPointChange,
  onTuneChange,
  onVolumeChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize AudioContext if needed
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const drawWaveform = async () => {
      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      try {
        // Convert sample data to AudioBuffer
        const arrayBuffer = sample.data;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get waveform data
        const channelData = audioBuffer.getChannelData(0);
        const step = Math.ceil(channelData.length / canvas.width);
        
        // Clear canvas
        ctx.fillStyle = '#1F2937'; // bg-gray-800
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw waveform
        ctx.beginPath();
        ctx.strokeStyle = '#34D399'; // text-green-400
        ctx.lineWidth = 1;
        
        for (let i = 0; i < canvas.width; i++) {
          const dataIndex = i * step;
          const value = channelData[dataIndex];
          const y = (value + 1) * canvas.height / 2;
          
          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        
        ctx.stroke();

        // Draw markers
        const startX = (sample.start_point / channelData.length) * canvas.width;
        const endX = ((sample.end_point || channelData.length) / channelData.length) * canvas.width;
        const loopX = sample.loop_point ? (sample.loop_point / channelData.length) * canvas.width : null;

        // Start point
        ctx.strokeStyle = '#FBBF24'; // yellow-400
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, canvas.height);
        ctx.stroke();

        // End point
        ctx.strokeStyle = '#F87171'; // red-400
        ctx.beginPath();
        ctx.moveTo(endX, 0);
        ctx.lineTo(endX, canvas.height);
        ctx.stroke();

        // Loop point
        if (loopX !== null) {
          ctx.strokeStyle = '#60A5FA'; // blue-400
          ctx.beginPath();
          ctx.moveTo(loopX, 0);
          ctx.lineTo(loopX, canvas.height);
          ctx.stroke();
        }
      } catch (error) {
        console.error('Error drawing waveform:', error);
      }
    };

    drawWaveform();
  }, [sample]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <canvas
        ref={canvasRef}
        className="w-full h-32 mb-4"
        width={800}
        height={128}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-green-400 mb-1">Start Point</label>
          <input
            type="range"
            min="0"
            max="100"
            value={sample.start_point}
            onChange={(e) => onStartPointChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm text-green-400 mb-1">End Point</label>
          <input
            type="range"
            min="0"
            max="100"
            value={sample.end_point || 100}
            onChange={(e) => onEndPointChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm text-green-400 mb-1">Loop Point</label>
          <input
            type="range"
            min="0"
            max="100"
            value={sample.loop_point || 0}
            onChange={(e) => onLoopPointChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm text-green-400 mb-1">Tune ({sample.tune} semitones)</label>
          <input
            type="range"
            min="-12"
            max="12"
            value={sample.tune}
            onChange={(e) => onTuneChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm text-green-400 mb-1">Volume ({sample.volume}%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={sample.volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
