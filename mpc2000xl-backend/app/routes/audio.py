from fastapi import APIRouter, UploadFile, Query, HTTPException
from pydantic import BaseModel
from typing import Optional
import numpy as np
import soundfile as sf
import io
import librosa

router = APIRouter()

class TimeStretchResponse(BaseModel):
    data: bytes
    sample_rate: int
    duration: float

@router.post("/timestretch")
async def time_stretch(
    file: UploadFile,
    ratio: float = Query(50, ge=50, le=200),
    quality: str = Query("A", regex="^[ABC]$"),
    algorithm: int = Query(0, ge=0, le=17)
) -> TimeStretchResponse:
    """
    Time-stretch audio file without changing pitch
    
    Args:
        file: Audio file (WAV/MP3)
        ratio: Time-stretch ratio (50-200%)
        quality: Processing quality ('A'|'B'|'C')
        algorithm: Algorithm index (0-17)
    
    Returns:
        Processed audio data and metadata
    """
    try:
        # Read audio file
        content = await file.read()
        y, sr = sf.read(io.BytesIO(content))
        
        # Convert to mono if stereo
        if len(y.shape) > 1:
            y = y.mean(axis=1)
        
        # Calculate stretch parameters based on quality
        n_fft = {
            'A': 2048,  # Standard quality
            'B': 4096,  # Better quality
            'C': 8192   # Highest quality
        }[quality]
        
        hop_length = n_fft // 4
        
        # Apply time stretch
        y_stretched = librosa.effects.time_stretch(
            y=y,
            rate=100/ratio,
            n_fft=n_fft,
            hop_length=hop_length
        )
        
        # Convert back to WAV
        buffer = io.BytesIO()
        sf.write(buffer, y_stretched, sr, format='WAV')
        
        return TimeStretchResponse(
            data=buffer.getvalue(),
            sample_rate=sr,
            duration=len(y_stretched) / sr
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing audio: {str(e)}"
        )
