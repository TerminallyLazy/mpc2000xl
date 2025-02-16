import React, { useState, useCallback } from 'react';
import { soundBankLoader } from '../utils/soundBankLoader';
import { defaultBanks } from '../utils/defaultBanks';

export const SoundBankSelector: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentBank, setCurrentBank] = useState('');
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleBankSelect = useCallback(async (bankId: string) => {
    setLoading(true);
    setError(null);
    try {
      await soundBankLoader.loadBank(bankId, {
        onProgress: (loaded, total) => {
          console.log(`Loading ${loaded}/${total} samples...`);
        }
      });
      setCurrentBank(bankId);
      setMemoryUsage(soundBankLoader.getCurrentMemoryUsage());
    } catch (error) {
      console.error('Failed to load bank:', error);
      setError(error instanceof Error ? error.message : 'Failed to load sound bank');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUnloadBank = useCallback((bankId: string) => {
    try {
      soundBankLoader.unloadBank(bankId);
      if (currentBank === bankId) {
        setCurrentBank('');
      }
      setMemoryUsage(soundBankLoader.getCurrentMemoryUsage());
    } catch (error) {
      console.error('Failed to unload bank:', error);
      setError(error instanceof Error ? error.message : 'Failed to unload sound bank');
    }
  }, [currentBank]);

  return (
    <div className="p-4 bg-control-bg/90 rounded-lg border border-primary/40">
      <h3 className="text-lg font-bold mb-4 text-control-text">Sound Banks</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(defaultBanks).map(([id, bank]) => (
          <div key={id} className="flex flex-col gap-2">
            <button
              onClick={() => handleBankSelect(id)}
              disabled={loading}
              className={`p-3 rounded font-bold transition-all ${
                currentBank === id 
                  ? 'bg-primary/90 text-control-text shadow-inner' 
                  : 'bg-control-bg/80 text-control-text hover:bg-primary/70'
              }`}
            >
              {bank.name}
              {loading && currentBank === id && (
                <span className="ml-2 animate-pulse">Loading...</span>
              )}
            </button>
            {currentBank === id && (
              <button
                onClick={() => handleUnloadBank(id)}
                className="px-2 py-1 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Unload
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-control-text">
        <div>
          Memory: {(memoryUsage / (1024 * 1024)).toFixed(1)}MB / 16MB
        </div>
        {error && (
          <div className="text-red-400">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};
