import React, { useState } from 'react';

interface TransportControlsProps {
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
    className={`w-20 h-20 rounded-full backdrop-blur-md ${
      active ? 'bg-primary/90 shadow-inner' : 'bg-control-bg/80'
    } text-control-text font-bold hover:bg-primary/70 transition-all 
    shadow-lg border border-primary/40`}
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

  return (
    <div 
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col gap-3 p-6 
        backdrop-blur-md bg-control-bg/95 rounded-xl shadow-2xl border-2 border-primary/40 
        animate-fade-in z-[9999] cursor-move transition-all duration-300
        ${isDragging ? 'opacity-50' : ''}`}
      style={{
        transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
      }}
      draggable={true}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-end mb-2">
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
          devinid="minimize-button"
        >
          {isMinimized ? 'Expand' : 'Minimize'}
        </button>
      </div>

      {!isMinimized && (
        <>
          <div className="flex gap-3">
            <TransportButton onClick={onPlay} active={isPlaying} devinid="play-button">
              PLAY
            </TransportButton>
            <TransportButton onClick={onStop} devinid="stop-button">
              STOP
            </TransportButton>
          </div>
          <div className="flex gap-3">
            <TransportButton onClick={onRecord} active={isRecording} devinid="record-button">
              REC
            </TransportButton>
            <TransportButton onClick={onDub} devinid="dub-button">
              DUB
            </TransportButton>
          </div>
          <div className="flex gap-3">
            <TransportButton onClick={onOverdub} devinid="overdub-button">
              OVERDUB
            </TransportButton>
            <TransportButton onClick={onUndo} devinid="undo-button">
              UNDO
            </TransportButton>
          </div>
        </>
      )}
    </div>
  );
};
