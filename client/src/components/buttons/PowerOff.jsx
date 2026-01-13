import React from "react";
import styled from "styled-components";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { theme, helpers } from "../../theme";

const TransportButton = styled.button`
  /* Base button styling */
  width: ${theme.components.transport.size};
  height: ${theme.components.transport.size};
  border-radius: 50%; /* Always round */
  border: none;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  /* Modern glassmorphism background */
  ${helpers.glassmorphism()}

  /* Icon styling */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.components.transport.iconSize};

  /* Smooth transitions */
  ${helpers.transition("all", theme.transitions.normal)}

  /* Focus for accessibility */
  ${helpers.focus()}
  
  /* Hover effects */
  ${helpers.hover(`
    transform: translateY(-2px) scale(1.05);
    ${helpers.glassmorphism("rgba(255, 255, 255, 0.08)")}
  `)}
  
  /* Active state styling */
  ${(props) =>
    props.isActive &&
    `
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.95);
  `}

  /* Mobile responsive */
  ${theme.media.mobile} {
    width: calc(${theme.components.transport.size} * 0.8);
    height: calc(${theme.components.transport.size} * 0.8);
    font-size: calc(${theme.components.transport.iconSize} * 0.8);
  }
`;

const PowerOffStyled = styled(TransportButton)`
  color: ${(props) => (props.isActive ? "#ffffff" : "#922c2c")};
  background: ${(props) =>
    props.isActive
      ? `linear-gradient(135deg, ${theme.colors.transport.stop}, #cc4444)`
      : "transparent"};
  box-shadow: ${(props) =>
    props.isActive
      ? `${theme.shadows.lg}, ${helpers.glow(theme.colors.transport.stop, 15)}`
      : `${theme.shadows.md}, ${helpers.glow("#922c2c", 8)}`};

  &:hover {
    box-shadow: ${(props) =>
      props.isActive
        ? `${theme.shadows.xl}, ${helpers.glow(
            theme.colors.transport.stop,
            20
          )}`
        : `${theme.shadows.lg}, ${helpers.glow("#922c2c", 15)}`};
  }
`;

export default function PowerOff({ onClick, isActive = true }) {
  return (
    <PowerOffStyled
      onClick={onClick}
      aria-label="Unmute sequencer"
      isActive={isActive}
    >
      <IoVolumeMuteOutline />
    </PowerOffStyled>
  );
}
