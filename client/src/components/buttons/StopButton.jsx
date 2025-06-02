import React from "react";
import styled from "styled-components";
import { IoStopOutline } from "react-icons/io5";
import { theme, helpers } from "../../theme";

const StopButtonStyled = styled.button`
  /* Inherit base transport button styles */
  width: ${theme.components.transport.size};
  height: ${theme.components.transport.size};
  border-radius: 50%;
  border: none;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  /* Glassmorphism background */
  ${helpers.glassmorphism()}

  /* Icon styling */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.components.transport.iconSize};
  color: ${theme.colors.transport.stop};

  /* Glow effect */
  box-shadow: ${theme.shadows.md},
    ${helpers.glow(theme.colors.transport.stop, 8)};

  /* Smooth transitions */
  ${helpers.transition("all", theme.transitions.normal)}

  /* Focus for accessibility */
  ${helpers.focus()}
  
  /* Hover effects */
  ${helpers.hover(`
    transform: translateY(-2px) scale(1.05);
    ${helpers.glassmorphism("rgba(255, 255, 255, 0.08)")}
    box-shadow: 
      ${theme.shadows.lg},
      ${helpers.glow(theme.colors.transport.stop, 15)};
  `)}
  
  /* Active state */
  &:active {
    transform: translateY(0) scale(0.95);
  }

  /* Ripple effect */
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(229, 62, 62, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::before {
    width: 100%;
    height: 100%;
  }

  /* Mobile responsive */
  ${theme.media.mobile} {
    width: calc(${theme.components.transport.size} * 0.8);
    height: calc(${theme.components.transport.size} * 0.8);
    font-size: calc(${theme.components.transport.iconSize} * 0.8);
  }
`;

const StopButton = ({ onClick }) => (
  <StopButtonStyled onClick={onClick} aria-label="Stop sequencer">
    <IoStopOutline />
  </StopButtonStyled>
);

export default StopButton;
