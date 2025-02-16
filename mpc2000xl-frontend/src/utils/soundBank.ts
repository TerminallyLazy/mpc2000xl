import { Sample } from '../types';

export interface SoundBankSample {
  path: string;
  type: 'wav';
  category: string;
  name: string;
}

export interface SoundBank {
  id: string;
  name: string;
  description?: string;
  samples: Record<string, SoundBankSample>;
}

export interface SoundBankLoadOptions {
  onProgress?: (loaded: number, total: number) => void;
  maxMemoryMB?: number; // Default: 16MB
}

export class SoundBankManager {
  private banks: Map<string, SoundBank> = new Map();
  private loadedSamples: Map<string, Sample> = new Map();
  private readonly MAX_MEMORY_MB = 16;
  private currentMemoryUsage = 0;

  constructor() {
    // Initialize with default banks
    this.initializeDefaultBanks();
  }

  private initializeDefaultBanks() {
    const tr808: SoundBank = {
      id: 'tr-808',
      name: 'TR-808',
      description: 'Classic Roland TR-808 drum machine samples',
      samples: {
        'kick': {
          name: 'Kick',
          path: '/samples/808/kick.wav',
          type: 'wav',
          category: 'drums'
        },
        'snare': {
          name: 'Snare',
          path: '/samples/808/snare.wav',
          type: 'wav',
          category: 'drums'
        },
        'hihat-closed': {
          name: 'Closed Hi-Hat',
          path: '/samples/808/hihat-closed.wav',
          type: 'wav',
          category: 'drums'
        },
        'hihat-open': {
          name: 'Open Hi-Hat',
          path: '/samples/808/hihat-open.wav',
          type: 'wav',
          category: 'drums'
        }
      }
    };

    const tr909: SoundBank = {
      id: 'tr-909',
      name: 'TR-909',
      description: 'Classic Roland TR-909 drum machine samples',
      samples: {
        'kick': {
          name: 'Kick',
          path: '/samples/909/kick.wav',
          type: 'wav',
          category: 'drums'
        },
        'snare': {
          name: 'Snare',
          path: '/samples/909/snare.wav',
          type: 'wav',
          category: 'drums'
        },
        'hihat-closed': {
          name: 'Closed Hi-Hat',
          path: '/samples/909/hihat-closed.wav',
          type: 'wav',
          category: 'drums'
        },
        'hihat-open': {
          name: 'Open Hi-Hat',
          path: '/samples/909/hihat-open.wav',
          type: 'wav',
          category: 'drums'
        }
      }
    };

    const mpc2000xl: SoundBank = {
      id: 'mpc-2000xl',
      name: 'MPC2000XL',
      description: 'Original MPC2000XL factory sound bank',
      samples: {
        'kick-1': {
          name: 'Kick 1',
          path: '/samples/mpc2000xl/kick-1.wav',
          type: 'wav',
          category: 'drums'
        },
        'kick-2': {
          name: 'Kick 2',
          path: '/samples/mpc2000xl/kick-2.wav',
          type: 'wav',
          category: 'drums'
        },
        'snare-1': {
          name: 'Snare 1',
          path: '/samples/mpc2000xl/snare-1.wav',
          type: 'wav',
          category: 'drums'
        },
        'snare-2': {
          name: 'Snare 2',
          path: '/samples/mpc2000xl/snare-2.wav',
          type: 'wav',
          category: 'drums'
        }
      }
    };

    this.banks.set(tr808.id, tr808);
    this.banks.set(tr909.id, tr909);
    this.banks.set(mpc2000xl.id, mpc2000xl);
  }

  async loadBank(bankId: string, options: SoundBankLoadOptions = {}): Promise<void> {
    const bank = this.banks.get(bankId);
    if (!bank) throw new Error(`Bank ${bankId} not found`);

    const maxMemoryMB = options.maxMemoryMB || this.MAX_MEMORY_MB;
    const maxMemoryBytes = maxMemoryMB * 1024 * 1024;

    const sampleEntries = Object.entries(bank.samples);
    let loadedCount = 0;

    for (const [sampleId, sample] of sampleEntries) {
      try {
        const response = await fetch(sample.path);
        const arrayBuffer = await response.arrayBuffer();

        // Check memory limit
        if (this.currentMemoryUsage + arrayBuffer.byteLength > maxMemoryBytes) {
          throw new Error(`Memory limit of ${maxMemoryMB}MB exceeded`);
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

        this.loadedSamples.set(newSample.id, newSample);
        this.currentMemoryUsage += arrayBuffer.byteLength;

        loadedCount++;
        options.onProgress?.(loadedCount, sampleEntries.length);
      } catch (error) {
        console.error(`Failed to load sample ${sampleId} from bank ${bankId}:`, error);
        throw error;
      }
    }
  }

  unloadBank(bankId: string): void {
    const bank = this.banks.get(bankId);
    if (!bank) return;

    // Remove all samples associated with this bank
    for (const [sampleId, sample] of this.loadedSamples.entries()) {
      if (sampleId.startsWith(`${bankId}-`)) {
        this.currentMemoryUsage -= (sample.data as ArrayBuffer).byteLength;
        this.loadedSamples.delete(sampleId);
      }
    }
  }

  getSample(bankId: string, sampleId: string): Sample | undefined {
    return this.loadedSamples.get(`${bankId}-${sampleId}`);
  }

  getLoadedSamples(): Sample[] {
    return Array.from(this.loadedSamples.values());
  }

  getAvailableBanks(): SoundBank[] {
    return Array.from(this.banks.values());
  }

  getCurrentMemoryUsage(): number {
    return this.currentMemoryUsage;
  }
}

export const soundBankManager = new SoundBankManager();
