export interface Sample {
  id: string;
  name: string;
  file_type: 'wav' | 'mp3';
  data: ArrayBuffer | Uint8Array;
  start_point: number;
  end_point?: number;
  loop_point?: number;
  tune: number;
  volume: number;
}

export interface PadAssignment {
  sample_id?: string;
  name?: string;
  velocity: number;
  tune: number;
  volume: number;
}

export interface PadBank {
  id: 'A' | 'B' | 'C' | 'D';
  pads: Record<number, PadAssignment>;
}

export interface Program {
  id: string;
  name: string;
  pad_assignments: {
    [bank: string]: {
      [pad: number]: PadAssignment;
    };
  };
  current_bank: PadBank['id'];
}

export type LCDMode = 'MAIN' | 'LOAD' | 'SAVE' | 'TRIM' | 'PROGRAM' | 'SETUP' | 'STEP_EDIT';

export interface Parameter {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export interface DisplayState {
  line1: string;
  line2: string;
  current_mode: LCDMode;
  current_page: number;
  menu_items: string[];
  selected_item: number;
  active_parameter?: Parameter;
}

export type MidiEventType = 'noteOn' | 'noteOff' | 'controlChange';

export interface MidiEvent {
  type: MidiEventType;
  time: number;
  note?: number;
  velocity?: number;
  controller?: number;
  value?: number;
}

export interface StepEvent extends MidiEvent {
  stepIndex: number;
  duration: number;
  gate: number;
}

export interface Pattern {
  id: string;
  name: string;
  events: StepEvent[];
  length: number; // In steps
  resolution: number; // Steps per beat
}

export interface Sequence {
  id: string;
  name: string;
  patterns: Pattern[];
  currentPattern: number;
  tempo: number;
}


export interface SwingSettings {
  enabled: boolean;
  percentage: number;  // 50-75%
  resolution: number;  // typically 16
}

export interface SoundBankSample {
  path: string;
  type: 'wav';
  category: string;
  name: string;
}

export interface SoundBank {
  id: string;
  name: string;
  description?: string;
  samples: Record<string, SoundBankSample>;
}
