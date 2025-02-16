export {};

// Define interfaces
interface IAudioBuffer {
  numberOfChannels: number;
  length: number;
  sampleRate: number;
  duration: number;
  channels: Float32Array[];
  getChannelData(channel: number): Float32Array;
  copyToChannel(source: Float32Array, channelNumber: number, startInChannel?: number): void;
  copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel?: number): void;
}

interface IAudioContext {
  createBuffer(numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer;
  decodeAudioData(buffer: ArrayBuffer): Promise<IAudioBuffer>;
  close(): Promise<void>;
}

// Define constructor function types
interface AudioBufferConstructor {
  new (numberOfChannels?: number, length?: number, sampleRate?: number): IAudioBuffer;
  (numberOfChannels?: number, length?: number, sampleRate?: number): IAudioBuffer;
}

interface AudioContextConstructor {
  new (): IAudioContext;
  (): IAudioContext;
}

// Implement AudioBuffer
const AudioBuffer = function(this: IAudioBuffer | void, numberOfChannels = 1, length = 44100, sampleRate = 44100): IAudioBuffer {
  if (!(this instanceof AudioBuffer)) {
    return new (AudioBuffer as any)(numberOfChannels, length, sampleRate);
  }

  const instance = this as IAudioBuffer;
  instance.numberOfChannels = numberOfChannels;
  instance.length = length;
  instance.sampleRate = sampleRate;
  instance.duration = length / sampleRate;
  instance.channels = Array.from({ length: numberOfChannels }, () => new Float32Array(length));

  instance.getChannelData = function(channel: number): Float32Array {
    if (channel < 0 || channel >= this.numberOfChannels) {
      throw new Error('Invalid channel index');
    }
    return this.channels[channel];
  };

  instance.copyToChannel = function(source: Float32Array, channelNumber: number, startInChannel = 0): void {
    if (channelNumber < 0 || channelNumber >= this.numberOfChannels) {
      throw new Error('Invalid channel index');
    }
    const channel = this.channels[channelNumber];
    const copyLength = Math.min(source.length, channel.length - startInChannel);
    channel.set(source.subarray(0, copyLength), startInChannel);
  };

  instance.copyFromChannel = function(destination: Float32Array, channelNumber: number, startInChannel = 0): void {
    if (channelNumber < 0 || channelNumber >= this.numberOfChannels) {
      throw new Error('Invalid channel index');
    }
    const channel = this.channels[channelNumber];
    const copyLength = Math.min(destination.length, channel.length - startInChannel);
    destination.set(channel.subarray(startInChannel, startInChannel + copyLength));
  };

  return instance;
} as unknown as AudioBufferConstructor;

// Implement AudioContext
const MockAudioContext = function(this: IAudioContext | void): IAudioContext {
  if (!(this instanceof MockAudioContext)) {
    return new (MockAudioContext as any)();
  }

  const instance = this as IAudioContext;

  instance.createBuffer = function(numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer {
    return new AudioBuffer(numberOfChannels, length, sampleRate);
  };

  instance.decodeAudioData = function(_buffer: ArrayBuffer): Promise<IAudioBuffer> {
    return Promise.resolve(new AudioBuffer());
  };

  instance.close = function(): Promise<void> {
    return Promise.resolve();
  };

  return instance;
} as unknown as AudioContextConstructor;

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
