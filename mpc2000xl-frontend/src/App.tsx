import { useState, useEffect } from 'react';
import { ProgramManager } from './components/ProgramManager';
import { TrimMode } from './components/lcd/TrimMode';
import { ProgramMode } from './components/lcd/ProgramMode';
import { LoadMode } from './components/lcd/LoadMode';
import { SaveMode } from './components/lcd/SaveMode';
import { Pad } from './components/Pad';
import { audioEngine } from './utils/audio';
import { Program, LCDMode, DisplayState, Sample } from './types';
import { DataWheel } from './components/DataWheel';
import { LCD } from './components/LCD';
import { ModeControls } from './components/ModeControls';
import { PadBanks } from './components/PadBanks';

function App() {
  // Mode transition handlers
  const handleModeChange = (newMode: LCDMode) => {
    setCurrentMode(newMode);
    setDisplayState(prev => ({
      ...prev,
      current_mode: newMode,
      line1: `${newMode} MODE`,
      line2: currentProgram?.name || 'No Program'
    }));
  };

  const handleProgramChange = (program: Program | null) => {
    setCurrentProgram(program);
  };
  const [displayState, setDisplayState] = useState<DisplayState>({
    line1: 'MPC2000XL',
    line2: 'MAIN MODE',
    current_mode: 'MAIN',
    current_page: 1,
    menu_items: [],
    selected_item: 0
  });

  const [pressedPad, setPressedPad] = useState<number | null>(null);
  const [currentMode, setCurrentMode] = useState<LCDMode>('MAIN');
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [currentSample, setCurrentSample] = useState<Sample | null>(null);
  const [currentBank, setCurrentBank] = useState<'A' | 'B' | 'C' | 'D'>('A');

  const handlePadClick = async (index: number) => {
    setPressedPad(index);
    if (!currentProgram) return;
    const assignment = currentProgram.pad_assignments[currentBank]?.[index];
    if (!assignment?.sample_id) return;
    await audioEngine.playSample(assignment.sample_id, {
      tune: assignment.tune,
      volume: assignment.volume
    });
    setTimeout(() => setPressedPad(null), 100);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes('audio/')) {
      alert('Please select an audio file (WAV or MP3)');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const sampleId = crypto.randomUUID();
      await audioEngine.loadSample(sampleId, buffer);
      
      // Create new sample
      const newSample: Sample = {
        id: sampleId,
        name: file.name,
        file_type: file.name.toLowerCase().endsWith('.wav') ? 'wav' : 'mp3',
        data: buffer,
        start_point: 0,
        end_point: undefined,
        loop_point: undefined,
        tune: 0,
        volume: 100
      };
      
      setCurrentSample(newSample);
      setCurrentMode('TRIM');
    } catch (error) {
      console.error('Error loading sample:', error);
    }
    
    setDisplayState({
      line1: 'Sample Loaded:',
      line2: file.name.slice(0, 16), // LCD character limit
      current_mode: 'LOAD',
      current_page: 1,
      menu_items: [],
      selected_item: 0
    });
  };

  // Sample editing handlers
  const handleSampleEdit = {
    onStartPointChange: (value: number) => {
      if (!currentSample) return;
      setCurrentSample({ ...currentSample, start_point: value });
    },
    onEndPointChange: (value: number) => {
      if (!currentSample) return;
      setCurrentSample({ ...currentSample, end_point: value });
    },
    onLoopPointChange: (value: number) => {
      if (!currentSample) return;
      setCurrentSample({ ...currentSample, loop_point: value });
    },
    onTuneChange: (value: number) => {
      if (!currentSample) return;
      setCurrentSample({ ...currentSample, tune: value });
    },
    onVolumeChange: (value: number) => {
      if (!currentSample) return;
      setCurrentSample({ ...currentSample, volume: value });
    }
  };

  const [shiftActive, setShiftActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftActive(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftActive(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-2xl flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
        <ModeControls
          currentMode={currentMode}
          onModeChange={handleModeChange}
          shiftActive={shiftActive}
        />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <DataWheel
            value={0}
            onChange={(value) => {
              // TODO: Handle data wheel changes based on current mode
              console.log('Data wheel value:', value);
            }}
          />
        </div>
      </div>
      <LCD
        mode={currentMode}
        line1={displayState.line1}
        line2={displayState.line2}
        parameters={[
          { label: 'Program', value: currentProgram?.name || 'None' },
          { label: 'Bank', value: currentBank },
          { label: 'Tempo', value: '120 BPM' },
          { label: 'Volume', value: '100%' }
        ]}
        statusIndicators={{
          bank: currentBank,
          tempo: 120
        }}
      />
      <div className="mb-8">
          {currentMode === 'MAIN' && (
            <ProgramManager
              currentProgram={currentProgram}
              onProgramSelect={handleProgramChange}
            />
          )}
          {currentMode === 'TRIM' && (
            <TrimMode
              currentSample={currentSample}
              {...handleSampleEdit}
            />
          )}
          {currentMode === 'LOAD' && (
            <LoadMode
              onSampleSelect={() => {}}
              samples={[]}
            />
          )}
          {currentMode === 'SAVE' && (
            <SaveMode
              onSave={() => {}}
            />
          )}
          {currentMode === 'PROGRAM' && (
            <ProgramMode
              currentProgram={currentProgram}
              currentBank={currentBank}
              onBankChange={setCurrentBank}
              onPadAssign={(bank, pad, assignment) => {
                if (!currentProgram) return;
                const updatedProgram = { ...currentProgram };
                if (!updatedProgram.pad_assignments[bank]) {
                  updatedProgram.pad_assignments[bank] = {};
                }
                updatedProgram.pad_assignments[bank][pad] = assignment;
                setCurrentProgram(updatedProgram);
              }}
            />
          )}
        </div>
        
        <div className="mb-6">
          <input
            type="file"
            accept=".wav,.mp3"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        
        <PadBanks
          currentBank={currentBank}
          onBankChange={setCurrentBank}
        />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <Pad
              key={i}
              index={i}
              onClick={() => handlePadClick(i)}
              isPressed={pressedPad === i}
              assignment={currentProgram?.pad_assignments[currentBank]?.[i]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App
