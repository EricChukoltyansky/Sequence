import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { theme } from "../../theme";

// --- Styled Components ---

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
  padding: 1rem;
`;

const Panel = styled.div`
  background: linear-gradient(
    135deg,
    rgba(30, 30, 40, 0.97) 0%,
    rgba(20, 20, 30, 0.97) 100%
  );
  border: 2px solid ${(props) => props.color}60;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px ${(props) => props.color}20;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 1.2rem;
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
  width: 36px;
  height: 36px;
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

const EffectSection = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: ${(props) =>
    props.active
      ? `linear-gradient(135deg, ${props.color}12 0%, ${props.color}06 100%)`
      : "rgba(255, 255, 255, 0.02)"};
  border: 1px solid
    ${(props) =>
      props.active ? `${props.color}35` : "rgba(255, 255, 255, 0.06)"};
  transition: all 200ms ease;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
`;

const ToggleTrack = styled.div`
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: ${(props) =>
    props.active ? `${props.color}50` : "rgba(255, 255, 255, 0.12)"};
  position: relative;
  transition: background 200ms ease;
  flex-shrink: 0;
  cursor: pointer;

  &::after {
    content: "";
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${(props) => (props.active ? props.color : "#666")};
    position: absolute;
    top: 2px;
    left: ${(props) => (props.active ? "18px" : "2px")};
    transition: all 200ms ease;
    box-shadow: ${(props) =>
      props.active ? `0 0 8px ${props.color}60` : "none"};
  }
`;

const SectionTitle = styled.span`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(props) =>
    props.active ? props.color : theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  transition: color 200ms ease;
`;

const SectionDescription = styled.div`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 0.7rem;
  color: ${theme.colors.text.muted};
  margin-left: auto;
  font-style: italic;
`;

const Controls = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Label = styled.label`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 65px;
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${(props) => props.color};
    box-shadow: 0 0 8px ${(props) => props.color}50;
    cursor: pointer;
    transition: transform 150ms ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${(props) => props.color};
    box-shadow: 0 0 8px ${(props) => props.color}50;
    cursor: pointer;
    border: none;
  }
`;

const Value = styled.span`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.color};
  min-width: 55px;
  text-align: right;
`;

const FilterTypeRow = styled.div`
  display: flex;
  gap: 0.35rem;
  margin-bottom: 0.25rem;
`;

const FilterTypeBtn = styled.button`
  flex: 1;
  padding: 0.3rem 0;
  border-radius: 0.3rem;
  background: ${(props) =>
    props.active ? `${props.color}30` : "rgba(255, 255, 255, 0.05)"};
  border: 1px solid
    ${(props) =>
      props.active ? `${props.color}60` : "rgba(255, 255, 255, 0.1)"};
  color: ${(props) =>
    props.active ? props.color : theme.colors.text.muted};
  font-family: ${theme.typography.fontFamily.mono};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: ${(props) => props.color}20;
    border-color: ${(props) => props.color}40;
  }
`;

const PreviewButton = styled.button`
  width: 100%;
  padding: 0.65rem;
  margin-top: 0.75rem;
  border-radius: 0.5rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.color}30 0%,
    ${(props) => props.color}15 100%
  );
  border: 1px solid ${(props) => props.color}50;
  color: ${(props) => props.color};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 0.85rem;
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
  padding: 0.45rem;
  margin-top: 0.4rem;
  border-radius: 0.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: ${theme.colors.text.muted};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    color: ${theme.colors.text.secondary};
  }
`;

// --- Color mapping ---
function getTrackColor(trackType) {
  switch (trackType) {
    case "piano":
      return theme.colors.tracks.piano.primary;
    case "bass":
      return theme.colors.tracks.bass.primary;
    case "drums":
      return theme.colors.tracks.drums.primary;
    default:
      return "#ffffff";
  }
}

function getPreviewNote(trackType) {
  switch (trackType) {
    case "drums":
      return "BD";
    case "bass":
      return "E";
    default:
      return "E";
  }
}

// --- Component ---
export default function EffectsPanel({
  onClose,
  trackType,
  instrumentId,
  getEffects,
  updateEffects,
  playSound,
}) {
  const color = getTrackColor(trackType);
  const initial = getEffects(instrumentId);

  const [dist, setDist] = useState(initial.distortion);
  const [filt, setFilt] = useState(initial.filter);
  const [reverb, setReverb] = useState(initial.reverb);
  const [delay, setDelay] = useState(initial.delay);
  const [comp, setComp] = useState(initial.compressor);

  const apply = useCallback(
    (updates) => {
      const full = {
        distortion: updates.distortion || dist,
        filter: updates.filter || filt,
        reverb: updates.reverb || reverb,
        delay: updates.delay || delay,
        compressor: updates.compressor || comp,
      };
      updateEffects(instrumentId, full);
    },
    [instrumentId, updateEffects, dist, filt, reverb, delay, comp]
  );

  // --- Distortion handlers ---
  const toggleDist = () => {
    const next = { ...dist, enabled: !dist.enabled };
    setDist(next);
    apply({ distortion: next });
  };
  const changeDist = (e) => {
    const next = { ...dist, amount: Number(e.target.value) };
    setDist(next);
    apply({ distortion: next });
  };

  // --- Filter handlers ---
  const toggleFilter = () => {
    const next = { ...filt, enabled: !filt.enabled };
    setFilt(next);
    apply({ filter: next });
  };
  const changeFilterType = (type) => {
    const next = { ...filt, type };
    setFilt(next);
    apply({ filter: next });
  };
  const changeFilterFreq = (e) => {
    const next = { ...filt, frequency: Number(e.target.value) };
    setFilt(next);
    apply({ filter: next });
  };
  const changeFilterQ = (e) => {
    const next = { ...filt, Q: Number(e.target.value) };
    setFilt(next);
    apply({ filter: next });
  };

  // --- Reverb handlers ---
  const toggleReverb = () => {
    const next = { ...reverb, enabled: !reverb.enabled };
    setReverb(next);
    apply({ reverb: next });
  };
  const changeReverbMix = (e) => {
    const next = { ...reverb, mix: Number(e.target.value) };
    setReverb(next);
    apply({ reverb: next });
  };
  const changeReverbDecay = (e) => {
    const next = { ...reverb, decay: Number(e.target.value) };
    setReverb(next);
    apply({ reverb: next });
  };

  // --- Delay handlers ---
  const toggleDelay = () => {
    const next = { ...delay, enabled: !delay.enabled };
    setDelay(next);
    apply({ delay: next });
  };
  const changeDelayTime = (e) => {
    const next = { ...delay, time: Number(e.target.value) };
    setDelay(next);
    apply({ delay: next });
  };
  const changeDelayFeedback = (e) => {
    const next = { ...delay, feedback: Number(e.target.value) };
    setDelay(next);
    apply({ delay: next });
  };
  const changeDelayMix = (e) => {
    const next = { ...delay, mix: Number(e.target.value) };
    setDelay(next);
    apply({ delay: next });
  };

  // --- Compressor handlers ---
  const toggleComp = () => {
    const next = { ...comp, enabled: !comp.enabled };
    setComp(next);
    apply({ compressor: next });
  };
  const changeCompThresh = (e) => {
    const next = { ...comp, threshold: Number(e.target.value) };
    setComp(next);
    apply({ compressor: next });
  };
  const changeCompRatio = (e) => {
    const next = { ...comp, ratio: Number(e.target.value) };
    setComp(next);
    apply({ compressor: next });
  };

  // --- Preview / reset ---
  const handlePreview = () => {
    const note = getPreviewNote(trackType);
    playSound(instrumentId, note, -12);
  };

  const handleReset = () => {
    // Import won't work at top-level here easily, so just reset to disabled defaults
    const def = {
      distortion: { enabled: false, amount: 30 },
      filter: { enabled: false, type: "lowpass", frequency: 5000, Q: 1.0 },
      reverb: { enabled: false, mix: 30, decay: 2.0 },
      delay: { enabled: false, time: 250, feedback: 30, mix: 25 },
      compressor: { enabled: false, threshold: -24, ratio: 4 },
    };
    setDist(def.distortion);
    setFilt(def.filter);
    setReverb(def.reverb);
    setDelay(def.delay);
    setComp(def.compressor);
    updateEffects(instrumentId, def);
  };

  const instrumentName = instrumentId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Overlay onClick={onClose}>
      <Panel color={color} onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title color={color}>{instrumentName} — Effects</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        {/* Distortion */}
        <EffectSection active={dist.enabled} color={color}>
          <SectionHeader onClick={toggleDist}>
            <ToggleTrack active={dist.enabled} color={color} />
            <SectionTitle active={dist.enabled} color={color}>
              Distortion
            </SectionTitle>
            <SectionDescription>Overdrive / grit</SectionDescription>
          </SectionHeader>
          {dist.enabled && (
            <Controls>
              <ControlRow>
                <Label>Drive</Label>
                <Slider
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={dist.amount}
                  onChange={changeDist}
                  color={color}
                />
                <Value color={color}>{dist.amount}</Value>
              </ControlRow>
            </Controls>
          )}
        </EffectSection>

        {/* Filter */}
        <EffectSection active={filt.enabled} color={color}>
          <SectionHeader onClick={toggleFilter}>
            <ToggleTrack active={filt.enabled} color={color} />
            <SectionTitle active={filt.enabled} color={color}>
              Filter
            </SectionTitle>
            <SectionDescription>Tone shaping</SectionDescription>
          </SectionHeader>
          {filt.enabled && (
            <Controls>
              <FilterTypeRow>
                <FilterTypeBtn
                  active={filt.type === "lowpass"}
                  color={color}
                  onClick={() => changeFilterType("lowpass")}
                >
                  Low Pass
                </FilterTypeBtn>
                <FilterTypeBtn
                  active={filt.type === "highpass"}
                  color={color}
                  onClick={() => changeFilterType("highpass")}
                >
                  High Pass
                </FilterTypeBtn>
                <FilterTypeBtn
                  active={filt.type === "bandpass"}
                  color={color}
                  onClick={() => changeFilterType("bandpass")}
                >
                  Band Pass
                </FilterTypeBtn>
              </FilterTypeRow>
              <ControlRow>
                <Label>Cutoff</Label>
                <Slider
                  type="range"
                  min="100"
                  max="12000"
                  step="100"
                  value={filt.frequency}
                  onChange={changeFilterFreq}
                  color={color}
                />
                <Value color={color}>{filt.frequency} Hz</Value>
              </ControlRow>
              <ControlRow>
                <Label>Reso</Label>
                <Slider
                  type="range"
                  min="0.1"
                  max="15"
                  step="0.1"
                  value={filt.Q}
                  onChange={changeFilterQ}
                  color={color}
                />
                <Value color={color}>{filt.Q.toFixed(1)}</Value>
              </ControlRow>
            </Controls>
          )}
        </EffectSection>

        {/* Reverb */}
        <EffectSection active={reverb.enabled} color={color}>
          <SectionHeader onClick={toggleReverb}>
            <ToggleTrack active={reverb.enabled} color={color} />
            <SectionTitle active={reverb.enabled} color={color}>
              Reverb
            </SectionTitle>
            <SectionDescription>Space / ambiance</SectionDescription>
          </SectionHeader>
          {reverb.enabled && (
            <Controls>
              <ControlRow>
                <Label>Mix</Label>
                <Slider
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={reverb.mix}
                  onChange={changeReverbMix}
                  color={color}
                />
                <Value color={color}>{reverb.mix}%</Value>
              </ControlRow>
              <ControlRow>
                <Label>Decay</Label>
                <Slider
                  type="range"
                  min="0.3"
                  max="5"
                  step="0.1"
                  value={reverb.decay}
                  onChange={changeReverbDecay}
                  color={color}
                />
                <Value color={color}>{reverb.decay.toFixed(1)}s</Value>
              </ControlRow>
            </Controls>
          )}
        </EffectSection>

        {/* Delay */}
        <EffectSection active={delay.enabled} color={color}>
          <SectionHeader onClick={toggleDelay}>
            <ToggleTrack active={delay.enabled} color={color} />
            <SectionTitle active={delay.enabled} color={color}>
              Delay
            </SectionTitle>
            <SectionDescription>Echo / repeat</SectionDescription>
          </SectionHeader>
          {delay.enabled && (
            <Controls>
              <ControlRow>
                <Label>Time</Label>
                <Slider
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={delay.time}
                  onChange={changeDelayTime}
                  color={color}
                />
                <Value color={color}>{delay.time} ms</Value>
              </ControlRow>
              <ControlRow>
                <Label>Feedback</Label>
                <Slider
                  type="range"
                  min="0"
                  max="85"
                  step="1"
                  value={delay.feedback}
                  onChange={changeDelayFeedback}
                  color={color}
                />
                <Value color={color}>{delay.feedback}%</Value>
              </ControlRow>
              <ControlRow>
                <Label>Mix</Label>
                <Slider
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={delay.mix}
                  onChange={changeDelayMix}
                  color={color}
                />
                <Value color={color}>{delay.mix}%</Value>
              </ControlRow>
            </Controls>
          )}
        </EffectSection>

        {/* Compressor */}
        <EffectSection active={comp.enabled} color={color}>
          <SectionHeader onClick={toggleComp}>
            <ToggleTrack active={comp.enabled} color={color} />
            <SectionTitle active={comp.enabled} color={color}>
              Compressor
            </SectionTitle>
            <SectionDescription>Dynamic control</SectionDescription>
          </SectionHeader>
          {comp.enabled && (
            <Controls>
              <ControlRow>
                <Label>Thresh</Label>
                <Slider
                  type="range"
                  min="-60"
                  max="0"
                  step="1"
                  value={comp.threshold}
                  onChange={changeCompThresh}
                  color={color}
                />
                <Value color={color}>{comp.threshold} dB</Value>
              </ControlRow>
              <ControlRow>
                <Label>Ratio</Label>
                <Slider
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={comp.ratio}
                  onChange={changeCompRatio}
                  color={color}
                />
                <Value color={color}>{comp.ratio}:1</Value>
              </ControlRow>
            </Controls>
          )}
        </EffectSection>

        <PreviewButton color={color} onClick={handlePreview}>
          ▶ Preview Sound
        </PreviewButton>

        <ResetButton onClick={handleReset}>Reset All Effects</ResetButton>
      </Panel>
    </Overlay>
  );
}
