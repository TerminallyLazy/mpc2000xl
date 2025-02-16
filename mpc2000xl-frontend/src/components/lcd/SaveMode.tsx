import React from 'react';

interface SaveModeProps {
  onSave: (name: string) => void;
}

export const SaveMode: React.FC<SaveModeProps> = ({
  onSave
}) => {
  const [name, setName] = React.useState('');

  return (
    <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
      <div className="mb-2 text-lg">SAVE MODE</div>
      <div className="flex gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-700 text-green-400 border border-green-400 px-2 py-1"
          placeholder="Enter name..."
        />
        <button
          onClick={() => onSave(name)}
          className="px-4 py-1 border border-green-400 hover:bg-green-900"
        >
          Save
        </button>
      </div>
    </div>
  );
};
