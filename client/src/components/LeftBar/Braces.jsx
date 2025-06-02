// client/src/components/LeftBar/Braces.jsx - Improved with Notes Inside
import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

const BracesContainer = styled.div`
  position: absolute;
  left: 160px; /* Move closer to grid */
  top: 0;
  bottom: 0;
  width: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: ${theme.zIndex.base + 1};

  ${theme.media.mobile} {
    left: 120px;
    width: 100px;
  }
`;

const TrackGroup = styled.div`
  position: relative;
  height: ${(props) => props.height}%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: ${theme.spacing.sm} 0;
  margin: ${theme.spacing.xs} 0;
`;

const Brace = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;

  /* Create artistic curved brace */
  background: linear-gradient(
    to bottom,
    transparent 0%,
    ${(props) => props.color}20 5%,
    ${(props) => props.color} 15%,
    ${(props) => props.color} 85%,
    ${(props) => props.color}20 95%,
    transparent 100%
  );
  border-radius: 3px;

  /* Top curved bracket */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 20px;
    background: ${(props) => props.color};
    border-radius: 0 0 15px 3px;
    clip-path: polygon(0 0, 100% 0, 85% 100%, 0 50%);
  }

  /* Bottom curved bracket */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30px;
    height: 20px;
    background: ${(props) => props.color};
    border-radius: 3px 15px 0 0;
    clip-path: polygon(0 50%, 85% 0, 100% 100%, 0 100%);
  }

  /* Enhanced glow effect */
  filter: drop-shadow(0 0 8px ${(props) => props.color}50);

  /* Subtle animation */
  &:hover {
    filter: drop-shadow(0 0 12px ${(props) => props.color}70);
  }
`;

const NotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding-left: 40px;
  gap: ${theme.spacing.xs};
`;

const NoteLabel = styled.div`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${(props) => props.color};
  text-align: left;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${(props) => props.color}40;
  border-radius: ${theme.borderRadius.md};

  /* Artistic styling */
  backdrop-filter: blur(5px);
  text-shadow: 0 0 10px ${(props) => props.color}50;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.08),
    0 2px 8px ${(props) => props.color}20;

  transition: all ${theme.transitions.normal};

  &:hover {
    background: ${(props) => props.color}15;
    border-color: ${(props) => props.color}70;
    transform: translateX(4px) scale(1.02);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.12),
      0 4px 16px ${(props) => props.color}40;
  }

  ${theme.media.mobile} {
    font-size: ${theme.typography.fontSize.xs};
    padding: 4px 8px;
  }
`;

// Track data with notes
const trackGroups = [
  {
    name: "Piano",
    color: theme.colors.tracks.piano.primary,
    height: 38.46, // 5/13 * 100
    notes: ["F#", "E", "C#", "A", "F#"],
  },
  {
    name: "Bass",
    color: theme.colors.tracks.bass.primary,
    height: 30.77, // 4/13 * 100
    notes: ["F#", "E", "C#", "B"],
  },
  {
    name: "Drums",
    color: theme.colors.tracks.drums.primary,
    height: 30.77, // 4/13 * 100
    notes: ["O-HAT", "H-HAT", "SNARE", "KICK"],
  },
];

export default function Braces() {
  return (
    <BracesContainer>
      {trackGroups.map((group, index) => (
        <TrackGroup key={group.name} height={group.height}>
          <Brace color={group.color} />
          <NotesContainer>
            {group.notes.map((note, noteIndex) => (
              <NoteLabel key={`${group.name}-${noteIndex}`} color={group.color}>
                {note}
              </NoteLabel>
            ))}
          </NotesContainer>
        </TrackGroup>
      ))}
    </BracesContainer>
  );
}
