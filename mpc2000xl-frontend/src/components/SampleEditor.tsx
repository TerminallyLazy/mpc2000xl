import React, { useState, useEffect, useRef } from 'react';
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
        const zoomedWidth = canvas.width * zoomLevel;
        const step = Math.ceil(channelData.length / zoomedWidth);
        
        // Clear canvas
        ctx.fillStyle = '#1F2937'; // bg-gray-800
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate visible range based on scroll position
        const visibleStart = Math.floor(scrollPosition * channelData.length);
        const samplesPerPixel = channelData.length / zoomedWidth;
        const visibleSamples = Math.ceil(canvas.width * samplesPerPixel);
        
        // Draw waveform
        ctx.beginPath();
        ctx.strokeStyle = '#34D399'; // text-green-400
        ctx.lineWidth = 1;
        
        for (let i = 0; i < canvas.width; i++) {
          const sampleIndex = visibleStart + (i * step);
          let min = 1.0;
          let max = -1.0;
          
          // Find min/max values for this pixel
          for (let j = 0; j < step; j++) {
            const idx = sampleIndex + j;
            if (idx < channelData.length) {
              const value = channelData[idx];
              min = Math.min(min, value);
              max = Math.max(max, value);
            }
          }
          
          const y1 = ((1 + min) * canvas.height) / 2;
          const y2 = ((1 + max) * canvas.height) / 2;
          
          if (i === 0) {
            ctx.moveTo(i, y1);
          }
          ctx.lineTo(i, y1);
          ctx.lineTo(i, y2);
        }
        
        ctx.stroke();

        // Draw markers
        const startX = ((sample.start_point - visibleStart) / visibleSamples) * canvas.width;
        const endX = (((sample.end_point || channelData.length) - visibleStart) / visibleSamples) * canvas.width;
        const loopX = sample.loop_point ? ((sample.loop_point - visibleStart) / visibleSamples) * canvas.width : null;

        // Start point
        if (startX >= 0 && startX <= canvas.width) {
          ctx.strokeStyle = '#FBBF24'; // yellow-400
          ctx.beginPath();
          ctx.moveTo(startX, 0);
          ctx.lineTo(startX, canvas.height);
          ctx.stroke();
        }

        // End point
        if (endX >= 0 && endX <= canvas.width) {
          ctx.strokeStyle = '#F87171'; // red-400
          ctx.beginPath();
          ctx.moveTo(endX, 0);
          ctx.lineTo(endX, canvas.height);
          ctx.stroke();
        }

        // Loop point
        if (loopX !== null && loopX >= 0 && loopX <= canvas.width) {
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
  }, [sample, zoomLevel, scrollPosition]);

  const handleScroll = (_e: React.UIEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setScrollPosition(scrollLeft / (scrollWidth - clientWidth));
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 4))}
          className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded text-green-400"
          devinid="zoom-in"
        >
          Zoom In
        </button>
        <button
          onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 1))}
          className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded text-green-400"
          devinid="zoom-out"
        >
          Zoom Out
        </button>
        <span className="text-sm text-green-400">Zoom Level: {zoomLevel}x</span>
      </div>

      <div 
        ref={containerRef}
        className="mb-4 overflow-x-auto"
        onScroll={handleScroll}
      >
        <div 
          className="relative"
          style={{
            width: `${100 * zoomLevel}%`,
            minWidth: '100%'
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-32"
            width={800}
            height={128}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-green-400 mb-1">Start Point</label>
          <input
            type="range"
            min="0"
            max={sample.data ? sample.data.byteLength : 100}
            value={sample.start_point}
            onChange={(e) => onStartPointChange(parseInt(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm text-green-400 mb-1">End Point</label>
          <input
            type="range"
            min="0"
            max={sample.data ? sample.data.byteLength : 100}
            value={sample.end_point || sample.data?.byteLength || 100}
            onChange={(e) => onEndPointChange(parseInt(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm text-green-400 mb-1">Loop Point</label>
          <input
            type="range"
            min="0"
            max={sample.data ? sample.data.byteLength : 100}
            value={sample.loop_point || 0}
            onChange={(e) => onLoopPointChange(parseInt(e.target.value))}
            className="w-full accent-green-500"
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
            className="w-full accent-green-500"
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
            className="w-full accent-green-500"
          />
        </div>
      </div>
    </div>
  );
};
