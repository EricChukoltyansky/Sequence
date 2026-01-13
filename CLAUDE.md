# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sequence is a collaborative real-time music sequencer web application where multiple users can create music together. The application consists of a React frontend and Node.js/Express backend with Socket.IO for real-time communication and Redis for state management.

## Development Commands

### Full Stack Development
```bash
npm run dev        # Start both client and server concurrently
npm run client     # Start React client only (port 3000)
npm run server     # Start Node.js server only (port 3001)
```

### Client (React)
```bash
cd client
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
```

### Server (Node.js)
```bash
cd server
npm start          # Production server
npm run dev        # Development with nodemon
```

## Architecture

### Frontend Structure
- **React 18** with functional components and hooks
- **Styled Components** for all styling (no CSS modules or separate CSS files)
- **ToneJS** for audio synthesis and playback
- **Socket.IO Client** for real-time communication
- **React Router** for navigation

#### Key Components:
- `Sequencer.jsx` - Main sequencer interface with grid layout
- `Grid.jsx` - Musical grid with cells for beat patterns
- `PlayerProvider.jsx` - ToneJS audio player context using sample sounds
- Various UI components in themed styled-components

### Backend Structure
- **Express.js** server with Socket.IO
- **Redis** for state persistence and pub/sub
- **MongoDB/Mongoose** for user authentication
- **Multiple Socket.IO namespaces** for different rooms (/room1, /room2, etc.)

#### Key Features:
- Real-time sequence synchronization across users
- BPM and volume controls broadcast to all users
- Room-based isolation with separate namespaces
- Redis adapter for Socket.IO clustering

### Audio System
The app uses **ToneJS** with pre-loaded audio samples:
- 5 melodic sounds (F#, E, C#, A, F#)  
- 4 bass sounds (F#, E, C#, B)
- 4 rhythm sounds (open-hat, closed-hat, snare, kick)

Audio files are located in `client/public/sounds/` and loaded via `PlayerProvider.jsx`.

### State Management
- Frontend: React Context (`PlayerProvider`, `UserProvider`) + local component state
- Backend: Redis for persistent sequence state
- Real-time sync: Socket.IO events (`sequence`, `arm`, `switch`, `BPM`, `clearAll`, `rewind`)

### Styling System
All styling uses **styled-components** with a centralized theme system in `client/src/theme.js`. The design follows a modern, dark theme with professional grid backgrounds and responsive design.

## Key Socket Events
- `sequence` - Sends/receives complete sequence state
- `arm` - Toggle individual cells on/off  
- `switch` - Play/pause sequencer
- `BPM` - Tempo changes
- `clearAll` - Reset all sequences
- `rewind` - Reset playback position

## Environment Configuration
Server requires `.env` file with:
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `PORT` (defaults to 3001)
- MongoDB connection string for user authentication

## Mobile Responsive
The app includes orientation detection - portrait mode shows a rotation prompt, landscape mode shows the full sequencer interface.