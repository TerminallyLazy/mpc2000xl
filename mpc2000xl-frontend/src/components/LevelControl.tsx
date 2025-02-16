import React, { useRef, useEffect } from 'react';

interface LevelControlProps {
  value: number;
  onChange: (value: number) => void;
  type: 'main' | 'record' | 'note';
  label?: string;
}

export const LevelControl: React.FC<LevelControlProps> = ({
  value,
  onChange,
  type,
  label
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const height = rect.height;
      const y = Math.max(0, Math.min(height, e.clientY - rect.top));
      const newValue = Math.round((1 - y / height) * 100);
      
      onChange(newValue);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onChange]);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  return (
    <div className="flex flex-col items-center">
      {label && <div className="text-xs text-gray-400 mb-1">{label}</div>}
      <div 
        ref={sliderRef}
        className="w-2 h-32 bg-gray-700 rounded-full relative cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div 
          className="absolute w-4 h-4 -left-1 rounded-full bg-gray-500 border-2 border-gray-400"
          style={{ bottom: `${value}%`, transform: 'translateY(50%)' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-full rounded-full bg-green-400"
          style={{ height: `${value}%` }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-1">{value}</div>
    </div>
  );
};
