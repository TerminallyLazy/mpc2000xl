import { Sample } from '../types';
import type { SoundBank, SoundBankSample } from '../types';
import { audioEngine } from './audio';

export class SoundBankLoader {
  private readonly MAX_MEMORY_MB = 16;
  private loadedBanks: Map<string, SoundBank> = new Map();
  private currentMemoryUsage = 0;

  async loadBank(bankId: string, onProgress?: (loaded: number, total: number) => void): Promise<void> {
    const bank = await this.fetchBankMetadata(bankId);
    if (!bank) throw new Error(`Bank ${bankId} not found`);

    const sampleEntries = Object.entries(bank.samples);
    let loadedCount = 0;

    for (const [sampleId, sample] of sampleEntries as [string, SoundBankSample][]) {
      try {
        const response = await fetch(sample.path);
        const arrayBuffer = await response.arrayBuffer();

        // Check memory limit
        if (this.currentMemoryUsage + arrayBuffer.byteLength > this.MAX_MEMORY_MB * 1024 * 1024) {
          throw new Error(`Memory limit of ${this.MAX_MEMORY_MB}MB exceeded`);
        }

        // Create Sample object
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const newSample: Sample = {
          id: `${bankId}-${sampleId}`,
          name: sample.name,
          file_type: 'wav',
          data: arrayBuffer,
          start_point: 0,
          end_point: audioBuffer.length,
          tune: 0,
          volume: 100
        };

        await audioEngine.loadSample(newSample.id, arrayBuffer);
        this.currentMemoryUsage += arrayBuffer.byteLength;

        loadedCount++;
        onProgress?.(loadedCount, sampleEntries.length);
      } catch (error) {
        console.error(`Failed to load sample ${sampleId} from bank ${bankId}:`, error);
        throw error;
      }
    }

    this.loadedBanks.set(bankId, bank);
  }

  private async fetchBankMetadata(bankId: string): Promise<SoundBank | null> {
    try {
      const response = await fetch(`/api/banks/${bankId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching bank metadata:', error);
      return null;
    }
  }

  unloadBank(bankId: string): void {
    const bank = this.loadedBanks.get(bankId);
    if (!bank) return;

    // Remove all samples associated with this bank
    Object.keys(bank.samples).forEach(sampleId => {
      const fullId = `${bankId}-${sampleId}`;
      audioEngine.disposeSample(fullId);
    });

    this.loadedBanks.delete(bankId);
  }

  getLoadedBanks(): string[] {
    return Array.from(this.loadedBanks.keys());
  }

  getCurrentMemoryUsage(): number {
    return this.currentMemoryUsage;
  }
}

export const soundBankLoader = new SoundBankLoader();
