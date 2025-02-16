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
        w-[60px] h-[60px] rounded-sm relative
        ${isPressed 
          ? 'bg-gray-600 shadow-inner' 
          : assignment?.sample_id
            ? 'bg-gray-700 shadow-md hover:bg-gray-600 border border-green-400'
            : 'bg-gray-700 shadow-md hover:bg-gray-600'
        } 
        transition-all
      `}
      onClick={onClick}
    >
      <span className="text-xs text-gray-400">{index + 1}</span>
      {assignment?.sample_id && (
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-400" />
      )}
    </button>
  );
};
