import { TimeStretchProcessor } from '../timeStretch';
import { audioEngine } from '../audio';

describe('TimeStretchProcessor Integration Tests', () => {
  let processor: TimeStretchProcessor;
  let audioContext: AudioContext;
  let testBuffer: AudioBuffer;

  beforeEach(async () => {
    processor = new TimeStretchProcessor();
    audioContext = new AudioContext();
    
    // Create a test sine wave
    const sampleRate = 44100;
    const duration = 1; // 1 second
    const frequency = 440; // 440 Hz (A4 note)
    
    testBuffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const channelData = testBuffer.getChannelData(0);
    
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    }
  });

  afterEach(() => {
    audioContext.close();
  });

  it('should preserve pitch while stretching time', async () => {
    const options = {
      quality: 'C' as const,
      ratio: 200, // Double the duration
      algorithmIndex: 0
    };

    const processedBuffer = await processor.processAudio(testBuffer, options);
    
    // Check duration
    expect(processedBuffer.duration).toBeCloseTo(testBuffer.duration * 2, 1);
    
    // Check pitch preservation using autocorrelation
    const originalPitch = getPitch(testBuffer);
    const stretchedPitch = getPitch(processedBuffer);
    
    expect(stretchedPitch).toBeCloseTo(originalPitch, 1);
  });

  it('should maintain audio quality across different algorithms', async () => {
    const ratios = [75, 150];
    const qualities = ['A', 'B', 'C'] as const;
    
    for (const ratio of ratios) {
      for (const quality of qualities) {
        const options = {
          quality,
          ratio,
          algorithmIndex: 0
        };

        const processedBuffer = await processor.processAudio(testBuffer, options);
        
        // Check signal-to-noise ratio
        const snr = calculateSNR(testBuffer, processedBuffer);
        expect(snr).toBeGreaterThan(20); // SNR > 20dB is considered good
      }
    }
  });

  it('should handle extreme time-stretch ratios', async () => {
    const options = {
      quality: 'C' as const,
      ratio: 50, // Maximum compression
      algorithmIndex: 0
    };

    const processedBuffer = await processor.processAudio(testBuffer, options);
    expect(processedBuffer.duration).toBeCloseTo(testBuffer.duration * 0.5, 1);
  });
});

// Helper functions for audio analysis
function getPitch(buffer: AudioBuffer): number {
  const data = buffer.getChannelData(0);
  const correlations = new Float32Array(data.length);
  
  // Autocorrelation
  for (let lag = 0; lag < correlations.length; lag++) {
    let sum = 0;
    for (let i = 0; i < correlations.length - lag; i++) {
      sum += data[i] * data[i + lag];
    }
    correlations[lag] = sum;
  }
  
  // Find first major peak after zero
  let maxCorrelation = 0;
  let maxLag = 0;
  
  for (let lag = 1; lag < correlations.length; lag++) {
    if (correlations[lag] > maxCorrelation) {
      maxCorrelation = correlations[lag];
      maxLag = lag;
    }
  }
  
  return buffer.sampleRate / maxLag;
}

function calculateSNR(original: AudioBuffer, processed: AudioBuffer): number {
  const originalData = original.getChannelData(0);
  const processedData = processed.getChannelData(0);
  
  // Resample if lengths differ
  const length = Math.min(originalData.length, processedData.length);
  const signalPower = originalData.slice(0, length).reduce((sum, x) => sum + x * x, 0);
  
  let noisePower = 0;
  for (let i = 0; i < length; i++) {
    const diff = originalData[i] - processedData[i];
    noisePower += diff * diff;
  }
  
  return 10 * Math.log10(signalPower / noisePower);
}
