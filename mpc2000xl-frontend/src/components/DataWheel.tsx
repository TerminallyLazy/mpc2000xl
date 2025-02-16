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

    const calculateStep = (deltaY: number, timeDelta: number) => {
      if (!acceleration) return fineControl ? 0.1 : 1;

      // Calculate velocity (pixels per millisecond)
      const currentVelocity = deltaY / Math.max(timeDelta, 1);
      velocity.current = 0.8 * velocity.current + 0.2 * currentVelocity;

      // Base step size on velocity
      const baseStep = Math.abs(velocity.current) * (fineControl ? 0.5 : 5);
      return Math.min(Math.max(baseStep, fineControl ? 0.1 : 1), fineControl ? 1 : 10);
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
      
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTime.current;
      const deltaY = lastY.current - e.clientY;
      
      // Calculate step size based on velocity and fine control
      const step = calculateStep(deltaY, timeDelta);
      
      // Update value with direction and step size
      const direction = deltaY > 0 ? 1 : -1;
      const newValue = Math.min(max, Math.max(min, value + (direction * step)));
      onChange(newValue);

      // Update visual rotation
      setRotation(prev => (prev + deltaY) % 360);
      
      lastY.current = e.clientY;
      lastTime.current = currentTime;
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
        className="w-24 h-24 rounded-full bg-gray-700 border-4 border-gray-600 cursor-pointer relative"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="absolute top-0 left-1/2 w-1 h-4 bg-green-400 transform -translate-x-1/2" />
      </div>
      {fineControl && (
        <div className="absolute -top-2 -right-2 text-xs text-green-400 bg-gray-800 px-2 py-1 rounded">
          FINE
        </div>
      )}
    </div>
  );
};
