// client/src/components/Sequencer/Sequencer.jsx - Fixed Modern Layout
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { steps, lineMap, initialState } from "./initial";
import Grid from "./Grid";
import NavBar from "../NavBar/NavBar";
import PlayButton from "../buttons/PlayButton";
import StopButton from "../buttons/StopButton";
import Volume from "../sliders/Volume";
import BPM from "../sliders/BPM";
import PowerOn from "../buttons/PowerOn";
import ClearAllButton from "../buttons/ClearAllButton";
import PowerOff from "../buttons/PowerOff";
import InstructionsButton from "../buttons/InstructionsButton";
import Instructions from "../Instructions/Instructions";
import Icons from "../LeftBar/Icons";
import Braces from "../LeftBar/Braces";
import AuthForm from "../Login/Login/AuthForm";
import LoginRegisterButton from "../buttons/LoginRegister";
import SoundControls from "../SoundControls/SoundControls";
import RoomSelector from "../Room/RoomSelector";
import { theme } from "../../theme";

const SequencerContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${theme.colors.primary};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  /* Professional grid background */
  background-image: radial-gradient(
    circle at 25px 25px,
    rgba(255, 255, 255, 0.02) 2%,
    transparent 0%
  );
  background-size: 50px 50px;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  min-height: 0; /* Allow flex shrinking */
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(255, 255, 255, 0.08) 1px,
    transparent 0
  );
  background-size: 20px 20px;
`;

const SequencerGrid = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  position: relative;
  margin-left: 200px; /* Make room for icons and braces */

  ${theme.media.mobile} {
    padding: ${theme.spacing.sm};
    margin-left: 120px;
  }

  ${theme.media.tablet} {
    padding: ${theme.spacing.lg};
    margin-left: 160px;
  }

  /* Very small screens */
  @media (max-width: 480px) {
    margin-left: 80px;
    padding: ${theme.spacing.xs};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
`;

function Sequencer({
  players,
  socket,
  loadInstrument,
  initializeAudio,
  isAudioReady,
  getSoundSettings,
  updateSoundSettings,
  playSound,
  getEffects,
  updateEffects,
  currentRoom,
  onRoomChange,
  userCount,
}) {
  const [sequence, setSequence] = useState(initialState);
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sequencerVolume, setSequencerVolume] = useState(-12);
  const [BPMcount, setBPMCount] = useState(100);
  const [isShownInstructions, setIsShownInstructions] = useState(false);
  const [isShownLogin, setIsShownLogin] = useState(false);
  const [isShownRegister, setIsShownRegister] = useState(false);
  const [bassHit, setBassHit] = useState(false); // Track bass drum hits
  const [selectedInstruments, setSelectedInstruments] = useState({
    piano: "piano",
    bass: "bass",
    drums: "drums",
  });
  const [settingsCell, setSettingsCell] = useState(null); // { row, col } or null

  const loginRef = useRef();
  const registerRef = useRef();
  const audioInitialized = useRef(false);
  const stepRef = useRef(0);
  const serverOffsetRef = useRef(0);
  const transportRef = useRef({
    playing: false,
    bpm: 100,
    startTime: null,
    startStep: 0,
  });

  // Helpers for cell settings
  const getTrackTypeForRow = (row) => {
    if (row <= 4) return "piano";
    if (row <= 8) return "bass";
    return "drums";
  };

  const getInstrumentForRow = (row) => {
    return selectedInstruments[getTrackTypeForRow(row)];
  };

  const noteDisplayNames = {
    "F#": "F#", E: "E", "C#": "C#", A: "A", B: "B",
    OH: "Open Hi-hat", CH: "Closed Hi-hat", CP: "Clap/Snare", BD: "Kick",
  };

  const handleLoginRegisterClick = () => {
    setIsShownLogin(true);
    if (isShownLogin) {
      setIsShownLogin(false);
      setIsShownRegister(true);
    } else if (isShownRegister) {
      setIsShownRegister(false);
      setIsShownLogin(true);
    }
  };

  // All handler functions now use useCallback with inline logic for better performance
  const handleToggleStep = useCallback(
    (i, j) => {
      setSequence((prevSequence) => {
        const sequenceCopy = [...prevSequence];
        sequenceCopy[i] = [...sequenceCopy[i]];
        sequenceCopy[i][j] = {
          activated: !sequenceCopy[i][j].activated,
          settings: sequenceCopy[i][j].settings, // preserve per-cell settings
        };
        return sequenceCopy;
      });
      socket.emit("arm", { x: i, z: j });
    },
    [socket]
  );

  const handleSetPlaying = useCallback(
    async (switcher) => {
      // Initialize audio context on first play
      if (switcher && !audioInitialized.current && initializeAudio) {
        await initializeAudio();
        audioInitialized.current = true;
      }

      // Emit to server — server is the authoritative clock source
      // and will respond with transport:state to sync all clients
      socket.emit("switch", { tog: switcher });
    },
    [socket, initializeAudio]
  );

  const handleStopPlaying = useCallback(() => {
    // Emit to server — transport:state response will sync all clients
    socket.emit("rewind");
  }, [socket]);

  const handleReset = useCallback(() => {
    setSequence((prevSequence) => {
      const sequenceCopy = [...prevSequence];
      for (let i = 0; i < sequenceCopy.length; i++) {
        for (let j = 0; j < sequenceCopy[i].length; j++) {
          sequenceCopy[i][j] = { activated: false };
        }
      }
      return sequenceCopy;
    });
    // Emit to server — transport:state response will stop playback and reset step
    socket.emit("clearAll");
  }, [socket]);

  const handleVolume = useCallback((e) => {
    setSequencerVolume(e.target.value);
  }, []);

  const handleBPM = useCallback(
    (e) => {
      setBPMCount(e.target.value);
      socket.emit("BPM", { value: e.target.value });
    },
    [socket]
  );

  const handlePowerOn = useCallback(() => {
    setSequencerVolume(-60);
  }, []);

  const handlePowerOff = useCallback(() => {
    setSequencerVolume(-12);
  }, []);

  const handleInstrumentChange = useCallback(
    async (trackType, instrumentId) => {
      console.log(`Changing ${trackType} to ${instrumentId}`);

      // Load instrument if not already loaded (wait for it to complete)
      if (loadInstrument) {
        try {
          await loadInstrument(instrumentId);
          console.log(`${instrumentId} ready to play`);
        } catch (err) {
          console.error(`Failed to load instrument ${instrumentId}:`, err);
        }
      }

      setSelectedInstruments((prev) => ({
        ...prev,
        [trackType]: instrumentId,
      }));

      // Emit to socket for multiplayer sync
      socket.emit("instrumentChange", {
        track: trackType,
        instrument: instrumentId,
      });
    },
    [socket, loadInstrument]
  );

  // Reset local state when socket changes (room switch).
  // The server will send sequence:state + transport:state on connect.
  useEffect(() => {
    setSequence(initialState);
    setPlaying(false);
    setCurrentStep(0);
    stepRef.current = 0;
    transportRef.current = { playing: false, bpm: 100, startTime: null, startStep: 0 };
  }, [socket]);

  // Socket event handlers (cell toggles, sequence clear, BPM slider)
  useEffect(() => {
    const toggleMessage = (m) => {
      setSequence((prevSequence) => {
        const sequenceCopy = [...prevSequence];
        sequenceCopy[m.x] = [...sequenceCopy[m.x]];
        sequenceCopy[m.x][m.z] = {
          activated: !sequenceCopy[m.x][m.z].activated,
          settings: sequenceCopy[m.x][m.z].settings,
        };
        return sequenceCopy;
      });
    };

    const resetMessage = () => {
      setSequence((prevSequence) => {
        const sequenceCopy = [...prevSequence];
        for (let i = 0; i < sequenceCopy.length; i++) {
          for (let j = 0; j < sequenceCopy[i].length; j++) {
            sequenceCopy[i][j] = { activated: false };
          }
        }
        return sequenceCopy;
      });
    };

    const BPMmessage = (m) => {
      setBPMCount(m.value);
    };

    socket.on("arm", toggleMessage);
    socket.on("clearAll", resetMessage);
    socket.on("BPM", BPMmessage);

    // Receive full sequence from server (on join or full sync)
    const handleSequenceState = (seq) => {
      if (Array.isArray(seq)) {
        setSequence(seq);
      }
    };

    // Receive instrument changes from other users
    const handleInstrumentChange = (msg) => {
      setSelectedInstruments((prev) => ({
        ...prev,
        [msg.track]: msg.instrument,
      }));
    };

    socket.on("sequence:state", handleSequenceState);
    socket.on("sequence", handleSequenceState);
    socket.on("instrumentChange", handleInstrumentChange);

    return () => {
      socket.off("arm", toggleMessage);
      socket.off("clearAll", resetMessage);
      socket.off("BPM", BPMmessage);
      socket.off("sequence:state", handleSequenceState);
      socket.off("sequence", handleSequenceState);
      socket.off("instrumentChange", handleInstrumentChange);
    };
  }, [socket]);

  // ── Shared Transport Clock ──────────────────────────────────────
  // The server is the single source of truth for playback state.
  // On connect we measure the clock offset (NTP-lite), then derive
  // the step position from the server's reference timestamp so every
  // client hears the same beat at the same time.

  // Time-sync: measure offset between client and server clocks
  useEffect(() => {
    const offsets = [];
    let rounds = 0;
    const MAX_ROUNDS = 5;

    const handleSync = (data) => {
      const now = Date.now();
      const roundTrip = now - data.clientTime;
      const offset = data.serverTime - data.clientTime - roundTrip / 2;
      offsets.push(offset);
      rounds++;
      if (rounds < MAX_ROUNDS) {
        setTimeout(() => {
          socket.emit("time-sync", { clientTime: Date.now() });
        }, 50);
      } else {
        // Use median for robustness against outliers
        offsets.sort((a, b) => a - b);
        serverOffsetRef.current = offsets[Math.floor(offsets.length / 2)];
        console.log(
          `Clock sync complete. Offset: ${serverOffsetRef.current.toFixed(1)}ms`
        );
      }
    };

    socket.on("time-sync", handleSync);
    socket.emit("time-sync", { clientTime: Date.now() });

    return () => socket.off("time-sync", handleSync);
  }, [socket]);

  // Transport state listener — authoritative playback state from server
  useEffect(() => {
    const handleTransport = (state) => {
      transportRef.current = state;
      setPlaying(state.playing);
      setBPMCount(state.bpm);
      if (!state.playing) {
        stepRef.current = state.startStep;
        setCurrentStep(state.startStep);
      }
    };

    socket.on("transport:state", handleTransport);
    return () => socket.off("transport:state", handleTransport);
  }, [socket]);

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = async () => {
      if (!audioInitialized.current && initializeAudio) {
        await initializeAudio();
        audioInitialized.current = true;
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("keydown", handleFirstInteraction);
      }
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [initializeAudio]);

  // Main sequencer loop — driven by the server's shared transport clock.
  // Instead of counting steps locally with setInterval, we compute the
  // current step from the server's reference timestamp, ensuring all
  // connected clients stay in lockstep.
  useEffect(() => {
    if (!playing) return;

    // Poll at ~60 fps to detect step changes promptly.
    // At 150 BPM a 16th-note is 100ms, so 16ms polling is plenty accurate.
    const timer = setInterval(() => {
      const transport = transportRef.current;
      if (!transport.playing || !transport.startTime) return;

      const serverNow = Date.now() + serverOffsetRef.current;
      const stepDurationMs = 60000 / transport.bpm / 4;
      const elapsed = serverNow - transport.startTime;
      const computedStep =
        ((transport.startStep + Math.floor(elapsed / stepDurationMs)) % steps +
          steps) %
        steps;

      // Only fire sounds when we advance to a new step
      if (computedStep !== stepRef.current) {
        setSequence((prevSequence) => {
          for (let i = 0; i < prevSequence.length; i++) {
            if (prevSequence[i][computedStep].activated) {
              const noteName = lineMap[i];
              let instrumentId;
              if (i <= 4) instrumentId = selectedInstruments.piano;
              else if (i <= 8) instrumentId = selectedInstruments.bass;
              else instrumentId = selectedInstruments.drums;

              const cellSettings =
                prevSequence[i][computedStep].settings || null;
              playSound(instrumentId, noteName, sequencerVolume, cellSettings);
            }
          }
          return prevSequence; // same reference — no re-render
        });

        stepRef.current = computedStep;
        setCurrentStep(computedStep);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [playing, selectedInstruments, sequencerVolume, playSound]);

  // Modal click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setIsShownLogin(false);
      }
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        setIsShownRegister(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT") return; // Don't trigger when typing

      switch (e.key) {
        case " ":
          e.preventDefault();
          handleSetPlaying(!playing);
          break;
        case "Escape":
          if (isShownInstructions) setIsShownInstructions(false);
          else handleStopPlaying();
          break;
        case "Delete":
        case "Backspace":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleReset();
          }
          break;
        case "m":
        case "M":
          if (sequencerVolume === -60) {
            handlePowerOff();
          } else {
            handlePowerOn();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    playing,
    isShownInstructions,
    sequencerVolume,
    handleSetPlaying,
    handleStopPlaying,
    handleReset,
    handlePowerOff,
    handlePowerOn,
  ]);

  return (
    <SequencerContainer playing={playing} bpm={BPMcount}>
      <NavBar>
        <PlayButton
          playing={playing}
          onClick={() => handleSetPlaying(!playing)}
        />
        <StopButton onClick={handleStopPlaying} />
        {sequencerVolume === -60 ? (
          <PowerOff onClick={handlePowerOff} />
        ) : (
          <PowerOn onClick={handlePowerOn} />
        )}
        <ClearAllButton onClick={handleReset} />
        <Volume
          max="4"
          min="-60"
          step="2"
          type="range"
          value={sequencerVolume}
          onChange={handleVolume}
        />
        <BPM
          max="150"
          min="60"
          step="10"
          type="range"
          value={BPMcount}
          onChange={handleBPM}
        />
        <InstructionsButton onClick={() => setIsShownInstructions(true)} />
        <RoomSelector
          currentRoom={currentRoom}
          onRoomChange={onRoomChange}
          userCount={userCount}
        />
      </NavBar>

      <MainContent>
        {/* Left side - Instrument Icons (positioned absolutely) */}
        <Icons
          instruments={selectedInstruments}
          onInstrumentClick={handleInstrumentChange}
          getSoundSettings={getSoundSettings}
          updateSoundSettings={updateSoundSettings}
          playSound={playSound}
          getEffects={getEffects}
          updateEffects={updateEffects}
        />

        {/* Left side - Braces with Notes (positioned absolutely) */}
        <Braces />

        {/* Main sequencer grid */}
        <SequencerGrid>
          <Grid
            sequence={sequence}
            handleToggleStep={handleToggleStep}
            currentStep={currentStep}
            onCellSettingsClick={(row, col) => setSettingsCell({ row, col })}
          />
        </SequencerGrid>
      </MainContent>

      {/* Modals */}
      {isShownInstructions && (
        <Instructions onClose={() => setIsShownInstructions(false)} />
      )}

      {settingsCell && (() => {
        const { row, col } = settingsCell;
        const trackType = getTrackTypeForRow(row);
        const instrumentId = getInstrumentForRow(row);
        const noteName = lineMap[row];
        const noteDisplay = noteDisplayNames[noteName] || noteName;
        const instrumentName = instrumentId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const cellTitle = `${noteDisplay} — ${instrumentName} [${row + 1}, ${col + 1}]`;

        return (
          <SoundControls
            trackType={trackType}
            instrumentId={instrumentId}
            title={cellTitle}
            previewNote={noteName}
            getSoundSettings={() => {
              const cell = sequence[row]?.[col];
              return cell?.settings || getSoundSettings(instrumentId);
            }}
            updateSoundSettings={(id, newSettings) => {
              setSequence((prev) => {
                const copy = [...prev];
                copy[row] = [...copy[row]];
                copy[row][col] = {
                  ...copy[row][col],
                  settings: newSettings,
                };
                return copy;
              });
            }}
            playSound={playSound}
            onClose={() => setSettingsCell(null)}
          />
        );
      })()}

      {(isShownLogin || isShownRegister) && (
        <ModalOverlay>
          {isShownLogin && (
            <AuthForm
              mode="login"
              ref={loginRef}
              onToggleMode={handleLoginRegisterClick}
            />
          )}
          {isShownRegister && (
            <AuthForm
              mode="register"
              ref={registerRef}
              onToggleMode={handleLoginRegisterClick}
            />
          )}
        </ModalOverlay>
      )}
    </SequencerContainer>
  );
}

export default Sequencer;
