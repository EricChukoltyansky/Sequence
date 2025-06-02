// client/src/components/LeftBar/Icons.jsx - Modern Icons Component
import React from "react";
import styled from "styled-components";
import { GiDrumKit, GiGuitarBassHead } from "react-icons/gi";
import { CgPiano } from "react-icons/cg";
import { theme, helpers } from "../../theme";

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
    width: 90px;
  }
`;

const IconGroup = styled.div`
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

const TrackCount = styled.div`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.muted};
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.sm};
  margin-top: ${theme.spacing.xs};
`;

export default function Icons() {
  return (
    <IconsContainer>
      <IconGroup color={theme.colors.tracks.piano.primary}>
        <InstrumentIcon color={theme.colors.tracks.piano.primary}>
          <CgPiano />
        </InstrumentIcon>
        <InstrumentLabel color={theme.colors.tracks.piano.primary}>
          Piano
        </InstrumentLabel>
      </IconGroup>

      <IconGroup color={theme.colors.tracks.bass.primary}>
        <InstrumentIcon color={theme.colors.tracks.bass.primary}>
          <GiGuitarBassHead />
        </InstrumentIcon>
        <InstrumentLabel color={theme.colors.tracks.bass.primary}>
          Bass
        </InstrumentLabel>
      </IconGroup>

      <IconGroup color={theme.colors.tracks.drums.primary}>
        <InstrumentIcon color={theme.colors.tracks.drums.primary}>
          <GiDrumKit />
        </InstrumentIcon>
        <InstrumentLabel color={theme.colors.tracks.drums.primary}>
          Drums
        </InstrumentLabel>
      </IconGroup>
    </IconsContainer>
  );
}
