import React from 'react';

interface HelpTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  children, 
  content,
  position = 'top' 
}) => {
  return (
    <div className="relative group">
      {children}
      <div className={`
        absolute z-50 px-2 py-1 text-sm
        bg-control-bg/90 backdrop-blur-sm
        text-control-text rounded-md shadow-lg
        border border-primary/20
        transition-all duration-200 scale-0 group-hover:scale-100
        ${position === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2'}
        ${position === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2'}
        ${position === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2'}
        ${position === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2'}
      `}>
        {content}
      </div>
    </div>
  );
};
