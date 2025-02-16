import { SwingProcessor, SwingOptions } from '../swing';
import { MidiEvent } from '../../types';

describe('SwingProcessor', () => {
  let processor: SwingProcessor;
  let events: MidiEvent[];

  beforeEach(() => {
    processor = new SwingProcessor();
    events = [
      { type: 'noteOn', note: 60, velocity: 100, time: 0 },
      { type: 'noteOn', note: 61, velocity: 100, time: 250 },
      { type: 'noteOn', note: 62, velocity: 100, time: 500 },
      { type: 'noteOn', note: 63, velocity: 100, time: 750 }
    ];
  });

  it('should not modify events when swing percentage is 50', () => {
    const options: SwingOptions = {
      percentage: 50,
      resolution: 16
    };

    const result = processor.applySwing(events, options);
    expect(result).toEqual(events);
  });

  it('should apply maximum swing at 75%', () => {
    const options: SwingOptions = {
      percentage: 75,
      resolution: 16
    };

    const result = processor.applySwing(events, options);
    
    // Even-numbered positions should be delayed
    expect(result[1].time).toBeGreaterThan(events[1].time);
    expect(result[3].time).toBeGreaterThan(events[3].time);
    
    // Odd-numbered positions should remain unchanged
    expect(result[0].time).toBe(events[0].time);
    expect(result[2].time).toBe(events[2].time);
  });

  it('should handle non-note events', () => {
    const mixedEvents: MidiEvent[] = [
      { type: 'noteOn', note: 60, velocity: 100, time: 0 },
      { type: 'controlChange', controller: 1, value: 64, time: 250 },
      { type: 'noteOn', note: 62, velocity: 100, time: 500 }
    ];

    const options: SwingOptions = {
      percentage: 65,
      resolution: 16
    };

    const result = processor.applySwing(mixedEvents, options);
    
    // Control change event should remain unchanged
    expect(result[1]).toEqual(mixedEvents[1]);
  });

  it('should calculate correct swing delay', () => {
    const options: SwingOptions = {
      percentage: 65,
      resolution: 16
    };

    const time = 250; // Even-numbered position
    const delay = processor.calculateSwingDelay(time, options);
    
    expect(delay).toBeGreaterThan(time);
  });
});
