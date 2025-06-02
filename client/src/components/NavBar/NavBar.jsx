// client/src/components/NavBar/NavBar.jsx - Vertical Right-Side Version
import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

const NavBarContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 138px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  z-index: ${theme.zIndex.sticky};

  /* Modern glassmorphism background */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  backdrop-filter: blur(20px);
  border-left: 1px solid ${theme.colors.glass.border};

  /* Subtle left border glow */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      ${theme.colors.tracks.piano.primary} 25%,
      ${theme.colors.tracks.bass.primary} 50%,
      ${theme.colors.tracks.drums.primary} 75%,
      transparent 100%
    );
    opacity: 0.3;
  }

  ${theme.media.mobile} {
    width: 100px;
    padding: ${theme.spacing.lg} ${theme.spacing.sm};
  }

  /* Animation on mount */
  animation: slideInFromRight 0.6s ease-out;

  @keyframes slideInFromRight {
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

const ControlsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.xl};
  width: 100%;

  ${theme.media.mobile} {
    gap: ${theme.spacing.lg};
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};

  /* Transport controls group */
  &.transport {
    background: rgba(255, 255, 255, 0.02);
    padding: ${theme.spacing.lg} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.xl};
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* Settings group */
  &.settings {
    background: rgba(255, 255, 255, 0.02);
    padding: ${theme.spacing.lg} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.xl};
    border: 1px solid rgba(255, 255, 255, 0.05);
    width: 100%;
    align-items: center;
  }

  ${theme.media.mobile} {
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md} ${theme.spacing.xs};
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  position: sticky;
  top: 0;

  ${theme.media.mobile} {
    margin-bottom: ${theme.spacing.lg};
    gap: ${theme.spacing.xs};
  }
`;

const Logo = styled.div`
  font-family: ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  background: linear-gradient(
    135deg,
    ${theme.colors.tracks.piano.primary} 0%,
    ${theme.colors.tracks.bass.primary} 50%,
    ${theme.colors.tracks.drums.primary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  text-align: center;

  /* Keep logo upright and centered */
  transform: none;
  writing-mode: normal;

  ${theme.media.mobile} {
    font-size: ${theme.typography.fontSize.lg};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  text-align: center;

  /* Keep status upright and centered */
  transform: none;
  white-space: nowrap;

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
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  ${theme.media.mobile} {
    font-size: 10px;
  }
`;

// Wrapper for rotated sliders
const RotatedSliderContainer = styled.div`
  transform: rotate(90deg);
  transform-origin: center;
  width: 120px;
  height: 40px;
  margin: 50px 0; /* Account for rotation and spacing */

  ${theme.media.mobile} {
    width: 80px;
    height: 30px;
    margin: 40px 0;
  }
`;

// Wrapper for buttons to keep them upright
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  align-items: center;

  ${theme.media.mobile} {
    gap: ${theme.spacing.sm};
  }
`;

const NavBar = ({ children, connected = true }) => {
  // Extract different types of children for organized layout
  const childrenArray = React.Children.toArray(children);

  // Separate buttons from sliders
  const buttons = childrenArray.filter((child, index) => index < 4); // First 4 are buttons
  const sliders = childrenArray.filter(
    (child, index) => index >= 4 && index < 6
  ); // Next 2 are sliders
  const otherControls = childrenArray.filter((child, index) => index >= 6); // Remaining controls

  return (
    <NavBarContainer>
      {/* Top section - Logo and Status (kept upright and centered) */}
      <BrandSection>
        <Logo>Sequencer</Logo>
        <StatusIndicator connected={connected}>
          {connected ? "Connected" : "Offline"}
        </StatusIndicator>
      </BrandSection>

      {/* Main controls section */}
      <ControlsContainer>
        <ControlGroup className="transport">
          <ButtonContainer>{buttons}</ButtonContainer>
        </ControlGroup>

        <ControlGroup className="settings">
          {/* Rotate sliders 90 degrees */}
          {sliders.map((slider, index) => (
            <RotatedSliderContainer key={index}>
              {slider}
            </RotatedSliderContainer>
          ))}
        </ControlGroup>

        {/* Other controls at bottom */}
        <ControlGroup className="other">
          <ButtonContainer>{otherControls}</ButtonContainer>
        </ControlGroup>
      </ControlsContainer>
    </NavBarContainer>
  );
};

export default NavBar;
