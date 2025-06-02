import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

const BraceBar = styled.div`
  height: calc(100vh - 80px);
  right: calc(100vw - 70px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  position: absolute;
  z-index: ${theme.zIndex.base};
`;

const BraceSection = styled.div`
  width: calc(7vw - 35px);
  border-left: 2px solid;
  border-top: 2px solid;
  border-bottom: 2px solid;
  border-top-left-radius: ${theme.borderRadius.xl};
  border-bottom-left-radius: ${theme.borderRadius.xl};
  position: absolute;
  left: 160%;
  transition: all ${theme.transitions.normal};

  &::before {
    content: "";
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: ${(props) => helpers.glow(props.color, 10)};
  }

  &:hover {
    transform: translateX(-2px);
    box-shadow: ${(props) => helpers.glow(props.color, 15)};
  }
`;

const PianoBrace = styled(BraceSection)`
  height: 37.5%;
  top: 0.2%;
  border-color: ${theme.colors.tracks.piano.primary};
  color: ${theme.colors.tracks.piano.primary};
  filter: drop-shadow(0px 0px 4px ${theme.colors.tracks.piano.primary});
`;

const BassBrace = styled(BraceSection)`
  height: 30.5%;
  top: 38.5%;
  border-color: ${theme.colors.tracks.bass.primary};
  color: ${theme.colors.tracks.bass.primary};
  filter: drop-shadow(0px 0px 4px ${theme.colors.tracks.bass.primary});
`;

const DrumsBrace = styled(BraceSection)`
  height: 30%;
  top: 69.8%;
  border-color: ${theme.colors.tracks.drums.primary};
  color: ${theme.colors.tracks.drums.primary};
  filter: drop-shadow(0px 0px 4px ${theme.colors.tracks.drums.primary});
`;

export default function Braces() {
  return (
    <BraceBar>
      <PianoBrace color={theme.colors.tracks.piano.primary} />
      <BassBrace color={theme.colors.tracks.bass.primary} />
      <DrumsBrace color={theme.colors.tracks.drums.primary} />
    </BraceBar>
  );
}
