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

// Define AudioBuffer constructor
function AudioBuffer(this: IAudioBuffer, numberOfChannels = 1, length = 44100, sampleRate = 44100) {
  if (!(this instanceof AudioBuffer)) {
    return new (AudioBuffer as any)(numberOfChannels, length, sampleRate);
  }

  this.numberOfChannels = numberOfChannels;
  this.length = length;
  this.sampleRate = sampleRate;
  this.duration = length / sampleRate;
  this.channels = Array.from({ length: numberOfChannels }, () => new Float32Array(length));
  return this;
}

AudioBuffer.prototype.getChannelData = function(this: IAudioBuffer, channel: number): Float32Array {
  if (channel < 0 || channel >= this.numberOfChannels) {
    throw new Error('Invalid channel index');
  }
  return this.channels[channel];
};

AudioBuffer.prototype.copyToChannel = function(this: IAudioBuffer, source: Float32Array, channelNumber: number, startInChannel = 0): void {
  if (channelNumber < 0 || channelNumber >= this.numberOfChannels) {
    throw new Error('Invalid channel index');
  }
  const channel = this.channels[channelNumber];
  const copyLength = Math.min(source.length, channel.length - startInChannel);
  channel.set(source.subarray(0, copyLength), startInChannel);
};

AudioBuffer.prototype.copyFromChannel = function(this: IAudioBuffer, destination: Float32Array, channelNumber: number, startInChannel = 0): void {
  if (channelNumber < 0 || channelNumber >= this.numberOfChannels) {
    throw new Error('Invalid channel index');
  }
  const channel = this.channels[channelNumber];
  const copyLength = Math.min(destination.length, channel.length - startInChannel);
  destination.set(channel.subarray(startInChannel, startInChannel + copyLength));
};

// Define interfaces
interface IAudioContext {
  createBuffer(numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer;
  decodeAudioData(buffer: ArrayBuffer): Promise<IAudioBuffer>;
  close(): Promise<void>;
}

// Define AudioContext constructor
function MockAudioContext(this: IAudioContext) {
  if (!(this instanceof MockAudioContext)) {
    return new (MockAudioContext as any)();
  }
  return this;
}

MockAudioContext.prototype.createBuffer = function(this: IAudioContext, numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer {
  return new (AudioBuffer as any)(numberOfChannels, length, sampleRate);
};

MockAudioContext.prototype.decodeAudioData = function(this: IAudioContext, _buffer: ArrayBuffer): Promise<IAudioBuffer> {
  return Promise.resolve(new (AudioBuffer as any)());
};

MockAudioContext.prototype.close = function(this: IAudioContext): Promise<void> {
  return Promise.resolve();
};

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
