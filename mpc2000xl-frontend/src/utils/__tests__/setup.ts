export {};

// Define AudioBuffer constructor
function AudioBuffer(this: any, numberOfChannels = 1, length = 44100, sampleRate = 44100) {
  if (!(this instanceof AudioBuffer)) {
    return new (AudioBuffer as any)(numberOfChannels, length, sampleRate);
  }

  Object.defineProperties(this, {
    numberOfChannels: { value: numberOfChannels, writable: false },
    length: { value: length, writable: false },
    sampleRate: { value: sampleRate, writable: false },
    duration: { value: length / sampleRate, writable: false },
    channels: { 
      value: Array.from({ length: numberOfChannels }, () => new Float32Array(length)),
      writable: false 
    }
  });

  return this;
}

AudioBuffer.prototype.getChannelData = function(channel: number): Float32Array {
  if (channel < 0 || channel >= this.numberOfChannels) {
    throw new Error('Invalid channel index');
  }
  return this.channels[channel];
};

AudioBuffer.prototype.copyToChannel = function(source: Float32Array, channelNumber: number, startInChannel = 0): void {
  if (channelNumber < 0 || channelNumber >= this.numberOfChannels) {
    throw new Error('Invalid channel index');
  }
  const channel = this.channels[channelNumber];
  const copyLength = Math.min(source.length, channel.length - startInChannel);
  channel.set(source.subarray(0, copyLength), startInChannel);
};

AudioBuffer.prototype.copyFromChannel = function(destination: Float32Array, channelNumber: number, startInChannel = 0): void {
  if (channelNumber < 0 || channelNumber >= this.numberOfChannels) {
    throw new Error('Invalid channel index');
  }
  const channel = this.channels[channelNumber];
  const copyLength = Math.min(destination.length, channel.length - startInChannel);
  destination.set(channel.subarray(startInChannel, startInChannel + copyLength));
};

// Define AudioContext constructor
function MockAudioContext(this: any) {
  if (!(this instanceof MockAudioContext)) {
    return new (MockAudioContext as any)();
  }
}

MockAudioContext.prototype.createBuffer = function(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer {
  return new (AudioBuffer as any)(numberOfChannels, length, sampleRate);
};

MockAudioContext.prototype.decodeAudioData = function(_buffer: ArrayBuffer): Promise<AudioBuffer> {
  return Promise.resolve(new (AudioBuffer as any)());
};

MockAudioContext.prototype.close = function(): Promise<void> {
  return Promise.resolve();
};

// Make it a module with side effects
(global as any).AudioBuffer = AudioBuffer;
(global as any).AudioContext = MockAudioContext;
(global as any).window = {
  AudioBuffer,
  AudioContext: MockAudioContext,
  crypto: {
    randomUUID: () => Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
};
