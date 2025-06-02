// client/src/components/LeftBar/Braces.jsx - Improved with Notes Inside
import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

const BracesContainer = styled.div`
  position: absolute;
  left: 80px; /* Position after the icons */
  top: 0;
  bottom: 0;
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: ${theme.zIndex.base + 1};

  ${theme.media.mobile} {
    left: 60px;
    width: 80px;
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
  width: 4px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    ${(props) => props.color} 10%,
    ${(props) => props.color} 90%,
    transparent 100%
  );
  border-radius: 2px;

  /* Top bracket */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 2px;
    background: ${(props) => props.color};
    border-radius: 1px;
  }

  /* Bottom bracket */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 20px;
    height: 2px;
    background: ${(props) => props.color};
    border-radius: 1px;
  }

  /* Glow effect */
  filter: drop-shadow(0 0 4px ${(props) => props.color}40);
`;

const NotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding-left: 30px;
  gap: ${theme.spacing.xs};
`;

const NoteLabel = styled.div`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${(props) => props.color};
  text-align: left;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${(props) => props.color}30;
  border-radius: ${theme.borderRadius.sm};

  /* Subtle glow effect */
  text-shadow: 0 0 8px ${(props) => props.color}40;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.05);

  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${(props) => props.color}10;
    border-color: ${(props) => props.color}60;
    transform: translateX(2px);
  }

  ${theme.media.mobile} {
    font-size: ${theme.typography.fontSize.xs};
    padding: 2px 4px;
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
