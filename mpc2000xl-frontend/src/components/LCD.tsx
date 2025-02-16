import React from 'react';

interface LCDProps {
  line1: string;
  line2: string;
  currentMode: string;
  currentPage?: number;
  menuItems?: string[];
  selectedItem?: number;
  onMenuSelect?: (index: number) => void;
}

export const LCD: React.FC<LCDProps> = ({
  line1,
  line2,
  currentMode,
  currentPage = 1,
  menuItems = [],
  selectedItem = 0,
  onMenuSelect
}) => {
  const showMenu = menuItems.length > 0 && currentMode !== 'MAIN';

  return (
    <div className="bg-gray-800 text-green-400 font-mono rounded-sm">
      <div className="p-4 w-[320px] h-[80px] flex flex-col justify-center border-b border-gray-700">
        <div className="text-sm mb-2">{line1}</div>
        <div className="text-sm">{line2}</div>
        <div className="text-xs text-gray-500 mt-1">
          {currentMode} {currentPage > 1 ? `(${currentPage})` : ''}
        </div>
      </div>
      {showMenu && (
        <div className="p-2 max-h-[160px] overflow-y-auto">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`px-2 py-1 cursor-pointer ${
                index === selectedItem ? 'bg-green-900' : 'hover:bg-gray-700'
              }`}
              onClick={() => onMenuSelect?.(index)}
            >
              {index === selectedItem ? '> ' : '  '}{item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
