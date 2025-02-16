import type { Program, DisplayState, PadAssignment } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://app-vsucgnod.fly.dev';

interface APIOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const fetchFromAPI = async (endpoint: string, options: APIOptions = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

export const api = {
  // Sample endpoints
  getSamples: () => fetchFromAPI('/api/samples'),
  getSample: (id: string) => fetchFromAPI(`/api/samples/${id}`),
  uploadSample: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchFromAPI('/api/samples', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
  updateSampleParameters: (id: string, params: any) => 
    fetchFromAPI(`/api/samples/${id}/parameters`, {
      method: 'PUT',
      body: JSON.stringify(params),
    }),

  // Program endpoints
  getPrograms: () => fetchFromAPI('/api/programs'),
  getProgram: (id: string) => fetchFromAPI(`/api/programs/${id}`),
  createProgram: (program: Program) => 
    fetchFromAPI('/api/programs', {
      method: 'POST',
      body: JSON.stringify(program),
    }),
  updateProgram: (id: string, program: Program) =>
    fetchFromAPI(`/api/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(program),
    }),
  assignPad: (programId: string, bank: string, pad: number, assignment: PadAssignment) =>
    fetchFromAPI(`/api/programs/${programId}/pads`, {
      method: 'PUT',
      body: JSON.stringify({ bank, pad, assignment }),
    }),

  // Display endpoints
  getDisplay: () => fetchFromAPI('/api/display'),
  updateDisplay: (display: DisplayState) =>
    fetchFromAPI('/api/display', {
      method: 'PUT',
      body: JSON.stringify(display),
    }),
};
