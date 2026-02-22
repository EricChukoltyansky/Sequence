import React from "react";
import styled from "styled-components";
import { IoTrashOutline } from "react-icons/io5";
import { theme, helpers } from "../../theme";

const ClearButtonStyled = styled.button`
  /* Base button styling */
  width: ${theme.components.transport.size};
  height: ${theme.components.transport.size};
  border-radius: 50%; /* Always round */
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
  color: ${theme.colors.status.error};

  /* Glow effect */
  box-shadow: ${(props) =>
    props.isActive
      ? `${theme.shadows.lg}, ${helpers.glow(theme.colors.transport.stop, 15)}`
      : `${theme.shadows.md}, ${helpers.glow(theme.colors.status.error, 8)}`};

  /* Smooth transitions */
  ${helpers.transition("all", theme.transitions.normal)}

  /* Focus for accessibility */
  ${helpers.focus()}
  
  /* Hover effects with warning color */
  ${helpers.hover(`
    transform: translateY(-2px) scale(1.05);
    ${helpers.glassmorphism("rgba(255, 255, 255, 0.08)")}
    box-shadow: 
      ${theme.shadows.lg},
      ${helpers.glow(theme.colors.status.error, 15)};
    color: ${theme.colors.status.warning};
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

const ClearAllButton = ({ onClick, isActive = false }) => (
  <ClearButtonStyled
    onClick={onClick}
    aria-label="Clear all patterns"
    isActive={isActive}
  >
    <IoTrashOutline />
  </ClearButtonStyled>
);

export default ClearAllButton;
