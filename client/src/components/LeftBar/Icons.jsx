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
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing["2xl"]};
  z-index: ${theme.zIndex.base + 1};

  ${theme.media.mobile} {
    left: 10px;
    width: 50px;
    gap: ${theme.spacing.xl};
  }
`;

const IconGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all ${theme.transitions.normal};
  position: relative;

  /* Height to match the brace sections */
  &:nth-child(1) {
    height: auto;
  } /* Piano */
  &:nth-child(2) {
    height: auto;
  } /* Bass */
  &:nth-child(3) {
    height: auto;
  } /* Drums */

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: scale(1.05);
    border-color: ${(props) => props.color}60;
  }

  ${theme.media.mobile} {
    padding: ${theme.spacing.md};
  }
`;

const InstrumentIcon = styled.div`
  font-size: 2rem;
  color: ${(props) => props.color};
  filter: drop-shadow(0 0 8px ${(props) => props.color}40);
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 15px ${(props) => props.color}80);
  }

  ${theme.media.mobile} {
    font-size: 1.5rem;
  }
`;

const InstrumentLabel = styled.span`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${(props) => props.color};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  opacity: 0.8;

  ${theme.media.mobile} {
    font-size: 10px;
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
