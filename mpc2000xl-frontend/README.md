# MPC2000XL Frontend Emulator

A web-based emulator for the legendary Akai MPC2000XL drum machine and sampler, built with React, TypeScript, and Vite.

## Features

### Core Functionality
- **Sample Management**: Load, edit, and organize WAV and MP3 samples
- **Pad Banks**: 4 banks (A-B-C-D) with 16 pads each
- **LCD Display**: Authentic recreation of the MPC2000XL display
- **Mode Controls**: Main, Program, Trim, Step Edit, and more
- **Real-time Parameter Control**: Data wheel for precise adjustments

### Advanced Features
- **Time-Stretching System**:
  - 3 quality presets (Standard, Better, Highest)
  - 18 algorithms including WSOLA and Phase Vocoder
  - Ratio range: 50% to 200%

- **Swing Pattern System**:
  - Percentage range: 50% to 75%
  - Multiple resolution settings (1/4, 1/8, 1/16, 1/32)
  - Global and per-sequence settings

- **Sound Bank System**:
  - Classic TR-808 and TR-909 samples
  - Original MPC2000XL factory sounds
  - Custom sample import support

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/TerminallyLazy/mpc2000xl.git

# Navigate to frontend directory
cd mpc2000xl/mpc2000xl-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## Development

### Project Structure
```
src/
├── components/     # React components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── utils/         # Utility functions
└── types.ts       # TypeScript definitions
```

### Key Components
- `App.tsx`: Main application component
- `LCD.tsx`: LCD display emulation
- `ModeControls.tsx`: Mode selection buttons
- `Pad.tsx`: Individual pad component
- `DataWheel.tsx`: Parameter adjustment control

### Testing
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
