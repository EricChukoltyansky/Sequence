import React, { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import { theme } from "../../theme";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: 1.5rem;
`;

const Panel = styled.div`
  background: linear-gradient(
    135deg,
    rgba(30, 30, 40, 0.97) 0%,
    rgba(20, 20, 30, 0.97) 100%
  );
  border: 2px solid ${(props) => props.color}60;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px ${(props) => props.color}20;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(props) => props.color};
  text-shadow: 0 0 20px ${(props) => props.color}40;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #808080;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: all 250ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    transform: rotate(90deg);
  }
`;

const ControlGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const ControlHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Value = styled.span`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(props) => props.color};
  min-width: 60px;
  text-align: right;
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${(props) => props.color};
    box-shadow: 0 0 10px ${(props) => props.color}60;
    cursor: pointer;
    transition: transform 150ms ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${(props) => props.color};
    box-shadow: 0 0 10px ${(props) => props.color}60;
    cursor: pointer;
    border: none;
  }

  &::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 3px;
  }
`;

const PreviewButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.color}30 0%,
    ${(props) => props.color}15 100%
  );
  border: 1px solid ${(props) => props.color}50;
  color: ${(props) => props.color};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    background: linear-gradient(
      135deg,
      ${(props) => props.color}50 0%,
      ${(props) => props.color}25 100%
    );
    transform: translateY(-1px);
    box-shadow: 0 4px 16px ${(props) => props.color}30;
  }

  &:active {
    transform: translateY(0);
  }
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: ${theme.colors.text.muted};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    color: ${theme.colors.text.secondary};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 1rem 0;
`;

const Description = styled.div`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 0.75rem;
  color: ${theme.colors.text.muted};
  margin-top: 0.25rem;
`;

// Default settings to reset to
const defaultSettings = {
  drums:      { sustain: 150, fade: 50,  attack: 0,  rate: 1.0, volume: 0 },
  bass:       { sustain: 150, fade: 80,  attack: 0,  rate: 1.0, volume: 0 },
  percussion: { sustain: 180, fade: 60,  attack: 0,  rate: 1.0, volume: 0 },
};
const genericDefault = { sustain: 220, fade: 100, attack: 0, rate: 1.0, volume: 0 };

// Track color mapping
function getTrackColor(trackType) {
  switch (trackType) {
    case "piano": return theme.colors.tracks.piano.primary;
    case "bass": return theme.colors.tracks.bass.primary;
    case "drums": return theme.colors.tracks.drums.primary;
    default: return "#ffffff";
  }
}

// Determine which note to preview
function getPreviewNote(trackType) {
  switch (trackType) {
    case "drums": return "BD";
    case "bass": return "E";
    default: return "E";
  }
}

export default function SoundControls({
  onClose,
  trackType,
  instrumentId,
  getSoundSettings,
  updateSoundSettings,
  playSound,
  title: customTitle,
  previewNote: customPreviewNote,
}) {
  const color = getTrackColor(trackType);
  const initial = getSoundSettings(instrumentId);

  const [sustain, setSustain] = useState(initial.sustain);
  const [fade, setFade] = useState(initial.fade);
  const [attack, setAttack] = useState(initial.attack);
  const [rate, setRate] = useState(initial.rate);
  const [volume, setVolume] = useState(initial.volume);

  // Apply settings live on every change
  const applySettings = useCallback(
    (s) => {
      updateSoundSettings(instrumentId, s);
    },
    [instrumentId, updateSoundSettings]
  );

  const handleSustain = (e) => {
    const v = Number(e.target.value);
    setSustain(v);
    applySettings({ sustain: v, fade, attack, rate, volume });
  };

  const handleFade = (e) => {
    const v = Number(e.target.value);
    setFade(v);
    applySettings({ sustain, fade: v, attack, rate, volume });
  };

  const handleAttack = (e) => {
    const v = Number(e.target.value);
    setAttack(v);
    applySettings({ sustain, fade, attack: v, rate, volume });
  };

  const handleRate = (e) => {
    const v = Number(e.target.value);
    setRate(v);
    applySettings({ sustain, fade, attack, rate: v, volume });
  };

  const handleVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    applySettings({ sustain, fade, attack, rate, volume: v });
  };

  const handlePreview = () => {
    const note = customPreviewNote || getPreviewNote(trackType);
    // Pass current settings explicitly so preview always uses latest slider values
    playSound(instrumentId, note, -12, { sustain, fade, attack, rate, volume });
  };

  const handleReset = () => {
    const def = defaultSettings[instrumentId] || genericDefault;
    setSustain(def.sustain);
    setFade(def.fade);
    setAttack(def.attack);
    setRate(def.rate);
    setVolume(def.volume);
    applySettings(def);
  };

  return (
    <Overlay onClick={onClose}>
      <Panel color={color} onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title color={color}>
            {customTitle || `${instrumentId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — Sound Controls`}
          </Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <ControlGroup>
          <ControlHeader>
            <Label>Sustain</Label>
            <Value color={color}>{sustain} ms</Value>
          </ControlHeader>
          <SliderRow>
            <Slider
              type="range"
              min="20"
              max="1000"
              step="10"
              value={sustain}
              onChange={handleSustain}
              color={color}
            />
          </SliderRow>
          <Description>How long the note holds before fading</Description>
        </ControlGroup>

        <ControlGroup>
          <ControlHeader>
            <Label>Fade Out</Label>
            <Value color={color}>{fade} ms</Value>
          </ControlHeader>
          <SliderRow>
            <Slider
              type="range"
              min="10"
              max="500"
              step="10"
              value={fade}
              onChange={handleFade}
              color={color}
            />
          </SliderRow>
          <Description>How quickly the note fades to silence</Description>
        </ControlGroup>

        <ControlGroup>
          <ControlHeader>
            <Label>Attack</Label>
            <Value color={color}>{attack} ms</Value>
          </ControlHeader>
          <SliderRow>
            <Slider
              type="range"
              min="0"
              max="300"
              step="5"
              value={attack}
              onChange={handleAttack}
              color={color}
            />
          </SliderRow>
          <Description>Fade-in time — 0 for instant, higher for softer onset</Description>
        </ControlGroup>

        <Divider />

        <ControlGroup>
          <ControlHeader>
            <Label>Pitch / Speed</Label>
            <Value color={color}>{rate.toFixed(2)}x</Value>
          </ControlHeader>
          <SliderRow>
            <Slider
              type="range"
              min="0.25"
              max="2.0"
              step="0.05"
              value={rate}
              onChange={handleRate}
              color={color}
            />
          </SliderRow>
          <Description>Playback speed — lower = deeper, higher = brighter</Description>
        </ControlGroup>

        <ControlGroup>
          <ControlHeader>
            <Label>Volume Offset</Label>
            <Value color={color}>{volume > 0 ? "+" : ""}{volume} dB</Value>
          </ControlHeader>
          <SliderRow>
            <Slider
              type="range"
              min="-20"
              max="6"
              step="1"
              value={volume}
              onChange={handleVolume}
              color={color}
            />
          </SliderRow>
          <Description>Per-instrument volume boost/cut</Description>
        </ControlGroup>

        <PreviewButton color={color} onClick={handlePreview}>
          ▶ Preview Sound
        </PreviewButton>

        <ResetButton onClick={handleReset}>
          Reset to Defaults
        </ResetButton>
      </Panel>
    </Overlay>
  );
}
