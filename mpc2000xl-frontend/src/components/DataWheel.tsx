import React, { useRef, useEffect, useState } from 'react';

interface DataWheelProps {
  onChange: (value: number) => void;
  value: number;
  min?: number;
  max?: number;
  acceleration?: boolean;
  fineControl?: boolean;
}

export const DataWheel: React.FC<DataWheelProps> = ({
  onChange,
  value,
  min = 0,
  max = 100,
  acceleration = true,
  fineControl = false
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const lastY = useRef<number | null>(null);
  const lastTime = useRef<number>(Date.now());
  const velocity = useRef<number>(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const calculateStep = (deltaY: number) => {
      if (!acceleration) return fineControl ? 0.1 : 1;

      // Hardware-accurate step calculation
      const normalizedDelta = Math.abs(deltaY) / 100;
      const stepSize = fineControl ? 0.5 : 2;
      const maxStep = fineControl ? 1 : 4;
      
      return Math.min(Math.max(normalizedDelta * stepSize, 0.1), maxStep);
    };

    const handleMouseDown = (e: MouseEvent) => {
      lastY.current = e.clientY;
      lastTime.current = Date.now();
      velocity.current = 0;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (lastY.current === null) return;
      
      const deltaY = lastY.current - e.clientY;
      
      // Calculate step size based on velocity and fine control
      const step = calculateStep(deltaY);
      
      // Update value with direction and step size, using rounding for hardware accuracy
      const direction = deltaY > 0 ? 1 : -1;
      const newValue = Math.min(max, Math.max(min, value + (direction * step)));
      onChange(Math.round(newValue * 10) / 10);

      // Update visual rotation
      setRotation(prev => (prev + deltaY) % 360);
      
      lastY.current = e.clientY;
      lastTime.current = Date.now();
    };

    const handleMouseUp = () => {
      lastY.current = null;
      velocity.current = 0;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    wheel.addEventListener('mousedown', handleMouseDown);

    return () => {
      wheel.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [value, onChange, min, max, acceleration, fineControl]);

  return (
    <div className="relative">
      <div 
        ref={wheelRef}
        className="w-24 h-24 rounded-full bg-control-bg/90 border-4 border-primary/40 cursor-pointer relative hover:border-primary/60 transition-all shadow-2xl select-none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="absolute top-0 left-1/2 w-1 h-4 bg-green-400 transform -translate-x-1/2" />
        <div className="absolute inset-0 flex items-center justify-center text-xs text-green-400 pointer-events-none">
          {value.toFixed(1)}
        </div>
      </div>
      {fineControl && (
        <div className="absolute -top-2 -right-2 text-xs text-green-400 bg-gray-800 px-2 py-1 rounded">
          FINE
        </div>
      )}
    </div>
  );
};
