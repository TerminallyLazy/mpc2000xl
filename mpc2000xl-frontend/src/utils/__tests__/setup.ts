export {};

// Define base AudioBuffer class first
class AudioBuffer {
  length: number;
  sampleRate: number;
  numberOfChannels: number;
  duration: number;
  private channels: Float32Array[];

  constructor(numberOfChannels = 1, length = 44100, sampleRate = 44100) {
    this.numberOfChannels = numberOfChannels;
    this.length = length;
    this.sampleRate = sampleRate;
    this.duration = this.length / this.sampleRate;
    this.channels = Array.from({ length: this.numberOfChannels }, () => new Float32Array(this.length));
  }

  getChannelData(channel: number): Float32Array {
    if (channel < 0 || channel >= this.numberOfChannels) {
      throw new Error('Invalid channel index');
    }
    return this.channels[channel];
  }

  copyToChannel(source: Float32Array, channelNumber: number, startInChannel = 0): void {
    if (channelNumber < 0 || channelNumber >= this.numberOfChannels) {
      throw new Error('Invalid channel index');
    }
    const channel = this.channels[channelNumber];
    const length = Math.min(source.length, channel.length - startInChannel);
    channel.set(source.subarray(0, length), startInChannel);
  }

  copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel = 0): void {
    if (channelNumber < 0 || channelNumber >= this.numberOfChannels) {
      throw new Error('Invalid channel index');
    }
    const channel = this.channels[channelNumber];
    const length = Math.min(destination.length, channel.length - startInChannel);
    destination.set(channel.subarray(startInChannel, startInChannel + length));
  }
}

class MockAudioContext {
  createBuffer(numberOfChannels: number, length: number, sampleRate: number) {
    return new AudioBuffer(numberOfChannels, length, sampleRate);
  }

  decodeAudioData(_buffer: ArrayBuffer) {
    return Promise.resolve(new AudioBuffer());
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
