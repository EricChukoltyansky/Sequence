// client/src/components/NavBar/NavBar.jsx - Modernized Version
import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

const NavBarContainer = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.lg};
  padding: 0 ${theme.spacing.xl};
  position: relative;
  z-index: ${theme.zIndex.sticky};

  /* Modern glassmorphism background */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${theme.colors.glass.border};

  /* Subtle top border glow */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${theme.colors.tracks.piano.primary} 25%,
      ${theme.colors.tracks.bass.primary} 50%,
      ${theme.colors.tracks.drums.primary} 75%,
      transparent 100%
    );
    opacity: 0.3;
  }

  /* Mobile responsive */
  ${theme.media.mobile} {
    height: 60px;
    gap: ${theme.spacing.sm};
    padding: 0 ${theme.spacing.md};
    flex-wrap: wrap;
    justify-content: space-between;
  }

  /* Animation on mount */
  animation: slideDown 0.6s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  /* Transport controls group */
  &.transport {
    background: rgba(255, 255, 255, 0.02);
    padding: ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.xl};
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* Settings group */
  &.settings {
    background: rgba(255, 255, 255, 0.02);
    padding: ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.xl};
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  ${theme.media.mobile} {
    gap: ${theme.spacing.sm};

    &.transport {
      order: 1;
      flex: 1;
      justify-content: center;
    }

    &.settings {
      order: 2;
      flex: 1;
      justify-content: space-around;
    }
  }
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  ${theme.media.mobile} {
    order: 0;
    width: 100%;
    justify-content: center;
    margin-bottom: ${theme.spacing.sm};
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

const NavBar = ({ children, connected = true }) => {
  // Extract different types of children for organized layout
  const childrenArray = React.Children.toArray(children);

  return (
    <NavBarContainer>
      <BrandSection>
        <Logo>Sequencer</Logo>
        <StatusIndicator connected={connected}>
          {connected ? "Connected" : "Disconnected"}
        </StatusIndicator>
      </BrandSection>

      <ControlGroup className="transport">
        {/* Transport controls will be automatically detected and placed here */}
        {childrenArray.filter((child, index) => index < 4)}
      </ControlGroup>

      <ControlGroup className="settings">
        {/* Settings controls (sliders, etc.) */}
        {childrenArray.filter((child, index) => index >= 4)}
      </ControlGroup>
    </NavBarContainer>
  );
};

export default NavBar;
