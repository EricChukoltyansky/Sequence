import { useState, useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";

const PlayerProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const loadedInstruments = useRef(new Set(["piano", "bass", "drums"]));
  const soundCache = useRef({});

  // Initialize audio on first user interaction
  const initializeAudio = useCallback(async () => {
    if (isAudioReady) return Promise.resolve();
    setIsAudioReady(true);
    console.log("Audio initialized");
    return Promise.resolve();
  }, [isAudioReady]);

  // Create a Howl instance for a specific note
  const createSound = useCallback((instrumentId, noteName) => {
    const key = `${instrumentId}-${noteName}`;
    
    if (soundCache.current[key]) {
      return soundCache.current[key];
    }

    const instrumentPaths = {
      piano: { "F#": "/sounds/piano/F#.wav", E: "/sounds/piano/E.wav", "C#": "/sounds/piano/C#.wav", A: "/sounds/piano/A.wav" },
      "grand-piano": { "F#": "/sounds/grand-piano/F#.wav", E: "/sounds/grand-piano/E.wav", "C#": "/sounds/grand-piano/C#.wav", A: "/sounds/grand-piano/A.wav" },
      bass: { "F#": "/sounds/bass/F#.wav", E: "/sounds/bass/E.wav", "C#": "/sounds/bass/C#.wav", B: "/sounds/bass/B.wav" },
      drums: { OH: "/sounds/drums/hihat-open.wav", CH: "/sounds/drums/hihat-closed.wav", CP: "/sounds/drums/snare.wav", BD: "/sounds/drums/kick.wav" },
      percussion: { OH: "/sounds/percussion/hihat-open.wav", CH: "/sounds/percussion/hihat-closed.wav", CP: "/sounds/percussion/snare.wav", BD: "/sounds/percussion/kick.wav" },
    };

    const paths = instrumentPaths[instrumentId] || instrumentPaths.piano;
    const src = paths[noteName] || paths["F#"];

    const sound = new Howl({
      src: [src],
      volume: 0.7,
      preload: true,
      html5: false, // Use Web Audio API for better performance
    });

    soundCache.current[key] = sound;
    return sound;
  }, []);

  // Load instrument (just mark as ready to load on demand)
  const loadInstrument = useCallback((instrumentId) => {
    if (loadedInstruments.current.has(instrumentId)) {
      console.log(`Instrument ${instrumentId} already loaded`);
      return Promise.resolve();
    }

    // Only real instruments available
    const available = ["piano", "grand-piano", "bass", "drums", "percussion"];
    if (!available.includes(instrumentId)) {
      console.warn(`Instrument ${instrumentId} not available - using piano`);
      loadedInstruments.current.add(instrumentId);
      return Promise.resolve();
    }

    console.log(`Loading instrument: ${instrumentId}`);
    loadedInstruments.current.add(instrumentId);
    return Promise.resolve();
  }, []);

  // Play sound function
  const playSound = useCallback((instrumentId, noteName, volume = -12) => {
    const sound = createSound(instrumentId, noteName);
    
    // Convert dB to 0-1 range (Howler uses 0-1, Tone uses dB)
    const normalizedVolume = Math.pow(10, volume / 20);
    sound.volume(Math.max(0, Math.min(1, normalizedVolume)));
    sound.play();
  }, [createSound]);

  // Create a players-like object that mimics Tone.js API
  const players = useRef({
    piano: {
      loaded: true,
      volume: { value: -12 },
      player: (note) => ({
        loaded: true,
        start: () => playSound("piano", note, players.current.piano.volume.value),
      }),
    },
    "grand-piano": {
      loaded: true,
      volume: { value: -12 },
      player: (note) => ({
        loaded: true,
        start: () => playSound("grand-piano", note, players.current["grand-piano"].volume.value),
      }),
    },
    bass: {
      loaded: true,
      volume: { value: -12 },
      player: (note) => ({
        loaded: true,
        start: () => playSound("bass", note, players.current.bass.volume.value),
      }),
    },
    drums: {
      loaded: true,
      volume: { value: -12 },
      player: (note) => ({
        loaded: true,
        start: () => playSound("drums", note, players.current.drums.volume.value),
      }),
    },
    percussion: {
      loaded: true,
      volume: { value: -12 },
      player: (note) => ({
        loaded: true,
        start: () => playSound("percussion", note, players.current.percussion.volume.value),
      }),
    },
  });

  // Add new instrument dynamically
  const addInstrument = useCallback((instrumentId) => {
    if (!players.current[instrumentId]) {
      players.current[instrumentId] = {
        loaded: true,
        volume: { value: -12 },
        player: (note) => ({
          loaded: true,
          start: () => playSound(instrumentId, note, players.current[instrumentId].volume.value),
        }),
      };
    }
  }, [playSound]);

  useEffect(() => {
    console.log("Howler-based audio provider ready");
    setIsLoading(false);
  }, []);

  return children({
    players: players.current,
    loadInstrument: (id) => {
      loadInstrument(id);
      addInstrument(id);
    },
    isLoading,
    initializeAudio,
    isAudioReady,
  });
};

export default PlayerProvider;
