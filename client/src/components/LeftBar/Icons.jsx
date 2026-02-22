// client/src/components/LeftBar/Icons.jsx - Modern Icons Component
import React, { useState } from "react";
import styled from "styled-components";
import {
  GiDrumKit,
  GiGuitarBassHead,
  GiElectric,
  GiViolin,
  GiSaxophone,
  GiTrumpet,
  GiFlute,
  GiGrandPiano,
  GiGuitar,
  GiClarinet,
  GiHarp,
  GiMusicalKeyboard,
  GiBanjo,
  GiFairyWand,
} from "react-icons/gi";
import { CgPiano } from "react-icons/cg";
import { FaGuitar, FaDrum } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { theme } from "../../theme";
import InstrumentPicker from "../InstrumentPicker/InstrumentPicker";
import SoundControls from "../SoundControls/SoundControls";
import EffectsPresetsPanel from "../EffectsPanel/EffectsPresetsPanel";

// Instrument definitions mapping
const instrumentData = {
  piano: { name: "Piano", icon: CgPiano },
  "grand-piano": { name: "Grand Piano", icon: GiGrandPiano },
  keyboard: { name: "Keyboard", icon: GiMusicalKeyboard },
  guitar: { name: "Guitar", icon: FaGuitar },
  "electric-guitar": { name: "Electric Guitar", icon: GiGuitar },
  banjo: { name: "Banjo", icon: GiBanjo },
  bass: { name: "Bass", icon: GiGuitarBassHead },
  "og-bass": { name: "Electro Bass", icon: GiElectric },
  drums: { name: "Drums", icon: GiDrumKit },
  percussion: { name: "Percussion", icon: FaDrum },
  violin: { name: "Violin", icon: GiViolin },
  saxophone: { name: "Saxophone", icon: GiSaxophone },
  trumpet: { name: "Trumpet", icon: GiTrumpet },
  flute: { name: "Flute", icon: GiFlute },
  clarinet: { name: "Clarinet", icon: GiClarinet },
  harp: { name: "Harp", icon: GiHarp },
};

const IconsContainer = styled.div`
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: ${theme.zIndex.base + 2};

  ${theme.media.mobile} {
    left: 15px;
    width: 80px;
  }

  /* Very small screens */
  @media (max-width: 480px) {
    left: 10px;
    width: 60px;
  }
`;

const IconGroup = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius["2xl"]};
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  transition: all ${theme.transitions.normal};
  position: relative;
  cursor: pointer;

  /* Height to match brace sections proportionally */
  &:nth-child(1) {
    flex: 5; /* Piano - 5 tracks */
    margin-bottom: ${theme.spacing.md};
  }
  &:nth-child(2) {
    flex: 4; /* Bass - 4 tracks */
    margin-bottom: ${theme.spacing.md};
  }
  &:nth-child(3) {
    flex: 4; /* Drums - 4 tracks */
  }

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0.06) 100%
    );
    transform: scale(1.05) translateX(5px);
    border-color: ${(props) => props.color}60;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 20px ${(props) => props.color}30;
  }

  ${theme.media.mobile} {
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.xl};
  }
`;

const InstrumentIcon = styled.div`
  font-size: 2.5rem;
  color: ${(props) => props.color};
  filter: drop-shadow(0 0 12px ${(props) => props.color}60);
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: scale(1.15) rotate(5deg);
    filter: drop-shadow(0 0 20px ${(props) => props.color}80);
  }

  ${theme.media.mobile} {
    font-size: 2rem;
  }
`;

const InstrumentLabel = styled.span`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${(props) => props.color};
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  text-shadow: 0 0 10px ${(props) => props.color}50;
  opacity: 0.9;

  ${theme.media.mobile} {
    font-size: ${theme.typography.fontSize.xs};
    letter-spacing: 0.5px;
  }
`;

const ClickHint = styled.div`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.muted};
  opacity: 0;
  transition: opacity ${theme.transitions.normal};
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  pointer-events: none;

  ${IconGroup}:hover & {
    opacity: 0.7;
  }
`;

const SettingsButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: ${theme.colors.text.muted};
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all ${theme.transitions.normal};
  z-index: 2;

  ${IconGroup}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: ${(props) => props.color};
    transform: rotate(60deg) scale(1.1);
    box-shadow: 0 0 12px ${(props) => props.color}40;
  }
`;

const MagicButton = styled.button`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: ${theme.colors.text.muted};
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all ${theme.transitions.normal};
  z-index: 2;

  ${IconGroup}:hover & {
    opacity: 1;
  }

  &:hover {
    background: linear-gradient(135deg, ${(props) => props.color}30, ${(props) => props.color}15);
    color: ${(props) => props.color};
    transform: rotate(-15deg) scale(1.15);
    box-shadow: 0 0 14px ${(props) => props.color}50;
    border-color: ${(props) => props.color}60;
  }
`;

export default function Icons({
  instruments,
  onInstrumentClick,
  getSoundSettings,
  updateSoundSettings,
  playSound,
  getEffects,
  updateEffects,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [showSoundControls, setShowSoundControls] = useState(false);
  const [showEffectsPresets, setShowEffectsPresets] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const handleIconClick = (trackType) => {
    setSelectedTrack(trackType);
    setShowPicker(true);
  };

  const handleSettingsClick = (e, trackType) => {
    e.stopPropagation();
    setSelectedTrack(trackType);
    setShowSoundControls(true);
  };

  const handleMagicClick = (e, trackType) => {
    e.stopPropagation();
    setSelectedTrack(trackType);
    setShowEffectsPresets(true);
  };

  const handleSelectInstrument = (trackType, instrumentId) => {
    if (onInstrumentClick) {
      onInstrumentClick(trackType, instrumentId);
    }
  };

  const getCurrentInstrument = (trackType) => {
    return instruments?.[trackType] || trackType;
  };

  const getInstrumentData = (trackType) => {
    const instrumentId = getCurrentInstrument(trackType);
    return instrumentData[instrumentId] || instrumentData[trackType];
  };

  const pianoInstrument = getInstrumentData("piano");
  const bassInstrument = getInstrumentData("bass");
  const drumsInstrument = getInstrumentData("drums");

  return (
    <>
      <IconsContainer>
        <IconGroup
          color={theme.colors.tracks.piano.primary}
          onClick={() => handleIconClick("piano")}
        >
          <SettingsButton
            color={theme.colors.tracks.piano.primary}
            onClick={(e) => handleSettingsClick(e, "piano")}
            title="Sound Controls"
          >
            <IoSettingsSharp />
          </SettingsButton>
          <MagicButton
            color={theme.colors.tracks.piano.primary}
            onClick={(e) => handleMagicClick(e, "piano")}
            title="Effects & Presets"
          >
            <GiFairyWand />
          </MagicButton>
          <InstrumentIcon color={theme.colors.tracks.piano.primary}>
            <pianoInstrument.icon />
          </InstrumentIcon>
          <InstrumentLabel color={theme.colors.tracks.piano.primary}>
            {pianoInstrument.name}
          </InstrumentLabel>
          <ClickHint>Click to change</ClickHint>
        </IconGroup>

        <IconGroup
          color={theme.colors.tracks.bass.primary}
          onClick={() => handleIconClick("bass")}
        >
          <SettingsButton
            color={theme.colors.tracks.bass.primary}
            onClick={(e) => handleSettingsClick(e, "bass")}
            title="Sound Controls"
          >
            <IoSettingsSharp />
          </SettingsButton>
          <MagicButton
            color={theme.colors.tracks.bass.primary}
            onClick={(e) => handleMagicClick(e, "bass")}
            title="Effects & Presets"
          >
            <GiFairyWand />
          </MagicButton>
          <InstrumentIcon color={theme.colors.tracks.bass.primary}>
            <bassInstrument.icon />
          </InstrumentIcon>
          <InstrumentLabel color={theme.colors.tracks.bass.primary}>
            {bassInstrument.name}
          </InstrumentLabel>
          <ClickHint>Click to change</ClickHint>
        </IconGroup>

        <IconGroup
          color={theme.colors.tracks.drums.primary}
          onClick={() => handleIconClick("drums")}
        >
          <SettingsButton
            color={theme.colors.tracks.drums.primary}
            onClick={(e) => handleSettingsClick(e, "drums")}
            title="Sound Controls"
          >
            <IoSettingsSharp />
          </SettingsButton>
          <MagicButton
            color={theme.colors.tracks.drums.primary}
            onClick={(e) => handleMagicClick(e, "drums")}
            title="Effects & Presets"
          >
            <GiFairyWand />
          </MagicButton>
          <InstrumentIcon color={theme.colors.tracks.drums.primary}>
            <drumsInstrument.icon />
          </InstrumentIcon>
          <InstrumentLabel color={theme.colors.tracks.drums.primary}>
            {drumsInstrument.name}
          </InstrumentLabel>
          <ClickHint>Click to change</ClickHint>
        </IconGroup>
      </IconsContainer>

      {showPicker && (
        <InstrumentPicker
          onClose={() => setShowPicker(false)}
          trackType={selectedTrack}
          currentInstrument={getCurrentInstrument(selectedTrack)}
          onSelectInstrument={handleSelectInstrument}
        />
      )}

      {showSoundControls && selectedTrack && (
        <SoundControls
          trackType={selectedTrack}
          instrumentId={getCurrentInstrument(selectedTrack)}
          getSoundSettings={getSoundSettings}
          updateSoundSettings={updateSoundSettings}
          playSound={playSound}
          onClose={() => setShowSoundControls(false)}
        />
      )}

      {showEffectsPresets && selectedTrack && (
        <EffectsPresetsPanel
          trackType={selectedTrack}
          instrumentId={getCurrentInstrument(selectedTrack)}
          getEffects={getEffects}
          updateEffects={updateEffects}
          getSoundSettings={getSoundSettings}
          updateSoundSettings={updateSoundSettings}
          playSound={playSound}
          onClose={() => setShowEffectsPresets(false)}
        />
      )}
    </>
  );
}
