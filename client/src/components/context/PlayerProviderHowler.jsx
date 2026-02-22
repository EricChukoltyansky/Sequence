import { useState, useEffect, useRef, useCallback } from "react";
import { Howl, Howler } from "howler";
import {
  createEffectsChain,
  defaultEffectSettings,
  instrumentEffectPresets,
} from "../../audio/EffectsEngine";

const instrumentPaths = {
  piano: { "F#": "/sounds/piano/F%23.wav", E: "/sounds/piano/E.wav", "C#": "/sounds/piano/C%23.wav", A: "/sounds/piano/A.wav" },
  "grand-piano": { "F#": "/sounds/grand-piano/F%23.wav", E: "/sounds/grand-piano/E.wav", "C#": "/sounds/grand-piano/C%23.wav", A: "/sounds/grand-piano/A.wav" },
  keyboard: { "F#": "/sounds/keyboard/F%23.wav", E: "/sounds/keyboard/E.wav", "C#": "/sounds/keyboard/C%23.wav", A: "/sounds/keyboard/A.wav" },
  guitar: { "F#": "/sounds/guitar/F%23.wav", E: "/sounds/guitar/E.wav", "C#": "/sounds/guitar/C%23.wav", A: "/sounds/guitar/A.wav" },
  "electric-guitar": { "F#": "/sounds/electric-guitar/F%23.wav", E: "/sounds/electric-guitar/E.wav", "C#": "/sounds/electric-guitar/C%23.wav", A: "/sounds/electric-guitar/A.wav" },
  banjo: { "F#": "/sounds/banjo/F%23.wav", E: "/sounds/banjo/E.wav", "C#": "/sounds/banjo/C%23.wav", A: "/sounds/banjo/A.wav" },
  violin: { "F#": "/sounds/violin/F%23.wav", E: "/sounds/violin/E.wav", "C#": "/sounds/violin/C%23.wav", A: "/sounds/violin/A.wav" },
  harp: { "F#": "/sounds/harp/F%23.wav", E: "/sounds/harp/E.wav", "C#": "/sounds/harp/C%23.wav", A: "/sounds/harp/A.wav" },
  saxophone: { "F#": "/sounds/saxophone/F%23.wav", E: "/sounds/saxophone/E.wav", "C#": "/sounds/saxophone/C%23.wav", A: "/sounds/saxophone/A.wav" },
  trumpet: { "F#": "/sounds/trumpet/F%23.wav", E: "/sounds/trumpet/E.wav", "C#": "/sounds/trumpet/C%23.wav", A: "/sounds/trumpet/A.wav" },
  flute: { "F#": "/sounds/flute/F%23.wav", E: "/sounds/flute/E.wav", "C#": "/sounds/flute/C%23.wav", A: "/sounds/flute/A.wav" },
  clarinet: { "F#": "/sounds/clarinet/F%23.wav", E: "/sounds/clarinet/E.wav", "C#": "/sounds/clarinet/C%23.wav", A: "/sounds/clarinet/A.wav" },
  bass: { "F#": "/sounds/bass/F%23.wav", E: "/sounds/bass/E.wav", "C#": "/sounds/bass/C%23.wav", B: "/sounds/bass/B.wav" },
  "og-bass": { "F#": "/sounds/og-bass/F%23.wav", E: "/sounds/og-bass/E.wav", "C#": "/sounds/og-bass/C%23.wav", B: "/sounds/og-bass/B.wav" },
  drums: { OH: "/sounds/drums/hihat-open.wav", CH: "/sounds/drums/hihat-closed.wav", CP: "/sounds/drums/snare.wav", BD: "/sounds/drums/kick.wav" },
  percussion: { "F#": "/sounds/percussion/F%23.wav", E: "/sounds/percussion/E.wav", "C#": "/sounds/percussion/C%23.wav", A: "/sounds/percussion/A.wav" },
};

// Default sound settings per instrument
const defaultSoundSettings = {
  sustain: 220,   // ms before fade starts
  fade: 100,      // fade-out duration ms
  attack: 0,      // fade-in duration ms
  rate: 1.0,      // playback rate (0.5 = octave down, 2.0 = octave up)
  volume: 0,      // individual volume offset in dB (-20 to +6)
};

// Instrument-specific defaults
const instrumentDefaults = {
  drums:      { sustain: 150, fade: 50,  attack: 0,  rate: 1.0, volume: 0 },
  bass:       { sustain: 150, fade: 80,  attack: 0,  rate: 1.0, volume: 0 },
  percussion: { sustain: 180, fade: 60,  attack: 0,  rate: 1.0, volume: 0 },
  piano:      { sustain: 220, fade: 100, attack: 0,  rate: 1.0, volume: 0 },
};

const PlayerProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [soundSettingsVersion, setSoundSettingsVersion] = useState(0); // triggers re-render for UI
  const loadedInstruments = useRef(new Set());
  const soundCache = useRef({});
  const soundSettings = useRef({}); // { instrumentId: { sustain, fade, attack, rate, volume } }
  const effectsChains = useRef({}); // { instrumentId: EffectsChain }
  const effectsSettingsRef = useRef({}); // { instrumentId: full effects settings }
  const activeSources = useRef(new Map()); // key → { source, noteGain, cleanupTimer }
  const [effectsVersion, setEffectsVersion] = useState(0); // triggers re-render for effects UI

  // Get settings for an instrument (returns current or defaults)
  const getSoundSettings = useCallback((instrumentId) => {
    if (soundSettings.current[instrumentId]) {
      return { ...soundSettings.current[instrumentId] };
    }
    return { ...(instrumentDefaults[instrumentId] || defaultSoundSettings) };
  }, []);

  // Update settings for an instrument — live, immediate effect
  const updateSoundSettings = useCallback((instrumentId, newSettings) => {
    const current = getSoundSettings(instrumentId);
    soundSettings.current[instrumentId] = { ...current, ...newSettings };
    setSoundSettingsVersion((v) => v + 1); // notify UI
  }, [getSoundSettings]);

  // --- Effects chain management ---

  // Get or lazily create an effects chain for an instrument
  const getOrCreateChain = useCallback((instrumentId) => {
    if (effectsChains.current[instrumentId]) {
      return effectsChains.current[instrumentId];
    }
    const ctx = Howler.ctx;
    if (!ctx) return null;
    const chain = createEffectsChain(ctx);
    chain.output.connect(ctx.destination);
    // Apply any existing settings
    const settings = effectsSettingsRef.current[instrumentId];
    if (settings) chain.update(settings);
    effectsChains.current[instrumentId] = chain;
    return chain;
  }, []);

  // Get effects settings for an instrument
  const getEffects = useCallback((instrumentId) => {
    if (effectsSettingsRef.current[instrumentId]) {
      return JSON.parse(JSON.stringify(effectsSettingsRef.current[instrumentId]));
    }
    return JSON.parse(
      JSON.stringify(instrumentEffectPresets[instrumentId] || defaultEffectSettings)
    );
  }, []);

  // Update effects settings — live, applies to chain immediately
  const updateEffects = useCallback((instrumentId, newSettings) => {
    effectsSettingsRef.current[instrumentId] = JSON.parse(JSON.stringify(newSettings));
    const chain = getOrCreateChain(instrumentId);
    if (chain) chain.update(newSettings);
    setEffectsVersion((v) => v + 1);
  }, [getOrCreateChain]);

  // Create a Howl instance for a specific note (returns it from cache if already created)
  const createSound = useCallback((instrumentId, noteName) => {
    const key = `${instrumentId}-${noteName}`;
    
    if (soundCache.current[key]) {
      return soundCache.current[key];
    }

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

  // Preload all notes for a given instrument - returns a promise that resolves when all sounds are loaded
  const preloadInstrument = useCallback((instrumentId) => {
    const paths = instrumentPaths[instrumentId];
    if (!paths) return Promise.resolve();

    const promises = Object.keys(paths).map((noteName) => {
      const sound = createSound(instrumentId, noteName);
      // If already loaded (state === 'loaded'), resolve immediately
      if (sound.state() === "loaded") return Promise.resolve();
      return new Promise((resolve) => {
        sound.once("load", resolve);
        sound.once("loaderror", (id, err) => {
          console.warn(`Failed to preload ${instrumentId}/${noteName}:`, err);
          resolve(); // resolve anyway so we don't block
        });
      });
    });

    return Promise.all(promises);
  }, [createSound]);

  // Preload default instruments on mount
  useEffect(() => {
    const defaultInstruments = ["piano", "bass", "drums"];
    console.log("Preloading default instruments:", defaultInstruments.join(", "));

    Promise.all(defaultInstruments.map((id) => preloadInstrument(id))).then(() => {
      defaultInstruments.forEach((id) => loadedInstruments.current.add(id));
      console.log("All default instruments preloaded and ready");
      setIsLoading(false);
    });
  }, [preloadInstrument]);

  // Initialize audio on first user interaction
  const initializeAudio = useCallback(async () => {
    if (isAudioReady) return Promise.resolve();
    setIsAudioReady(true);
    console.log("Audio initialized");
    return Promise.resolve();
  }, [isAudioReady]);

  // Load instrument - actually preloads all its sounds
  const loadInstrument = useCallback((instrumentId) => {
    if (loadedInstruments.current.has(instrumentId)) {
      return Promise.resolve();
    }

    const available = Object.keys(instrumentPaths);
    if (!available.includes(instrumentId)) {
      console.warn(`Instrument ${instrumentId} not available - using piano`);
      loadedInstruments.current.add(instrumentId);
      return Promise.resolve();
    }

    console.log(`Preloading instrument: ${instrumentId}`);
    loadedInstruments.current.add(instrumentId);
    return preloadInstrument(instrumentId);
  }, [preloadInstrument]);

  // Play sound function — reads live settings from ref each time, or uses overrideSettings if provided
  // When effects are active for the instrument, uses raw Web Audio API to route through the effects chain
  const playSound = useCallback((instrumentId, noteName, volume = -12, overrideSettings = null) => {
    const sound = createSound(instrumentId, noteName);
    const settings = overrideSettings || soundSettings.current[instrumentId] || instrumentDefaults[instrumentId] || defaultSoundSettings;

    // Convert dB to 0-1 range, apply per-instrument volume offset
    const effectiveDb = volume + (settings.volume || 0);
    const normalizedVolume = Math.pow(10, effectiveDb / 20);
    const vol = Math.max(0, Math.min(1, normalizedVolume));

    // Check for active effects
    const chain = effectsChains.current[instrumentId];
    const hasEffects = chain && chain.hasAnyEnabled();

    const key = `${instrumentId}-${noteName}`;

    // Always stop previous Howler instance
    sound.stop();

    // Stop previous raw Web Audio source if exists
    if (activeSources.current.has(key)) {
      const prev = activeSources.current.get(key);
      try { prev.source.stop(); } catch (e) { /* already stopped */ }
      try { prev.source.disconnect(); } catch (e) { /* ok */ }
      try { prev.noteGain.disconnect(); } catch (e) { /* ok */ }
      clearTimeout(prev.cleanupTimer);
      activeSources.current.delete(key);
    }

    if (hasEffects && Howler.ctx && sound._buffer) {
      // === Effects path: raw Web Audio ===
      const ctx = Howler.ctx;
      const source = ctx.createBufferSource();
      source.buffer = sound._buffer;
      source.playbackRate.value = settings.rate || 1.0;

      const noteGain = ctx.createGain();
      source.connect(noteGain);
      noteGain.connect(chain.input);

      const now = ctx.currentTime;
      const attackSec = (settings.attack || 0) / 1000;
      const sustainSec = (settings.sustain || 220) / 1000;
      const fadeSec = (settings.fade || 100) / 1000;

      if (attackSec > 0) {
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(vol, now + attackSec);
      } else {
        noteGain.gain.setValueAtTime(vol, now);
      }

      // Schedule sustain hold then fade out
      const fadeStart = now + attackSec + sustainSec;
      noteGain.gain.setValueAtTime(vol, fadeStart);
      noteGain.gain.linearRampToValueAtTime(0.001, fadeStart + fadeSec);

      source.start(0);

      // Cleanup after fade + extra time for reverb/delay tails
      const totalMs = (attackSec + sustainSec + fadeSec) * 1000 + 3000;
      const cleanupTimer = setTimeout(() => {
        try { source.stop(); } catch (e) { /* ok */ }
        try { source.disconnect(); } catch (e) { /* ok */ }
        try { noteGain.disconnect(); } catch (e) { /* ok */ }
        activeSources.current.delete(key);
      }, totalMs);

      activeSources.current.set(key, { source, noteGain, cleanupTimer });
    } else {
      // === Normal path: Howler ===
      sound.rate(settings.rate || 1.0);

      if (settings.attack > 0) {
        sound.volume(0);
        const id = sound.play();
        sound.fade(0, vol, settings.attack, id);
        setTimeout(() => {
          sound.fade(vol, 0, settings.fade || 100, id);
        }, (settings.attack || 0) + (settings.sustain || 220));
      } else {
        sound.volume(vol);
        const id = sound.play();
        setTimeout(() => {
          sound.fade(vol, 0, settings.fade || 100, id);
        }, settings.sustain || 220);
      }
    }
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

  // Loading is handled by the preloadInstrument useEffect above

  return children({
    players: players.current,
    loadInstrument: (id) => {
      addInstrument(id);
      return loadInstrument(id);
    },
    isLoading,
    initializeAudio,
    isAudioReady,
    getSoundSettings,
    updateSoundSettings,
    playSound,
    getEffects,
    updateEffects,
  });
};

export default PlayerProvider;
