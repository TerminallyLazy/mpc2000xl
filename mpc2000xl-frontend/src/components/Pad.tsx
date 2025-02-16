import React from 'react';
import { PadAssignment } from '../types';

interface PadProps {
  index: number;
  onClick: () => void;
  isPressed?: boolean;
  assignment?: PadAssignment;
}

export const Pad: React.FC<PadProps> = ({ 
  index, 
  onClick, 
  isPressed = false,
  assignment 
}) => {
  return (
    <button
      className={`
        w-[60px] h-[60px] rounded-sm relative backdrop-blur-sm animate-slide-in
        ${isPressed 
          ? 'bg-pad-active/90 shadow-inner' 
          : assignment?.sample_id
            ? 'bg-pad-inactive/80 shadow-lg hover:bg-pad-active/70 border border-primary/80'
            : 'bg-pad-inactive/80 shadow-lg hover:bg-pad-active/70'
        } 
        transition-all duration-200
      `}
      devinid={`pad-${index}`}
      onClick={onClick}
    >
      <span className="text-xs text-control-text/60">{index + 1}</span>
      {assignment?.sample_id && (
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
      )}
    </button>
  );
};
