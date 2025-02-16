import pytest
from fastapi.testclient import TestClient
from app.main import app
import io
import numpy as np
import soundfile as sf

client = TestClient(app)

@pytest.fixture
def test_audio_file():
    # Generate a simple sine wave
    sr = 44100
    duration = 1.0
    t = np.linspace(0, duration, int(sr * duration))
    audio = np.sin(2 * np.pi * 440 * t)  # 440 Hz sine wave
    
    # Save to WAV file in memory
    buffer = io.BytesIO()
    sf.write(buffer, audio, sr, format='WAV')
    buffer.seek(0)
    return buffer

def test_time_stretch_endpoint(test_audio_file):
    files = {'file': ('test.wav', test_audio_file, 'audio/wav')}
    response = client.post(
        "/audio/timestretch",
        files=files,
        params={
            'ratio': 75,
            'quality': 'A',
            'algorithm': 0
        }
    )
    
    assert response.status_code == 200
    assert 'data' in response.json()
    assert 'sample_rate' in response.json()
    assert 'duration' in response.json()

def test_time_stretch_invalid_ratio():
    files = {'file': ('test.wav', io.BytesIO(), 'audio/wav')}
    response = client.post(
        "/audio/timestretch",
        files=files,
        params={
            'ratio': 30,  # Invalid ratio
            'quality': 'A',
            'algorithm': 0
        }
    )
    
    assert response.status_code == 422

def test_time_stretch_invalid_quality():
    files = {'file': ('test.wav', io.BytesIO(), 'audio/wav')}
    response = client.post(
        "/audio/timestretch",
        files=files,
        params={
            'ratio': 75,
            'quality': 'D',  # Invalid quality
            'algorithm': 0
        }
    )
    
    assert response.status_code == 422

def test_time_stretch_invalid_algorithm():
    files = {'file': ('test.wav', io.BytesIO(), 'audio/wav')}
    response = client.post(
        "/audio/timestretch",
        files=files,
        params={
            'ratio': 75,
            'quality': 'A',
            'algorithm': 20  # Invalid algorithm
        }
    )
    
    assert response.status_code == 422
