from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import List, Dict, Optional
import uuid
from .models import Sample, DisplayState, Program, PadAssignment, SoundParameters
from .routes import audio
from .routes.ai import beat_generation

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(audio.router, prefix="/audio", tags=["audio"])
app.include_router(beat_generation.router, prefix="/ai", tags=["ai"])

# In-memory storage
samples: Dict[str, Sample] = {}
programs: Dict[str, Program] = {}
current_program_id: Optional[str] = None
current_display: DisplayState = DisplayState(
    line1="MPC2000XL",
    line2="MAIN MODE",
    current_mode="MAIN",
    menu_items=["LOAD", "SAVE", "TRIM", "PROGRAM"]
)

@app.post("/api/samples")
async def upload_sample(file: UploadFile):
    filename = file.filename.lower()
    if not (filename.endswith('.wav') or filename.endswith('.mp3')):
        raise HTTPException(status_code=400, detail="File must be WAV or MP3")
    
    # Read first few bytes to validate file type
    header = await file.read(12)
    await file.seek(0)
    
    # Validate WAV header (RIFF....WAVE)
    if filename.endswith('.wav'):
        if not (header.startswith(b'RIFF') and header[8:12] == b'WAVE'):
            raise HTTPException(status_code=400, detail="Invalid WAV file")
    
    # Validate MP3 header (ID3 or MPEG sync)
    elif filename.endswith('.mp3'):
        if not (header.startswith(b'ID3') or (header[0] == 0xFF and (header[1] & 0xE0) == 0xE0)):
            raise HTTPException(status_code=400, detail="Invalid MP3 file")
    
    file_content = await file.read()
    await file.seek(0)
    
    sample_id = str(uuid.uuid4())
    sample = Sample(
        id=sample_id,
        name=file.filename,
        file_type="wav" if file.filename.lower().endswith('.wav') else "mp3",
        data=file_content
    )
    samples[sample_id] = sample
    return {"id": sample_id, "name": sample.name}

@app.get("/api/samples")
async def list_samples() -> List[dict]:
    return [{"id": id, "name": s.name, "type": s.file_type} for id, s in samples.items()]

@app.get("/api/samples/{sample_id}")
async def get_sample(sample_id: str) -> Sample:
    if sample_id not in samples:
        raise HTTPException(status_code=404, detail="Sample not found")
    return samples[sample_id]

@app.put("/api/samples/{sample_id}/parameters")
async def update_sample_parameters(sample_id: str, params: SoundParameters) -> Sample:
    if sample_id not in samples:
        raise HTTPException(status_code=404, detail="Sample not found")
    sample = samples[sample_id]
    sample.start_point = params.start_point
    sample.end_point = params.end_point
    sample.loop_point = params.loop_point
    sample.tune = params.tune
    sample.volume = params.volume
    return sample

@app.post("/api/programs")
async def create_program(program: Program) -> Program:
    program_id = str(uuid.uuid4())
    program.id = program_id
    programs[program_id] = program
    return program

@app.get("/api/programs")
async def list_programs() -> List[Program]:
    return list(programs.values())

@app.get("/api/programs/{program_id}")
async def get_program(program_id: str) -> Program:
    if program_id not in programs:
        raise HTTPException(status_code=404, detail="Program not found")
    return programs[program_id]

@app.put("/api/programs/{program_id}")
async def update_program(program_id: str, program: Program) -> Program:
    if program_id not in programs:
        raise HTTPException(status_code=404, detail="Program not found")
    program.id = program_id  # Ensure ID doesn't change
    programs[program_id] = program
    return program

@app.put("/api/programs/{program_id}/pads")
async def assign_pad(
    program_id: str,
    bank: str,
    pad: int,
    assignment: PadAssignment
) -> Program:
    if program_id not in programs:
        raise HTTPException(status_code=404, detail="Program not found")
    if bank not in ["A", "B", "C", "D"]:
        raise HTTPException(status_code=400, detail="Invalid bank")
    if not 0 <= pad <= 15:
        raise HTTPException(status_code=400, detail="Invalid pad number")
    
    program = programs[program_id]
    program.pad_assignments[bank][pad] = assignment
    return program

@app.get("/api/display")
async def get_display() -> DisplayState:
    return current_display

@app.put("/api/display")
async def update_display(display: DisplayState) -> DisplayState:
    global current_display
    current_display = display
    return current_display
