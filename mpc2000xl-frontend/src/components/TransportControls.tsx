import React, { useState } from 'react';

export interface TransportControlsProps {
  onPlay: () => void;
  onStop: () => void;
  onRecord: () => void;
  onDub: () => void;
  onOverdub: () => void;
  onUndo: () => void;
  isPlaying: boolean;
  isRecording: boolean;
}

const TransportButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  devinid?: string;
}> = ({ onClick, active, children, devinid }) => (
  <button
    onClick={onClick}
    className={`w-16 h-16 rounded-full backdrop-blur-md ${
      active ? 'bg-primary/90 shadow-inner' : 'bg-control-bg/80'
    } text-control-text font-bold hover:bg-primary/70 transition-all 
    shadow-lg border border-primary/40 text-sm`}
    aria-label={children?.toString()}
    devinid={devinid}
  >
    {children}
  </button>
);

export const TransportControls: React.FC<TransportControlsProps> = ({
  onPlay,
  onStop,
  onRecord,
  onDub,
  onOverdub,
  onUndo,
  isPlaying,
  isRecording
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
  };

  const handleDrag = (e: React.DragEvent) => {
    if (!isDragging) return;
    
    const x = e.clientX - window.innerWidth / 2;
    const y = e.clientY - window.innerHeight + 32;
    
    if (e.clientX !== 0 && e.clientY !== 0) {
      setPosition({ x, y });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div 
      className={`flex flex-col gap-3 p-4 
        backdrop-blur-md bg-control-bg/95 rounded-xl shadow-2xl border-2 border-primary/40 
        animate-fade-in cursor-move transition-all duration-300 min-w-[200px]
        ${isDragging ? 'opacity-50' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      draggable={true}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-end mb-2">
        <button 
          onClick={toggleMinimize}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
          devinid="minimize-transport"
        >
          {isMinimized ? 'Expand' : 'Minimize'}
        </button>
      </div>

      {!isMinimized && (
        <div className="grid grid-cols-2 gap-3">
          <TransportButton onClick={onPlay} active={isPlaying} devinid="play-button">
            PLAY
          </TransportButton>
          <TransportButton onClick={onStop} devinid="stop-button">
            STOP
          </TransportButton>
          <TransportButton onClick={onRecord} active={isRecording} devinid="record-button">
            REC
          </TransportButton>
          <TransportButton onClick={onDub} devinid="dub-button">
            DUB
          </TransportButton>
          <TransportButton onClick={onOverdub} devinid="overdub-button">
            OVERDUB
          </TransportButton>
          <TransportButton onClick={onUndo} devinid="undo-button">
            UNDO
          </TransportButton>
        </div>
      )}
    </div>
  );
};
