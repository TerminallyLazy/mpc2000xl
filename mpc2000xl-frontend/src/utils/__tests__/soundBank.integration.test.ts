import { soundBankLoader } from '../soundBankLoader';
import { audioEngine } from '../audio';

describe('SoundBank Integration Tests', () => {
  beforeEach(() => {
    // Reset the loader state
    Object.assign(soundBankLoader, new (soundBankLoader.constructor as any)());
  });

  afterEach(() => {
    // Clean up loaded samples
    soundBankLoader.getLoadedBanks().forEach(bankId => {
      soundBankLoader.unloadBank(bankId);
    });
  });

  it('should load TR-808 bank successfully', async () => {
    const onProgress = jest.fn();
    await soundBankLoader.loadBank('tr-808', { onProgress: onProgress });

    expect(onProgress).toHaveBeenCalled();
    expect(soundBankLoader.getLoadedBanks()).toContain('tr-808');
  });

  it('should respect memory limits', async () => {
    // Try to load multiple banks to exceed memory limit
    await soundBankLoader.loadBank('tr-808');
    await soundBankLoader.loadBank('tr-909');
    await soundBankLoader.loadBank('mpc-2000xl');

    const totalMemoryUsage = soundBankLoader.getCurrentMemoryUsage();
    expect(totalMemoryUsage).toBeLessThanOrEqual(16 * 1024 * 1024); // 16MB limit
  });

  it('should properly unload banks and free memory', async () => {
    await soundBankLoader.loadBank('tr-808');
    const initialMemory = soundBankLoader.getCurrentMemoryUsage();
    
    soundBankLoader.unloadBank('tr-808');
    const finalMemory = soundBankLoader.getCurrentMemoryUsage();
    
    expect(finalMemory).toBeLessThan(initialMemory);
    expect(soundBankLoader.getLoadedBanks()).not.toContain('tr-808');
  });

  it('should load samples with correct audio parameters', async () => {
    await soundBankLoader.loadBank('tr-808');
    
    // Test a specific sample
    const kick = await audioEngine.getSample('tr-808-kick');
    expect(kick).toBeDefined();
    expect(kick?.sampleRate).toBe(44100);
    expect(kick?.numberOfChannels).toBeGreaterThanOrEqual(1);
  });
});
