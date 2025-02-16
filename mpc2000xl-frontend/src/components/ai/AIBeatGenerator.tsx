import React, { useState, useCallback } from 'react';
import { Pattern } from '../../types';
import { soundBankManager } from '../../utils/soundBank';

interface AIBeatGeneratorProps {
  onPatternGenerated: (pattern: Pattern) => void;
}

export const AIBeatGenerator: React.FC<AIBeatGeneratorProps> = ({
  onPatternGenerated
}) => {
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [selectedBank, setSelectedBank] = useState('tr-808');
  const [tempo, setTempo] = useState(120);
  const [style, setStyle] = useState('hip-hop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBeat = useCallback(async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Load soundbank if not already loaded
      if (!soundBankManager.getLoadedSamples().length) {
        await soundBankManager.loadBank(selectedBank);
      }

      const response = await fetch('/api/ai/generate-beat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          soundbank: selectedBank,
          tempo,
          style
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate beat');
      }

      const data = await response.json();
      onPatternGenerated(data.pattern);
    } catch (error) {
      console.error('Error generating beat:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate beat');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedModel, selectedBank, tempo, style, onPatternGenerated]);

  return (
    <div className="p-4 border border-primary/20 rounded-lg bg-control-bg/90 backdrop-blur-md">
      <h3 className="text-lg font-bold mb-4 text-control-text">AI Beat Generator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-control-text mb-1">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 bg-control-bg rounded border border-primary/40"
            data-testid="model-select"
          >
            <option value="gpt-4">GPT-4 (Best Quality)</option>
            <option value="gpt-3.5-turbo">GPT-3.5 (Faster)</option>
            <option value="claude-2">Claude 2</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-control-text mb-1">Soundbank</label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full p-2 bg-control-bg rounded border border-primary/40"
            data-testid="soundbank-select"
          >
            <option value="tr-808">TR-808</option>
            <option value="tr-909">TR-909</option>
            <option value="mpc-2000xl">MPC2000XL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-control-text mb-1">Tempo (BPM)</label>
          <input
            type="number"
            value={tempo}
            onChange={(e) => setTempo(Math.max(60, Math.min(200, parseInt(e.target.value) || 120)))}
            className="w-full p-2 bg-control-bg rounded border border-primary/40"
            min="60"
            max="200"
            data-testid="tempo-input"
          />
        </div>

        <div>
          <label className="block text-sm text-control-text mb-1">Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-2 bg-control-bg rounded border border-primary/40"
            data-testid="style-select"
          >
            <option value="hip-hop">Hip Hop</option>
            <option value="house">House</option>
            <option value="techno">Techno</option>
            <option value="trap">Trap</option>
            <option value="drum-n-bass">Drum &amp; Bass</option>
          </select>
        </div>

        <button
          onClick={generateBeat}
          disabled={isGenerating}
          className={`w-full py-3 rounded font-bold transition-all ${
            isGenerating
              ? 'bg-primary/40 cursor-wait'
              : 'bg-primary/20 hover:bg-primary/30'
          }`}
          data-testid="generate-button"
        >
          {isGenerating ? 'Generating...' : 'Generate Beat'}
        </button>

        {error && (
          <div className="mt-4 text-red-400">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};
