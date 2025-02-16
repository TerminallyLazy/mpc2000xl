import React from 'react';

interface TransportControlsProps {
  onPlay: () => void;
  onStop: () => void;
  onRecord: () => void;
  onDub: () => void;
  isPlaying: boolean;
  isRecording: boolean;
}

export const TransportControls: React.FC<TransportControlsProps> = ({
  onPlay,
  onStop,
  onRecord,
  onDub,
  isPlaying,
  isRecording
}) => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 p-6 backdrop-blur-sm bg-control-bg/90 rounded-lg shadow-xl border border-primary/20 animate-fade-in z-50">
      <div className="flex gap-2">
        <button
          onClick={onPlay}
          className={`w-16 h-16 rounded-full backdrop-blur-md ${
            isPlaying ? 'bg-primary/80' : 'bg-control-bg/60'
          } text-control-text font-bold hover:bg-primary/60 transition-all`}
          aria-label="Play"
        >
          PLAY
        </button>
        <button
          onClick={onStop}
          className="w-16 h-16 rounded-full backdrop-blur-md bg-control-bg/60 text-control-text font-bold hover:bg-primary/40 transition-all"
          aria-label="Stop"
        >
          STOP
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRecord}
          className={`w-16 h-16 rounded-full backdrop-blur-md ${
            isRecording ? 'bg-primary/80' : 'bg-control-bg/60'
          } text-control-text font-bold hover:bg-primary/60 transition-all`}
          aria-label="Record"
        >
          REC
        </button>
        <button
          onClick={onDub}
          className="w-16 h-16 rounded-full backdrop-blur-md bg-control-bg/60 text-control-text font-bold hover:bg-primary/40 transition-all"
          aria-label="Overdub"
        >
          DUB
        </button>
      </div>
    </div>
  );
};
