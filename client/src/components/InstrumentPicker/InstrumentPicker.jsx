import React, { useState } from "react";
import styled from "styled-components";
import { CgPiano } from "react-icons/cg";
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
import { FaGuitar, FaDrum } from "react-icons/fa";

const ModalOverlay = styled.div`
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
  z-index: 1050;
  padding: 1.5rem;
`;

const PickerContainer = styled.div`
  background: linear-gradient(
    135deg,
    rgba(30, 30, 40, 0.95) 0%,
    rgba(20, 20, 30, 0.95) 100%
  );
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    padding: 1rem;
    max-width: 90vw;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.25rem;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 0.25rem;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
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
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.color || "#ffffff"};
  text-shadow: 0 0 20px ${(props) => props.color || "#ffffff"}40;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
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
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    transform: rotate(90deg);
  }
`;

const InstrumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0.75rem;
  }
`;

const InstrumentCard = styled.button`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 100%
  );
  border: 2px solid
    ${(props) => (props.isSelected ? props.color : "rgba(255, 255, 255, 0.15)")};
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.isSelected &&
    `
    background: linear-gradient(
      135deg,
      ${props.color}20 0%,
      ${props.color}10 100%
    );
    box-shadow: 0 0 30px ${props.color}40, inset 0 0 20px ${props.color}20;
  `}

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0.06) 100%
    );
    border-color: ${(props) => props.color};
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
      0 0 20px ${(props) => props.color}40;
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const InstrumentIcon = styled.div`
  font-size: 3rem;
  color: ${(props) => props.color};
  filter: drop-shadow(0 0 12px ${(props) => props.color}60);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

  ${InstrumentCard}:hover & {
    transform: scale(1.15);
    filter: drop-shadow(0 0 20px ${(props) => props.color}80);
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const InstrumentName = styled.span`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.color};
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  text-shadow: 0 0 10px ${(props) => props.color}50;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${(props) => props.color};
  color: #0f0f0f;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

// Instrument definitions with icons and colors
const instruments = [
  { id: "piano", name: "Piano", icon: CgPiano, color: "#FFD700" },
  {
    id: "grand-piano",
    name: "Grand Piano",
    icon: GiGrandPiano,
    color: "#FFA500",
  },
  {
    id: "keyboard",
    name: "Keyboard",
    icon: GiMusicalKeyboard,
    color: "#FF8C00",
  },
  { id: "guitar", name: "Guitar", icon: FaGuitar, color: "#CD853F" },
  {
    id: "electric-guitar",
    name: "Electric Guitar",
    icon: GiGuitar,
    color: "#FF6B35",
  },
  { id: "banjo", name: "Banjo", icon: GiBanjo, color: "#D2691E" },
  { id: "bass", name: "Bass", icon: GiGuitarBassHead, color: "#00CED1" },
  { id: "drums", name: "Drums", icon: GiDrumKit, color: "#FF1493" },
  { id: "percussion", name: "Percussion", icon: FaDrum, color: "#FF69B4" },
  { id: "violin", name: "Violin", icon: GiViolin, color: "#8B4513" },
  { id: "saxophone", name: "Saxophone", icon: GiSaxophone, color: "#DAA520" },
  { id: "trumpet", name: "Trumpet", icon: GiTrumpet, color: "#FFD700" },
  { id: "flute", name: "Flute", icon: GiFlute, color: "#87CEEB" },
  { id: "clarinet", name: "Clarinet", icon: GiClarinet, color: "#4B0082" },
  { id: "harp", name: "Harp", icon: GiHarp, color: "#98FB98" },
];

export default function InstrumentPicker({
  onClose,
  trackType,
  currentInstrument,
  onSelectInstrument,
}) {
  const [selectedInstrument, setSelectedInstrument] =
    useState(currentInstrument);

  // Get color based on track type
  const getTrackColor = () => {
    switch (trackType) {
      case "piano":
        return "#ffd700";
      case "bass":
        return "#00bfff";
      case "drums":
        return "#ff1493";
      default:
        return "#ffffff";
    }
  };

  const trackColor = getTrackColor();

  const handleSelect = (instrumentId) => {
    setSelectedInstrument(instrumentId);
    onSelectInstrument(trackType, instrumentId);
    // Close after a short delay to show selection feedback
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <PickerContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title color={trackColor}>
            Select {trackType.charAt(0).toUpperCase() + trackType.slice(1)}{" "}
            Instrument
          </Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <InstrumentGrid>
          {instruments.map((instrument) => (
            <InstrumentCard
              key={instrument.id}
              color={instrument.color}
              isSelected={selectedInstrument === instrument.id}
              onClick={() => handleSelect(instrument.id)}
            >
              {selectedInstrument === instrument.id && (
                <SelectedBadge color={instrument.color}>✓</SelectedBadge>
              )}
              <InstrumentIcon color={instrument.color}>
                <instrument.icon />
              </InstrumentIcon>
              <InstrumentName color={instrument.color}>
                {instrument.name}
              </InstrumentName>
            </InstrumentCard>
          ))}
        </InstrumentGrid>
      </PickerContainer>
    </ModalOverlay>
  );
}
