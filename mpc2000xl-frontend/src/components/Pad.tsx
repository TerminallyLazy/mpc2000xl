import React from 'react';

interface PadProps {
  index: number;
  onClick: () => void;
  isPressed?: boolean;
}

export const Pad: React.FC<PadProps> = ({ index, onClick, isPressed = false }) => {
  return (
    <button
      className={`w-[60px] h-[60px] rounded-sm ${
        isPressed 
          ? 'bg-gray-600 shadow-inner' 
          : 'bg-gray-700 shadow-md hover:bg-gray-600'
      } transition-all`}
      onClick={onClick}
    >
      <span className="text-xs text-gray-400">{index + 1}</span>
    </button>
  );
};
