// client/src/components/Sequencer/Sequencer.jsx - Fixed Modern Layout
import React, { useState, useEffect, useRef } from "react";
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
import RightBar from "../RightBar/RightBar";
import InstructionsButton from "../buttons/InstructionsButton";
import Instructions from "../Instructions/Instructions";
import Icons from "../LeftBar/Icons";
import Braces from "../LeftBar/Braces";
import AuthForm from "../Login/Login/AuthForm";
import LoginRegisterButton from "../buttons/LoginRegister";
import { theme, helpers } from "../../theme";

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
    padding: ${theme.spacing.md};
    margin-left: 150px;
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

function Sequencer({ player, socket }) {
  const [sequence, setSequence] = useState(initialState);
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sequencerVolume, setSequencerVolume] = useState(-12);
  const [BPMcount, setBPMCount] = useState(100);
  const [isShownInstructions, setIsShownInstructions] = useState(false);
  const [isShownLogin, setIsShownLogin] = useState(false);
  const [isShownRegister, setIsShownRegister] = useState(false);

  const loginRef = useRef();
  const registerRef = useRef();

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

  const resetSequence = () => {
    for (let i = 0; i < sequence.length; i++) {
      for (let j = 0; j < sequence[i].length; j++) {
        sequence[i][j] = { activated: false, triggered: false };
      }
    }
    setSequence(sequence);
  };

  const stopSequence = () => {
    const sequenceCopy = [...sequence];
    for (let i = 0; i < sequenceCopy.length; i++) {
      for (let j = 0; j < sequenceCopy[i].length; j++) {
        const { activated } = sequenceCopy[i][j];
        sequenceCopy[i][j] = { activated, triggered: false };
      }
    }
    setSequence(sequenceCopy);
  };

  const toggleStep = (line, step) => {
    const sequenceCopy = [...sequence];
    const { triggered, activated } = sequenceCopy[line][step];
    sequenceCopy[line][step] = { triggered, activated: !activated };
    setSequence(sequenceCopy);
  };

  const nextStep = (time) => {
    for (let i = 0; i < sequence.length; i++) {
      for (let j = 0; j < sequence[i].length; j++) {
        const { triggered, activated } = sequence[i][j];
        sequence[i][j] = { triggered: j === time, activated };
        if (triggered && activated) {
          player.volume.value = sequencerVolume;
          player.player(lineMap[i]).start();
        }
      }
    }
    setSequence(sequence);
  };

  const handleToggleStep = (i, j) => {
    socket.emit("arm", { x: i, z: j });
    socket.emit("sequence", { sequence });
  };

  const handleSetPlaying = (switcher) => {
    socket.emit("switch", { tog: switcher });
  };

  const handleStopPlaying = () => {
    socket.emit("rewind");
  };

  const handleReset = () => {
    socket.emit("clearAll");
  };

  const handleVolume = (e) => {
    setSequencerVolume(e.target.value);
  };

  const handleBPM = (e) => {
    setBPMCount(e.target.value);
    socket.emit("BPM", { value: e.target.value });
  };

  const handlePowerOn = () => {
    setSequencerVolume(-60);
  };

  const handlePowerOff = () => {
    setSequencerVolume(-12);
  };

  // Socket event handlers
  useEffect(() => {
    const toggleMessage = (m) => {
      toggleStep(m.x, m.z);
    };
    const playPauseMessage = (m) => {
      setPlaying(m.tog);
    };
    const stopMessage = () => {
      stopSequence();
      setCurrentStep(0);
      setPlaying(false);
    };
    const resetMessage = () => {
      resetSequence();
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
  }, []);

  // Main sequencer loop and modal handlers
  useEffect(() => {
    const timer = setTimeout(() => {
      if (playing) {
        setCurrentStep((currentStep + 1) % steps);
        nextStep(currentStep);
      }
    }, BPMcount);

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
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentStep, playing, BPMcount, sequence]);

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
  }, [playing, isShownInstructions, sequencerVolume]);

  return (
    <SequencerContainer>
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
        <Icons />

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
