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

  const loginRef = useRef();
  const registerRef = useRef();
  const audioInitialized = useRef(false);
  const stepRef = useRef(0);

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
        const { triggered, activated } = sequenceCopy[i][j];
        sequenceCopy[i][j] = { triggered, activated: !activated };
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

      setPlaying(switcher);
      socket.emit("switch", { tog: switcher });
    },
    [socket, initializeAudio]
  );

  const handleStopPlaying = useCallback(() => {
    setSequence((prevSequence) => {
      const sequenceCopy = [...prevSequence];
      for (let i = 0; i < sequenceCopy.length; i++) {
        for (let j = 0; j < sequenceCopy[i].length; j++) {
          const { activated } = sequenceCopy[i][j];
          sequenceCopy[i][j] = { activated, triggered: false };
        }
      }
      return sequenceCopy;
    });
    stepRef.current = 0;
    setCurrentStep(0);
    setPlaying(false);
    socket.emit("rewind");
  }, [socket]);

  const handleReset = useCallback(() => {
    setSequence((prevSequence) => {
      const sequenceCopy = [...prevSequence];
      for (let i = 0; i < sequenceCopy.length; i++) {
        for (let j = 0; j < sequenceCopy[i].length; j++) {
          sequenceCopy[i][j] = { activated: false, triggered: false };
        }
      }
      return sequenceCopy;
    });
    stepRef.current = 0;
    setCurrentStep(0);
    setPlaying(false);
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

  // Socket event handlers - optimized with proper dependencies
  useEffect(() => {
    const toggleMessage = (m) => {
      setSequence((prevSequence) => {
        const sequenceCopy = [...prevSequence];
        const { triggered, activated } = sequenceCopy[m.x][m.z];
        sequenceCopy[m.x][m.z] = { triggered, activated: !activated };
        return sequenceCopy;
      });
    };

    const playPauseMessage = (m) => {
      setPlaying(m.tog);
    };

    const stopMessage = () => {
      setSequence((prevSequence) => {
        const sequenceCopy = [...prevSequence];
        for (let i = 0; i < sequenceCopy.length; i++) {
          for (let j = 0; j < sequenceCopy[i].length; j++) {
            const { activated } = sequenceCopy[i][j];
            sequenceCopy[i][j] = { activated, triggered: false };
          }
        }
        return sequenceCopy;
      });
      setCurrentStep(0);
      setPlaying(false);
    };

    const resetMessage = () => {
      setSequence((prevSequence) => {
        const sequenceCopy = [...prevSequence];
        for (let i = 0; i < sequenceCopy.length; i++) {
          for (let j = 0; j < sequenceCopy[i].length; j++) {
            sequenceCopy[i][j] = { activated: false, triggered: false };
          }
        }
        return sequenceCopy;
      });
      setCurrentStep(0);
      setPlaying(false);
    };

    const BPMmessage = (m) => {
      setBPMCount(m.value);
    };

    socket.on("arm", toggleMessage);
    socket.on("switch", playPauseMessage);
    socket.on("rewind", stopMessage);
    socket.on("clearAll", resetMessage);
    socket.on("BPM", BPMmessage);

    return () => {
      socket.off("arm", toggleMessage);
      socket.off("switch", playPauseMessage);
      socket.off("rewind", stopMessage);
      socket.off("clearAll", resetMessage);
      socket.off("BPM", BPMmessage);
    };
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

  // Main sequencer loop - using ref to avoid closure issues
  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      const currentStepValue = stepRef.current;
      console.log(`Timer tick - Step: ${currentStepValue}`);

      // Update sequence for visual indicator and play sounds
      setSequence((prevSequence) => {
        const sequenceCopy = [...prevSequence];

        for (let i = 0; i < sequenceCopy.length; i++) {
          for (let j = 0; j < sequenceCopy[i].length; j++) {
            const { activated } = sequenceCopy[i][j];
            // Set triggered for current column
            sequenceCopy[i][j] = { triggered: j === currentStepValue, activated };

            // Play sounds for activated cells at current step
            if (j === currentStepValue && activated) {
              let instrumentId;
              const noteName = lineMap[i];

              if (i <= 4) {
                instrumentId = selectedInstruments.piano;
              } else if (i <= 8) {
                instrumentId = selectedInstruments.bass;
              } else {
                instrumentId = selectedInstruments.drums;
              }

              // Trigger bass hit animation for kick drum (BD)
              if (noteName === "BD") {
                setBassHit(true);
                setTimeout(() => setBassHit(false), 100);
              }

              console.log(`Playing ${noteName} on ${instrumentId} at step ${currentStepValue}`);

              const instrumentPlayer = players[instrumentId];

              if (instrumentPlayer && instrumentPlayer.loaded) {
                instrumentPlayer.volume.value = sequencerVolume;
                const playerNode = instrumentPlayer.player(noteName);
                if (playerNode && playerNode.loaded) {
                  playerNode.start();
                }
              } else if (players.default) {
                players.default.volume.value = sequencerVolume;
                const defaultPlayer = players.default.player(noteName);
                if (defaultPlayer && defaultPlayer.loaded) {
                  defaultPlayer.start();
                }
              }
            }
          }
        }

        return sequenceCopy;
      });

      // Advance to next step
      stepRef.current = (currentStepValue + 1) % steps;
      setCurrentStep(stepRef.current);
    }, BPMcount);

    return () => clearInterval(timer);
  }, [playing, BPMcount, players, selectedInstruments, sequencerVolume]);

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
        <LoginRegisterButton onClick={handleLoginRegisterClick} />
      </NavBar>

      <MainContent>
        {/* Left side - Instrument Icons (positioned absolutely) */}
        <Icons
          instruments={selectedInstruments}
          onInstrumentClick={handleInstrumentChange}
        />

        {/* Left side - Braces with Notes (positioned absolutely) */}
        <Braces />

        {/* Main sequencer grid */}
        <SequencerGrid>
          <Grid sequence={sequence} handleToggleStep={handleToggleStep} />
        </SequencerGrid>
      </MainContent>

      {/* Modals */}
      {isShownInstructions && (
        <Instructions onClose={() => setIsShownInstructions(false)} />
      )}

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
