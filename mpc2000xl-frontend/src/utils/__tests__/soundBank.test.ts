import { soundBankManager, SoundBankManager } from '../soundBank';

// Mock AudioContext and fetch
const mockAudioContext = {
  decodeAudioData: jest.fn()
};

global.AudioContext = jest.fn().mockImplementation(() => mockAudioContext);
global.fetch = jest.fn();

describe('SoundBankManager', () => {
  beforeEach(() => {
    // Reset the singleton instance for each test
    Object.assign(soundBankManager, new SoundBankManager());
    jest.clearAllMocks();
  });

  it('should initialize with default banks', () => {
    const banks = soundBankManager.getAvailableBanks();
    expect(banks).toHaveLength(3);
    expect(banks.map(b => b.name)).toContain('TR-808');
    expect(banks.map(b => b.name)).toContain('TR-909');
    expect(banks.map(b => b.name)).toContain('MPC2000XL');
  });

  it('should load bank samples within memory limit', async () => {
    const mockArrayBuffer = new ArrayBuffer(1024 * 1024); // 1MB
    const mockAudioBuffer = { length: 44100 };

    (global.fetch as jest.Mock).mockResolvedValue({
      arrayBuffer: () => Promise.resolve(mockArrayBuffer)
    });

    mockAudioContext.decodeAudioData.mockResolvedValue(mockAudioBuffer);

    await soundBankManager.loadBank('tr-808', { maxMemoryMB: 2 });
    expect(soundBankManager.getCurrentMemoryUsage()).toBeLessThanOrEqual(2 * 1024 * 1024);
  });

  it('should throw error when exceeding memory limit', async () => {
    const mockArrayBuffer = new ArrayBuffer(20 * 1024 * 1024); // 20MB

    (global.fetch as jest.Mock).mockResolvedValue({
      arrayBuffer: () => Promise.resolve(mockArrayBuffer)
    });

    await expect(soundBankManager.loadBank('tr-808', { maxMemoryMB: 16 }))
      .rejects
      .toThrow('Memory limit of 16MB exceeded');
  });

  it('should track loading progress', async () => {
    const mockArrayBuffer = new ArrayBuffer(1024);
    const mockAudioBuffer = { length: 44100 };
    const onProgress = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValue({
      arrayBuffer: () => Promise.resolve(mockArrayBuffer)
    });

    mockAudioContext.decodeAudioData.mockResolvedValue(mockAudioBuffer);

    await soundBankManager.loadBank('tr-808', { onProgress });
    expect(onProgress).toHaveBeenCalled();
  });

  it('should unload bank samples and free memory', async () => {
    const mockArrayBuffer = new ArrayBuffer(1024);
    const mockAudioBuffer = { length: 44100 };

    (global.fetch as jest.Mock).mockResolvedValue({
      arrayBuffer: () => Promise.resolve(mockArrayBuffer)
    });

    mockAudioContext.decodeAudioData.mockResolvedValue(mockAudioBuffer);

    await soundBankManager.loadBank('tr-808');
    const initialMemory = soundBankManager.getCurrentMemoryUsage();
    
    soundBankManager.unloadBank('tr-808');
    expect(soundBankManager.getCurrentMemoryUsage()).toBeLessThan(initialMemory);
  });

  it('should retrieve loaded samples', async () => {
    const mockArrayBuffer = new ArrayBuffer(1024);
    const mockAudioBuffer = { length: 44100 };

    (global.fetch as jest.Mock).mockResolvedValue({
      arrayBuffer: () => Promise.resolve(mockArrayBuffer)
    });

    mockAudioContext.decodeAudioData.mockResolvedValue(mockAudioBuffer);

    await soundBankManager.loadBank('tr-808');
    const samples = soundBankManager.getLoadedSamples();
    expect(samples.length).toBeGreaterThan(0);
    expect(samples[0]).toHaveProperty('id');
    expect(samples[0]).toHaveProperty('name');
  });
});
