// PowerOn and PowerOff Buttons with Toggle States
import React from "react";
import styled from "styled-components";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { theme, helpers } from "../../theme";

const PowerButtonBase = styled.button`
  /* Base button styling */
  width: ${theme.components.transport.size};
  height: ${theme.components.transport.size};
  border-radius: ${(props) =>
    props.isActive
      ? theme.borderRadius.md
      : "50%"}; /* Square when active, round when inactive */
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

const PowerOnStyled = styled(PowerButtonBase)`
  color: #0b996a;
  box-shadow: ${theme.shadows.md}, ${helpers.glow("#0b996a", 8)};

  &:hover {
    box-shadow: ${theme.shadows.lg}, ${helpers.glow("#0b996a", 15)};
  }
`;

const PowerOffStyled = styled(PowerButtonBase)`
  color: #922c2c;
  box-shadow: ${theme.shadows.md}, ${helpers.glow("#922c2c", 8)};

  &:hover {
    box-shadow: ${theme.shadows.lg}, ${helpers.glow("#922c2c", 15)};
  }
`;

// PowerOn Component - shows when volume is ON (not muted)
export const PowerOn = ({ onClick, isActive = false }) => (
  <PowerOnStyled
    onClick={onClick}
    aria-label="Mute sequencer"
    isActive={isActive}
  >
    <IoVolumeHighOutline />
  </PowerOnStyled>
);

// PowerOff Component - shows when volume is OFF (muted)
export const PowerOff = ({ onClick, isActive = true }) => (
  <PowerOffStyled
    onClick={onClick}
    aria-label="Unmute sequencer"
    isActive={isActive}
  >
    <IoVolumeMuteOutline />
  </PowerOffStyled>
);

// Default export for PowerOn
export default PowerOn;
