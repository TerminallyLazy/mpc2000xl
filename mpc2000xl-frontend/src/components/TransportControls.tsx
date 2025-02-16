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
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col gap-3 p-8 
      backdrop-blur-md bg-control-bg/95 rounded-xl shadow-2xl border-2 border-primary/40 
      animate-fade-in z-50">
      <div className="flex gap-3">
        <button
          onClick={onPlay}
          className={`w-20 h-20 rounded-full backdrop-blur-md ${
            isPlaying ? 'bg-primary/90 shadow-inner' : 'bg-control-bg/80'
          } text-control-text font-bold hover:bg-primary/70 transition-all 
          shadow-lg border border-primary/40`}
          aria-label="Play"
          devinid="play-button"
        >
          PLAY
        </button>
        <button
          onClick={onStop}
          className="w-20 h-20 rounded-full backdrop-blur-md bg-control-bg/80 
            text-control-text font-bold hover:bg-primary/50 transition-all 
            shadow-lg border border-primary/40"
          aria-label="Stop"
          devinid="stop-button"
        >
          STOP
        </button>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRecord}
          className={`w-20 h-20 rounded-full backdrop-blur-md ${
            isRecording ? 'bg-primary/90 shadow-inner' : 'bg-control-bg/80'
          } text-control-text font-bold hover:bg-primary/70 transition-all 
          shadow-lg border border-primary/40`}
          aria-label="Record"
          devinid="record-button"
        >
          REC
        </button>
        <button
          onClick={onDub}
          className="w-20 h-20 rounded-full backdrop-blur-md bg-control-bg/80 
            text-control-text font-bold hover:bg-primary/50 transition-all 
            shadow-lg border border-primary/40"
          aria-label="Overdub"
          devinid="dub-button"
        >
          DUB
        </button>
      </div>
    </div>
  );
};
