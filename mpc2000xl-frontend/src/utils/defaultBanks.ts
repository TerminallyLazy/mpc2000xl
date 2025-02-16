import { SoundBank } from '../types';

export const defaultBanks: Record<string, SoundBank> = {
  'tr-808': {
    id: 'tr-808',
    name: 'TR-808',
    description: 'Classic Roland TR-808 drum machine samples',
    samples: {
      'kick': {
        name: 'Kick',
        path: '/samples/808/kick.wav',
        type: 'wav',
        category: 'drums'
      },
      'snare': {
        name: 'Snare',
        path: '/samples/808/snare.wav',
        type: 'wav',
        category: 'drums'
      },
      'hihat-closed': {
        name: 'Closed Hi-Hat',
        path: '/samples/808/hihat-closed.wav',
        type: 'wav',
        category: 'drums'
      },
      'hihat-open': {
        name: 'Open Hi-Hat',
        path: '/samples/808/hihat-open.wav',
        type: 'wav',
        category: 'drums'
      }
    }
  },
  'tr-909': {
    id: 'tr-909',
    name: 'TR-909',
    description: 'Classic Roland TR-909 drum machine samples',
    samples: {
      'kick': {
        name: 'Kick',
        path: '/samples/909/kick.wav',
        type: 'wav',
        category: 'drums'
      },
      'snare': {
        name: 'Snare',
        path: '/samples/909/snare.wav',
        type: 'wav',
        category: 'drums'
      },
      'hihat-closed': {
        name: 'Closed Hi-Hat',
        path: '/samples/909/hihat-closed.wav',
        type: 'wav',
        category: 'drums'
      },
      'hihat-open': {
        name: 'Open Hi-Hat',
        path: '/samples/909/hihat-open.wav',
        type: 'wav',
        category: 'drums'
      }
    }
  },
  'mpc-2000xl': {
    id: 'mpc-2000xl',
    name: 'MPC2000XL',
    description: 'Original MPC2000XL factory sound bank',
    samples: {
      'kick-1': {
        name: 'Kick 1',
        path: '/samples/mpc2000xl/kick-1.wav',
        type: 'wav',
        category: 'drums'
      },
      'kick-2': {
        name: 'Kick 2',
        path: '/samples/mpc2000xl/kick-2.wav',
        type: 'wav',
        category: 'drums'
      },
      'snare-1': {
        name: 'Snare 1',
        path: '/samples/mpc2000xl/snare-1.wav',
        type: 'wav',
        category: 'drums'
      },
      'snare-2': {
        name: 'Snare 2',
        path: '/samples/mpc2000xl/snare-2.wav',
        type: 'wav',
        category: 'drums'
      }
    }
  }
};
