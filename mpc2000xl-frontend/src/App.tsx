import { useState, useEffect } from 'react';
import { ProgramManager } from './components/ProgramManager';

const formatValue = (value: string | number): string => {
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return value.toFixed(1);
  }
  return value;
};
import { TrimMode } from './components/lcd/TrimMode';
import { ProgramMode } from './components/lcd/ProgramMode';
import { LoadMode } from './components/lcd/LoadMode';
import { SaveMode } from './components/lcd/SaveMode';
import { Pad } from './components/Pad';
import { audioEngine } from './utils/audio';
import { Program, LCDMode, DisplayState, Sample, Parameter } from './types';
import { DataWheel } from './components/DataWheel';
import { LCD } from './components/LCD';
import { ModeControls } from './components/ModeControls';
import { PadBanks } from './components/PadBanks';
import { LevelControl } from './components/LevelControl';

function App() {
  // Mode transition handlers
  const getModeParameters = (mode: LCDMode): Parameter[] => {
    switch (mode) {
      case 'TRIM':
        return [
          { id: 'start', label: 'Start', value: currentSample?.start_point || 0, min: 0, max: 100, step: 1 },
          { id: 'end', label: 'End', value: currentSample?.end_point || 100, min: 0, max: 100, step: 1 },
          { id: 'loop', label: 'Loop', value: currentSample?.loop_point || 0, min: 0, max: 100, step: 1 },
          { id: 'tune', label: 'Tune', value: currentSample?.tune || 0, min: -12, max: 12, step: 1 }
        ];
      case 'PROGRAM':
        return [
          { id: 'velocity', label: 'Velocity', value: 100, min: 0, max: 127, step: 1 },
          { id: 'tune', label: 'Tune', value: 0, min: -12, max: 12, step: 1 },
          { id: 'level', label: 'Level', value: 100, min: 0, max: 100, step: 1 }
        ];
      default:
        return [];
    }
  };

  const handleModeChange = (newMode: LCDMode) => {
    setCurrentMode(newMode);
    const parameters = getModeParameters(newMode);
    setDisplayState(prev => ({
      ...prev,
      current_mode: newMode,
      line1: `${newMode} MODE`,
      line2: currentProgram?.name || 'No Program',
      active_parameter: parameters[0]
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
  const [mainVolume, setMainVolume] = useState(100);
  const [recordLevel, setRecordLevel] = useState(75);
  const [noteVariation, setNoteVariation] = useState(50);

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
      if (e.key === 'Shift') {
        setShiftActive(true);
        return;
      }

      // Parameter selection with arrow keys
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const parameters = getModeParameters(currentMode);
        if (parameters.length === 0) return;

        const currentIndex = parameters.findIndex(p => p.id === displayState.active_parameter?.id);
        let newIndex = currentIndex;

        if (e.key === 'ArrowUp') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : parameters.length - 1;
        } else {
          newIndex = currentIndex < parameters.length - 1 ? currentIndex + 1 : 0;
        }

        const newParameter = parameters[newIndex];
        setDisplayState(prev => ({
          ...prev,
          active_parameter: newParameter,
          line2: `${newParameter.label}: ${formatValue(newParameter.value)}`
        }));

        // Play a click sound for parameter changes
        const audio = new Audio('/click.mp3');
        audio.volume = 0.1;
        audio.play().catch(() => {});
      }
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
  }, [currentMode, displayState.active_parameter?.id]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-2xl flex">
        {/* Left Section */}
        <div className="flex-1 pr-8 border-r border-gray-300">
          <LCD
            mode={currentMode}
            line1={displayState.line1}
            line2={displayState.line2}
            parameters={[
              { label: 'Program', value: currentProgram?.name || 'None' },
              { label: 'Bank', value: currentBank },
              { label: 'Tempo', value: '120 BPM' },
              { label: 'Volume', value: mainVolume + '%' }
            ]}
            statusIndicators={{
              bank: currentBank,
              tempo: 120
            }}
            activeParameter={displayState.active_parameter ? {
              label: displayState.active_parameter.label,
              value: displayState.active_parameter.value
            } : undefined}
          />
          <div className="mt-8">
            <ModeControls
              currentMode={currentMode}
              onModeChange={handleModeChange}
              shiftActive={shiftActive}
            />
          </div>
          <div className="mt-8 flex justify-between items-end">
            <div className="flex gap-4">
              <LevelControl
                type="main"
                value={mainVolume}
                onChange={setMainVolume}
                label="MAIN"
              />
              <LevelControl
                type="record"
                value={recordLevel}
                onChange={setRecordLevel}
                label="REC"
              />
              <LevelControl
                type="note"
                value={noteVariation}
                onChange={setNoteVariation}
                label="NOTE VAR"
              />
            </div>
            <DataWheel
              value={displayState.active_parameter?.value || 0}
              onChange={(value) => {
                if (!displayState.active_parameter) return;
                
                const { id } = displayState.active_parameter;
                switch (currentMode) {
                  case 'TRIM':
                    if (currentSample) {
                      switch (id) {
                        case 'start':
                          handleSampleEdit.onStartPointChange(value);
                          break;
                        case 'end':
                          handleSampleEdit.onEndPointChange(value);
                          break;
                        case 'loop':
                          handleSampleEdit.onLoopPointChange(value);
                          break;
                        case 'tune':
                          handleSampleEdit.onTuneChange(value);
                          break;
                      }
                    }
                    break;
                  case 'PROGRAM':
                    if (currentProgram && pressedPad !== null) {
                      const updatedProgram = { ...currentProgram };
                      const assignment = updatedProgram.pad_assignments[currentBank]?.[pressedPad] || {};
                      switch (id) {
                        case 'velocity':
                          assignment.velocity = value;
                          break;
                        case 'tune':
                          assignment.tune = value;
                          break;
                        case 'level':
                          assignment.volume = value;
                          break;
                      }
                      updatedProgram.pad_assignments[currentBank][pressedPad] = assignment;
                      setCurrentProgram(updatedProgram);
                    }
                    break;
                }

                setDisplayState(prev => ({
                  ...prev,
                  line2: `${displayState.active_parameter?.label}: ${value}`,
                  active_parameter: {
                    ...prev.active_parameter!,
                    value
                  }
                }));
              }}
              min={displayState.active_parameter?.min || 0}
              max={displayState.active_parameter?.max || 100}
              acceleration={true}
              fineControl={shiftActive}
            />
          </div>
        </div>
        {/* Right Section */}
        <div className="flex-1 pl-8">
          <div className="mb-8">
            <PadBanks
              currentBank={currentBank}
              onBankChange={setCurrentBank}
            />
          </div>
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
    </div>
  );
}

export default App;
