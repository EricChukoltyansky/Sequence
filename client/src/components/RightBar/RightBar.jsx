import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

const LabelBar = styled.div`
  height: calc(100vh - 80px);
  left: calc(100vw - 9.5vw);
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  position: absolute;
  padding: ${theme.spacing.lg} 0;
  z-index: ${theme.zIndex.base};
`;

const TrackLabel = styled.div`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: calc(${theme.typography.fontSize.sm} + 0.2vw);
  font-weight: ${theme.typography.fontWeight.semibold};
  text-align: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.normal};
  cursor: default;
  user-select: none;
  position: relative;

  ${helpers.glassmorphism("rgba(255, 255, 255, 0.03)")}
  border: 1px solid rgba(255, 255, 255, 0.06);

  &:hover {
    transform: translateX(-2px) scale(1.05);
    ${helpers.glassmorphism("rgba(255, 255, 255, 0.06)")}
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: currentColor;
    border-radius: 0 ${theme.borderRadius.sm} ${theme.borderRadius.sm} 0;
    opacity: 0.7;
  }

  ${theme.media.mobile} {
    font-size: ${theme.typography.fontSize.xs};
    padding: 2px 4px;
  }
`;

const PianoLabel = styled(TrackLabel)`
  color: ${theme.colors.tracks.piano.primary};
  box-shadow: ${helpers.glow(theme.colors.tracks.piano.primary, 5)};

  &:hover {
    box-shadow: ${helpers.glow(theme.colors.tracks.piano.primary, 12)};
  }
`;

const BassLabel = styled(TrackLabel)`
  color: ${theme.colors.tracks.bass.primary};
  box-shadow: ${helpers.glow(theme.colors.tracks.bass.primary, 5)};

  &:hover {
    box-shadow: ${helpers.glow(theme.colors.tracks.bass.primary, 12)};
  }
`;

const DrumsLabel = styled(TrackLabel)`
  color: ${theme.colors.tracks.drums.primary};
  box-shadow: ${helpers.glow(theme.colors.tracks.drums.primary, 5)};

  &:hover {
    box-shadow: ${helpers.glow(theme.colors.tracks.drums.primary, 12)};
  }
`;

export default function RightBar() {
  return (
    <LabelBar>
      <PianoLabel>F#</PianoLabel>
      <PianoLabel>E</PianoLabel>
      <PianoLabel>C#</PianoLabel>
      <PianoLabel>A</PianoLabel>
      <PianoLabel>F#</PianoLabel>
      <BassLabel>F#</BassLabel>
      <BassLabel>E</BassLabel>
      <BassLabel>C#</BassLabel>
      <BassLabel>B</BassLabel>
      <DrumsLabel>OP-HAT</DrumsLabel>
      <DrumsLabel>HI-HAT</DrumsLabel>
      <DrumsLabel>SNARE</DrumsLabel>
      <DrumsLabel>KICK</DrumsLabel>
    </LabelBar>
  );
}
