# MPC2000XL Backend Service

A FastAPI-based backend service that provides audio processing capabilities for the MPC2000XL emulator.

## Features

### Audio Processing
- **Time-Stretching Engine**
  - Multiple quality presets (Standard, Better, Highest)
  - 18 different algorithms
  - Ratio range from 50% to 200%
  - Phase-coherent processing
  - Real-time preview capability

### File Management
- WAV and MP3 file support
- Sample validation and header checking
- Secure file handling
- Memory-efficient processing

### API Endpoints

#### Audio Processing
```
POST /api/audio/time-stretch
```
- Time-stretches audio files with configurable parameters
- Supports multiple algorithms and quality settings
- Returns processed audio data

#### Sample Management
```
POST /api/samples/upload
```
- Handles sample file uploads
- Validates audio file formats
- Returns sample metadata

```
GET /api/samples/{sample_id}
```
- Retrieves sample data by ID
- Supports range requests for streaming

## Getting Started

### Prerequisites
- Python 3.9+
- Poetry (Python package manager)
- FFmpeg (for audio processing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TerminallyLazy/mpc2000xl.git
cd mpc2000xl/mpc2000xl-backend
```

2. Install dependencies using Poetry:
```bash
poetry install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running the Server

#### Development
```bash
poetry run uvicorn app.main:app --reload
```

#### Production
```bash
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker Deployment

1. Build the image:
```bash
docker build -t mpc2000xl-backend .
```

2. Run the container:
```bash
docker run -p 8000:8000 mpc2000xl-backend
```

## Development

### Project Structure
```
mpc2000xl-backend/
├── app/
│   ├── main.py          # FastAPI application
│   ├── routes/          # API route handlers
│   ├── models.py        # Data models
│   └── utils/           # Utility functions
├── tests/               # Test suite
└── poetry.lock         # Dependency lock file
```

### Running Tests
```bash
poetry run pytest
```

### API Documentation
Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.