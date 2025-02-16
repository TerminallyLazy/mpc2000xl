import { MidiEvent } from '../types';

export interface SwingOptions {
  percentage: number;  // 50-75%
  resolution: number;  // typically 16th notes
}

export class SwingProcessor {
  /**
   * Apply swing to MIDI events
   * @param events Array of MIDI events to process
   * @param options Swing options (percentage and resolution)
   * @returns Processed MIDI events with swing applied
   */
  applySwing(events: MidiEvent[], options: SwingOptions): MidiEvent[] {
    if (options.percentage <= 50 || options.percentage > 75) {
      return events; // No swing applied outside valid range
    }

    const swingAmount = (options.percentage - 50) / 50; // Convert to 0-0.5 range
    const gridSize = 60000 / options.resolution; // Convert resolution to milliseconds

    return events.map(event => {
      // Only process note-on events
      if (event.type !== 'noteOn') return event;

      // Calculate position in the grid
      const gridPosition = Math.floor(event.time / gridSize);
      
      // Apply swing to even-numbered positions
      if (gridPosition % 2 === 1) {
        return {
          ...event,
          time: event.time + (gridSize * swingAmount)
        };
      }

      return event;
    });
  }

  /**
   * Calculate swing delay for a specific event
   * @param time Event time in milliseconds
   * @param options Swing options
   * @returns Adjusted time with swing applied
   */
  calculateSwingDelay(time: number, options: SwingOptions): number {
    if (options.percentage <= 50 || options.percentage > 75) {
      return time;
    }

    const swingAmount = (options.percentage - 50) / 50;
    const gridSize = 60000 / options.resolution;
    const gridPosition = Math.floor(time / gridSize);

    if (gridPosition % 2 === 1) {
      return time + (gridSize * swingAmount);
    }

    return time;
  }
}

export const swingProcessor = new SwingProcessor();
