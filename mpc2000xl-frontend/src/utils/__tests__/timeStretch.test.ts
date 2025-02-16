import { TimeStretchProcessor, TimeStretchOptions } from '../timeStretch';
import { AudioContext, AudioBuffer } from 'standardized-audio-context';

// Mock AudioContext and AudioBuffer
jest.mock('standardized-audio-context', () => ({
  AudioContext: jest.fn().mockImplementation(() => ({
    createBuffer: jest.fn().mockImplementation((channels: number, length: number, sampleRate: number): AudioBuffer => ({
      length,
      duration: length / sampleRate,
      numberOfChannels: channels,
      sampleRate,
      getChannelData: jest.fn().mockReturnValue(new Float32Array(length)),
      copyFromChannel: jest.fn(),
      copyToChannel: jest.fn()
    })),
    close: jest.fn()
  })),
  AudioBuffer: jest.fn()
}));

describe('TimeStretchProcessor', () => {
  let processor: TimeStretchProcessor;
  let audioContext: AudioContext;

  beforeEach(() => {
    processor = new TimeStretchProcessor();
    audioContext = new AudioContext();
  });

  afterEach(() => {
    audioContext.close();
  });

  it('should initialize with algorithms', () => {
    const algorithms = processor.getAlgorithms();
    expect(algorithms.length).toBeGreaterThan(0);
    expect(algorithms[0]).toHaveProperty('name');
    expect(algorithms[0]).toHaveProperty('quality');
    expect(algorithms[0]).toHaveProperty('index');
  });

  it('should validate time stretch ratio', async () => {
    const buffer = audioContext.createBuffer(1, 1024, 44100);
    const options: TimeStretchOptions = {
      quality: 'A',
      ratio: 30, // Invalid ratio
      algorithmIndex: 0
    };

    await expect(processor.processAudio(buffer, options)).rejects.toThrow(
      'Time stretch ratio must be between 50% and 200%'
    );
  });

  it('should validate algorithm index', async () => {
    const buffer = audioContext.createBuffer(1, 1024, 44100);
    const options: TimeStretchOptions = {
      quality: 'A',
      ratio: 75,
      algorithmIndex: 999 // Invalid index
    };

    await expect(processor.processAudio(buffer, options)).rejects.toThrow(
      'Invalid algorithm index'
    );
  });

  it('should process audio with valid parameters', async () => {
    const buffer = audioContext.createBuffer(1, 1024, 44100);
    const options: TimeStretchOptions = {
      quality: 'A',
      ratio: 75,
      algorithmIndex: 0
    };

    const result = await processor.processAudio(buffer, options);
    expect(result).toBeInstanceOf(AudioBuffer);
    expect(result.length).toBe(Math.floor(buffer.length * (100 / options.ratio)));
  });
});
