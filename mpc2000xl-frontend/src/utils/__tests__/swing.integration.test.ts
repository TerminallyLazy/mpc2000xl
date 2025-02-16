import { swingProcessor } from '../swing';
import { MidiEvent } from '../../types';

describe('Swing Pattern Integration Tests', () => {
  const createTestPattern = (length: number): MidiEvent[] => {
    return Array.from({ length }, (_, i) => ({
      type: 'noteOn',
      note: 60,
      velocity: 100,
      time: i * 250 // 16th notes at 120 BPM
    }));
  };

  it('should apply swing to even-numbered positions', () => {
    const events = createTestPattern(4);
    const swingOptions = {
      percentage: 65,
      resolution: 16
    };

    const processed = swingProcessor.applySwing(events, swingOptions);

    // Check that odd-numbered positions are delayed
    expect(processed[1].time).toBeGreaterThan(events[1].time);
    expect(processed[3].time).toBeGreaterThan(events[3].time);
    
    // Check that even-numbered positions remain unchanged
    expect(processed[0].time).toBe(events[0].time);
    expect(processed[2].time).toBe(events[2].time);
  });

  it('should scale swing amount based on percentage', () => {
    const events = createTestPattern(2);
    
    const swing50 = swingProcessor.applySwing(events, {
      percentage: 50,
      resolution: 16
    });
    
    const swing75 = swingProcessor.applySwing(events, {
      percentage: 75,
      resolution: 16
    });

    // No swing at 50%
    expect(swing50[1].time).toBe(events[1].time);
    
    // Maximum swing at 75%
    expect(swing75[1].time).toBeGreaterThan(events[1].time);
  });

  it('should maintain relative timing between swung events', () => {
    const events = createTestPattern(8);
    const swingOptions = {
      percentage: 65,
      resolution: 16
    };

    const processed = swingProcessor.applySwing(events, swingOptions);
    
    // Check consistent swing amount
    const swing1 = processed[1].time - events[1].time;
    const swing3 = processed[3].time - events[3].time;
    const swing5 = processed[5].time - events[5].time;
    const swing7 = processed[7].time - events[7].time;
    
    expect(swing1).toBeCloseTo(swing3);
    expect(swing3).toBeCloseTo(swing5);
    expect(swing5).toBeCloseTo(swing7);
  });

  it('should handle different resolutions', () => {
    const events = createTestPattern(4);
    
    const swing16 = swingProcessor.applySwing(events, {
      percentage: 65,
      resolution: 16
    });
    
    const swing8 = swingProcessor.applySwing(events, {
      percentage: 65,
      resolution: 8
    });

    // 8th note resolution should affect fewer events
    expect(swing16[1].time).not.toBe(events[1].time);
    expect(swing8[1].time).toBe(events[1].time);
  });
});
