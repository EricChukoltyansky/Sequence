import React from "react";
import styled from "styled-components";
import { GiDrumKit, GiGuitarBassHead } from "react-icons/gi";
import { CgPiano } from "react-icons/cg";
import { theme, helpers } from "../../theme";

const IconBar = styled.div`
  height: calc(100vh - 80px);
  right: calc(100vw - 30px); /* Moved closer to the grid */
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  font-size: 24px;
  position: absolute;
  padding: ${theme.spacing.lg} 0;
  z-index: ${theme.zIndex.base};

  ${theme.media.mobile} {
    right: calc(100vw - 25px);
    font-size: 20px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transitions.normal};
  cursor: pointer;

  ${helpers.glassmorphism("rgba(255, 255, 255, 0.03)")}
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateX(-4px) scale(1.1);
    ${helpers.glassmorphism("rgba(255, 255, 255, 0.08)")}
  }
`;

const PianoIcon = styled(IconContainer)`
  color: ${theme.colors.tracks.piano.primary};
  box-shadow: ${helpers.glow(theme.colors.tracks.piano.primary, 8)};

  &:hover {
    box-shadow: ${helpers.glow(theme.colors.tracks.piano.primary, 15)};
  }
`;

const BassIcon = styled(IconContainer)`
  color: ${theme.colors.tracks.bass.primary};
  box-shadow: ${helpers.glow(theme.colors.tracks.bass.primary, 8)};

  &:hover {
    box-shadow: ${helpers.glow(theme.colors.tracks.bass.primary, 15)};
  }
`;

const DrumsIcon = styled(IconContainer)`
  color: ${theme.colors.tracks.drums.primary};
  box-shadow: ${helpers.glow(theme.colors.tracks.drums.primary, 8)};

  &:hover {
    box-shadow: ${helpers.glow(theme.colors.tracks.drums.primary, 15)};
  }
`;

export default function Icons() {
  return (
    <IconBar>
      <PianoIcon title="Piano Tracks">
        <CgPiano />
      </PianoIcon>
      <BassIcon title="Bass Tracks">
        <GiGuitarBassHead />
      </BassIcon>
      <DrumsIcon title="Drum Tracks">
        <GiDrumKit />
      </DrumsIcon>
    </IconBar>
  );
}
