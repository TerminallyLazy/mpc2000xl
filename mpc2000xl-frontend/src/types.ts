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

export type LCDMode = 'MAIN' | 'LOAD' | 'SAVE' | 'TRIM' | 'PROGRAM' | 'SETUP';

export interface DisplayState {
  line1: string;
  line2: string;
  current_mode: LCDMode;
  current_page: number;
  menu_items: string[];
  selected_item: number;
}
