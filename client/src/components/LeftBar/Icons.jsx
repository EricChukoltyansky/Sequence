// client/src/components/LeftBar/Icons.jsx - Modern Icons Component
import React, { useState } from "react";
import styled from "styled-components";
import {
  GiDrumKit,
  GiGuitarBassHead,
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
} from "react-icons/gi";
import { CgPiano } from "react-icons/cg";
import { FaGuitar, FaDrum } from "react-icons/fa";
import { theme } from "../../theme";
import InstrumentPicker from "../InstrumentPicker/InstrumentPicker";

// Instrument definitions mapping
const instrumentData = {
  piano: { name: "Piano", icon: CgPiano },
  "grand-piano": { name: "Grand Piano", icon: GiGrandPiano },
  keyboard: { name: "Keyboard", icon: GiMusicalKeyboard },
  guitar: { name: "Guitar", icon: FaGuitar },
  "electric-guitar": { name: "Electric Guitar", icon: GiGuitar },
  banjo: { name: "Banjo", icon: GiBanjo },
  bass: { name: "Bass", icon: GiGuitarBassHead },
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

export default function Icons({ instruments, onInstrumentClick }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const handleIconClick = (trackType) => {
    setSelectedTrack(trackType);
    setShowPicker(true);
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
    </>
  );
}
