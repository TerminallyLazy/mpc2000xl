import React from 'react';

interface MenuProps {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const Menu: React.FC<MenuProps> = ({ items, selectedIndex, onSelect }) => {
  return (
    <div className="bg-gray-800 text-green-400 font-mono p-2 rounded-sm">
      {items.map((item, index) => (
        <div
          key={index}
          className={`px-2 py-1 cursor-pointer ${
            index === selectedIndex ? 'bg-green-900' : 'hover:bg-gray-700'
          }`}
          onClick={() => onSelect(index)}
        >
          {index === selectedIndex ? '> ' : '  '}{item}
        </div>
      ))}
    </div>
  );
};
