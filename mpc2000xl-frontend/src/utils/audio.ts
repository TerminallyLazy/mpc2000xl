import * as Tone from 'tone';

interface PlayOptions {
  tune?: number;    // -12 to +12 semitones
  volume?: number;  // 0 to 100
}

class AudioEngine {
  private players: Map<string, Tone.Player> = new Map();
  private recorder: Tone.Recorder | null = null;
  
  async loadSample(id: string, audioBuffer: ArrayBuffer) {
    try {
      await Tone.start();
      
      // Dispose of existing player if it exists
      if (this.players.has(id)) {
        this.players.get(id)?.dispose();
        this.players.delete(id);
      }
      
      // Create new player
      const player = new Tone.Player({
        url: URL.createObjectURL(new Blob([audioBuffer])),
        onload: () => console.log(`Sample ${id} loaded`)
      }).toDestination();
      
      this.players.set(id, player);
    } catch (error) {
      console.error('Error loading sample:', error);
    }
  }

  async playSample(id: string, options?: PlayOptions) {
    const player = this.players.get(id);
    if (!player) return;

    try {
      // Apply tuning if specified (-12 to +12 semitones)
      if (options?.tune !== undefined) {
        const semitoneRatio = Math.pow(2, options.tune / 12);
        player.playbackRate = semitoneRatio;
      }

      // Apply volume if specified (0 to 100)
      if (options?.volume !== undefined) {
        // Convert 0-100 range to decibels (-Infinity to 0)
        const db = options.volume === 0 ? -Infinity : 20 * Math.log10(options.volume / 100);
        player.volume.value = db;
      }

      await player.start();
    } catch (error) {
      console.error(`Error playing sample ${id}:`, error);
    }
  }

  disposeSample(id: string) {
    const player = this.players.get(id);
    if (player) {
      player.dispose();
      this.players.delete(id);
    }
  }

  getSample(id: string) {
    const player = this.players.get(id);
    if (!player) return null;
    return {
      sampleRate: player.context.sampleRate,
      numberOfChannels: 1, // Tone.js players are mono by default
      duration: player.buffer.duration
    };
  }

  disposeAll() {
    for (const [_, player] of this.players) {
      player.dispose();
    }
    this.players.clear();
  }

  async startTransport(): Promise<void> {
    await Tone.start();
    Tone.Transport.start();
  }

  stopTransport(): void {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
  }

  startRecording(): void {
    if (!this.recorder) {
      this.recorder = new Tone.Recorder();
      Tone.Destination.connect(this.recorder);
    }
    this.recorder.start();
  }

  async stopRecording(): Promise<Blob> {
    if (!this.recorder) return new Blob();
    const recording = await this.recorder.stop();
    return recording;
  }
}

export const audioEngine = new AudioEngine();
