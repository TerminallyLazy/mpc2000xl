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
      
      // Add smoothing to prevent jumps
      const smoothingFactor = 0.2;
      const smoothedValue = value + (newValue - value) * smoothingFactor;
      onChange(Math.round(smoothedValue));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    if (isDragging.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onChange, value]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    isDragging.current = true;
    
    // Initial value calculation
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const height = rect.height;
      const y = Math.max(0, Math.min(height, e.clientY - rect.top));
      const newValue = Math.round((1 - y / height) * 100);
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {label && <div className="text-xs text-gray-400 mb-1">{label}</div>}
      <div 
        ref={sliderRef}
        className="w-2 h-32 bg-gray-700 rounded-full relative cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        <div 
          className="absolute w-4 h-4 -left-1 rounded-full bg-gray-500 border-2 border-gray-400 shadow-lg transition-transform"
          style={{ bottom: `${value}%`, transform: 'translateY(50%)' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-full rounded-full bg-green-400 transition-all"
          style={{ height: `${value}%` }}
        />
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-xs text-green-400">
          {value}
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-1">{value}</div>
    </div>
  );
};
