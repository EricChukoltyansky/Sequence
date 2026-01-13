import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

const PlayerProvider = ({ children }) => {
  const [players, setPlayers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const loadedInstruments = useRef(new Set(["default"]));
  const instrumentPlayers = useRef({});

  // Initialize audio context on first user interaction
  const initializeAudio = useCallback(async () => {
    if (isAudioReady) return Promise.resolve();

    try {
      await Tone.start();
      console.log("Audio context started");
      setIsAudioReady(true);

      // Preload all buffers to avoid delays
      if (players) {
        const preloadPromises = Object.values(players).map((player) => {
          if (player && player.loaded === false) {
            return new Promise((resolve) => {
              player.toDestination();
              setTimeout(resolve, 10);
            });
          }
          return Promise.resolve();
        });
        await Promise.all(preloadPromises);
      }
    } catch (error) {
      console.error("Failed to start audio context:", error);
    }
  }, [isAudioReady, players]);

  const loadInstrument = useCallback((instrumentId) => {
    // If already loaded, return resolved promise
    if (loadedInstruments.current.has(instrumentId)) {
      console.log(`Instrument ${instrumentId} already loaded`);
      return Promise.resolve();
    }

    // If already in players (from initial load), mark as loaded
    if (instrumentPlayers.current[instrumentId]) {
      loadedInstruments.current.add(instrumentId);
      return Promise.resolve();
    }

    console.log(`Loading instrument: ${instrumentId}`);

    const instrumentUrls = {
      piano: {
        "F#": "/sounds/piano/F#.wav",
        E: "/sounds/piano/E.wav",
        "C#": "/sounds/piano/C#.wav",
        A: "/sounds/piano/A.wav",
      },
      "grand-piano": {
        "F#": "/sounds/grand-piano/F#.wav",
        E: "/sounds/grand-piano/E.wav",
        "C#": "/sounds/grand-piano/C#.wav",
        A: "/sounds/grand-piano/A.wav",
      },
      bass: {
        "F#": "/sounds/bass/F#.wav",
        E: "/sounds/bass/E.wav",
        "C#": "/sounds/bass/C#.wav",
        B: "/sounds/bass/B.wav",
      },
      drums: {
        OH: "/sounds/drums/hihat-open.wav",
        CH: "/sounds/drums/hihat-closed.wav",
        CP: "/sounds/drums/snare.wav",
        BD: "/sounds/drums/kick.wav",
      },
      percussion: {
        OH: "/sounds/percussion/hihat-open.wav",
        CH: "/sounds/percussion/hihat-closed.wav",
        CP: "/sounds/percussion/snare.wav",
        BD: "/sounds/percussion/kick.wav",
      },
    };

    return new Promise((resolve, reject) => {
      const urls = instrumentUrls[instrumentId];
      if (!urls) {
        console.warn(`Instrument ${instrumentId} not available - only piano, grand-piano, bass, drums, percussion have real samples`);
        // Use piano as fallback
        const fallbackUrls = instrumentUrls.piano;
        const player = new Tone.Players({
          urls: fallbackUrls,
          fadeIn: 0,
          fadeOut: 0.1,
          onload: () => {
            loadedInstruments.current.add(instrumentId);
            instrumentPlayers.current[instrumentId] = player;
            setPlayers({ ...instrumentPlayers.current });
            console.log(`✓ Loaded ${instrumentId} with piano fallback`);
            resolve();
          },
          onerror: (error) => {
            console.error(`Failed to load ${instrumentId}:`, error);
            reject(error);
          },
        }).toDestination();
        instrumentPlayers.current[instrumentId] = player;
        return;
        resolve();
        return;
      }

      const player = new Tone.Players({
        urls,
        fadeIn: 0,
        fadeOut: 0.1,
        onload: () => {
          // Mark as loaded
          loadedInstruments.current.add(instrumentId);

          // Add to players ref
          instrumentPlayers.current[instrumentId] = player;

          // Update state to trigger re-render
          setPlayers({ ...instrumentPlayers.current });

          console.log(`✓ Loaded and ready: ${instrumentId}`);
          resolve();
        },
        onerror: (error) => {
          console.error(`Failed to load ${instrumentId}:`, error);
          reject(error);
        },
      }).toDestination();

      // Add to ref immediately (even before loaded) so it's available
      instrumentPlayers.current[instrumentId] = player;
    });
  }, []);

  useEffect(() => {
    // Preload audio files and prepare everything
    const initialInstruments = {
      // Load default instruments (piano, bass, drums)
      piano: new Tone.Players({
        urls: {
          "F#": "/sounds/piano/F#.wav",
          E: "/sounds/piano/E.wav",
          "C#": "/sounds/piano/C#.wav",
          A: "/sounds/piano/A.wav",
        },
        fadeIn: 0,
        fadeOut: 0.1,
      }).toDestination(),

      bass: new Tone.Players({
        urls: {
          "F#": "/sounds/bass/F#.wav",
          E: "/sounds/bass/E.wav",
          "C#": "/sounds/bass/C#.wav",
          B: "/sounds/bass/B.wav",
        },
        fadeIn: 0,
        fadeOut: 0.1,
      }).toDestination(),

      drums: new Tone.Players({
        urls: {
          OH: "/sounds/drums/hihat-open.wav",
          CH: "/sounds/drums/hihat-closed.wav",
          CP: "/sounds/drums/snare.wav",
          BD: "/sounds/drums/kick.wav",
        },
        fadeIn: 0,
        fadeOut: 0.05,
      }).toDestination(),

      // Default fallback using original sounds
      default: new Tone.Players({
        urls: {
          "F#": "/sounds/catHighFS.wav",
          E: "/sounds/catEF.wav",
          "C#": "/sounds/catCS.wav",
          A: "/sounds/catAF.wav",
          B: "/sounds/bassBF.wav",
          OH: "/sounds/hh_open.wav",
          CH: "/sounds/hh_closed.wav",
          CP: "/sounds/snare.wav",
          BD: "/sounds/the-kick.wav",
        },
        fadeIn: 0,
        fadeOut: 0.1,
        onload: () => {
          console.log("Default instruments loaded - Ready to play!");
          loadedInstruments.current.add("piano");
          loadedInstruments.current.add("bass");
          loadedInstruments.current.add("drums");
          instrumentPlayers.current = initialInstruments;
          setPlayers(initialInstruments);
          setIsLoading(false);
        },
      }).toDestination(),
    };
  }, []);

  return children({
    players,
    loadInstrument,
    isLoading,
    initializeAudio,
    isAudioReady,
  });
};

export default PlayerProvider;
