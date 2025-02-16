import React, { useState, useCallback } from 'react';
import { Sample } from '../../types';
import { soundBankManager } from '../../utils/soundBank';
import { defaultBanks } from '../../utils/defaultBanks';

interface LoadModeProps {
  onSampleSelect: (sampleId: string) => void;
  samples: Sample[];
}

export const LoadMode: React.FC<LoadModeProps> = ({
  onSampleSelect,
  samples
}) => {
  const [selectedBank, setSelectedBank] = useState('tr-808');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const handleLoadBank = useCallback(async (bankId: string) => {
    try {
      setLoading(true);
      setError(null);
      await soundBankManager.loadBank(bankId, {
        onProgress: (loaded, total) => {
          console.log(`Loading ${loaded}/${total} samples...`);
        }
      });
      setMemoryUsage(soundBankManager.getCurrentMemoryUsage());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bank');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="bg-gray-800 text-green-400 font-mono p-4 w-full">
      <div className="mb-2 text-lg">LOAD MODE</div>
      
      <div className="mb-4">
        <label className="block mb-2">Select Soundbank:</label>
        <select
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded border border-gray-600"
          data-testid="bank-select"
        >
          {Object.entries(defaultBanks).map(([id, bank]) => (
            <option key={id} value={id}>
              {bank.name} - {bank.description}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => handleLoadBank(selectedBank)}
        disabled={loading}
        className="px-4 py-2 bg-green-700 rounded hover:bg-green-600 disabled:opacity-50"
        data-testid="load-bank"
      >
        {loading ? 'Loading...' : 'Load Bank'}
      </button>

      {error && (
        <div className="mt-4 text-red-400">
          Error: {error}
        </div>
      )}

      <div className="mt-4">
        Memory Usage: {(memoryUsage / (1024 * 1024)).toFixed(2)}MB / 16MB
      </div>

      <div className="mt-4 grid gap-2">
        {samples.map(sample => (
          <div
            key={sample.id}
            className="cursor-pointer hover:text-green-300"
            onClick={() => onSampleSelect(sample.id)}
          >
            {sample.name}
          </div>
        ))}
      </div>
    </div>
  );
};
