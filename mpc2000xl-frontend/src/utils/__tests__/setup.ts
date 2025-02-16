export {};

// Define base AudioBuffer class first
class AudioBuffer {
  length: number;
  sampleRate: number;
  numberOfChannels: number;
  duration: number;

  constructor(options?: { length?: number; numberOfChannels?: number; sampleRate?: number }) {
    this.numberOfChannels = options?.numberOfChannels || 1;
    this.length = options?.length || 44100;
    this.sampleRate = options?.sampleRate || 44100;
    this.duration = this.length / this.sampleRate;
  }

  getChannelData(_channel: number): Float32Array {
    return new Float32Array(this.length);
  }
}

// Then define MockAudioBuffer that extends it
class MockAudioBuffer extends AudioBuffer {
  constructor(numberOfChannels = 1, length = 44100, sampleRate = 44100) {
    super({ numberOfChannels, length, sampleRate });
  }
}

class MockAudioContext {
  createBuffer(numberOfChannels: number, length: number, sampleRate: number) {
    return new MockAudioBuffer(numberOfChannels, length, sampleRate);
  }

  decodeAudioData(_buffer: ArrayBuffer) {
    return Promise.resolve(new MockAudioBuffer());
  }

  close() {
    // Mock implementation
    return Promise.resolve();
  }
}

// Make it a module with side effects
(global as any).AudioBuffer = AudioBuffer;
(global as any).AudioContext = MockAudioContext;
(global as any).window = {
  AudioBuffer,
  AudioContext: MockAudioContext,
  crypto: {
    randomUUID: () => '00000000-0000-0000-0000-000000000000'
  }
};
