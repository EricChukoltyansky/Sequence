import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

const VerticalNavBarContainer = styled.div`
  width: 120px;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: ${theme.zIndex.sticky};

  /* Modern glassmorphism background with dot pattern */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.xl};
  
  /* Same dot pattern but vertical orientation */
  background-image: 
    linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%),
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
  background-size: auto, 15px 15px;

  /* Animated gradient left border */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      ${theme.colors.tracks.piano.primary} 20%,
      ${theme.colors.tracks.bass.primary} 50%,
      ${theme.colors.tracks.drums.primary} 80%,
      transparent 100%
    );
    background-size: 100% 200%;
    animation: shimmerVertical 4s ease-in-out infinite;
    border-radius: 0 0 0 ${theme.borderRadius.xl};
  }
  
  @keyframes shimmerVertical {
    0%, 100% {
      background-position: 0 -200%;
      opacity: 0.3;
    }
    50% {
      background-position: 0 200%;
      opacity: 0.8;
    }
  }

  /* Subtle right glow */
  &::after {
    content: "";
    position: absolute;
    right: -1px;
    top: 10%;
    bottom: 10%;
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }

  /* Mobile responsive */
  ${theme.media.mobile} {
    width: 80px;
    right: 10px;
    top: 10px;
    padding: ${theme.spacing.md} ${theme.spacing.sm};
    height: calc(100vh - 20px);
  }

  /* Animation on mount */
  animation: slideLeft 0.8s ease-out;

  @keyframes slideLeft {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ControlSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  width: 100%;

  /* Transport controls section */
  &.transport {
    background: rgba(255, 255, 255, 0.03);
    padding: ${theme.spacing.md} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all ${theme.transitions.normal};
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.12);
      transform: translateX(-2px);
    }
  }

  /* Settings section */
  &.settings {
    background: rgba(255, 255, 255, 0.03);
    padding: ${theme.spacing.md} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all ${theme.transitions.normal};
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.12);
      transform: translateX(-2px);
    }
  }

  ${theme.media.mobile} {
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm};
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const Logo = styled.div`
  font-family: ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  background: linear-gradient(
    180deg,
    ${theme.colors.tracks.piano.primary} 0%,
    ${theme.colors.tracks.bass.primary} 50%,
    ${theme.colors.tracks.drums.primary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  cursor: default;
  user-select: none;
  writing-mode: vertical-rl;
  text-orientation: mixed;

  ${theme.media.mobile} {
    font-size: ${theme.typography.fontSize.base};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  background: rgba(255, 255, 255, 0.03);
  padding: 6px 4px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.05);
  writing-mode: vertical-rl;
  text-orientation: mixed;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) =>
      props.connected
        ? theme.colors.status.success
        : theme.colors.status.error};
    box-shadow: ${(props) =>
      helpers.glow(
        props.connected
          ? theme.colors.status.success
          : theme.colors.status.error,
        8
      )};
    animation: ${(props) => (props.connected ? "pulse 2s infinite" : "none")};
    margin-bottom: 4px;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  ${theme.media.mobile} {
    font-size: 8px;
    padding: 4px 2px;
  }
`;

const VerticalNavBar = ({ children, connected = true }) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <VerticalNavBarContainer>
      <BrandSection>
        <Logo>Sequencer</Logo>
        <StatusIndicator connected={connected}>
          {connected ? "ON" : "OFF"}
        </StatusIndicator>
      </BrandSection>

      <ControlSection className="transport">
        {/* Transport controls */}
        {childrenArray.filter((child, index) => index < 4)}
      </ControlSection>

      <ControlSection className="settings">
        {/* Settings controls (sliders, etc.) */}
        {childrenArray.filter((child, index) => index >= 4)}
      </ControlSection>
    </VerticalNavBarContainer>
  );
};

export default VerticalNavBar;