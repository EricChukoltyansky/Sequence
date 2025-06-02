import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing.lg};

  /* Fade in animation */
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(8px);
    }
  }
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;

  /* Modern glassmorphism card */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};

  /* Subtle glow effect */
  box-shadow: ${theme.shadows.xl}, 0 0 40px rgba(255, 255, 255, 0.1);

  /* Slide up animation */
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideUp {
    from {
      transform: translateY(20px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  ${theme.media.mobile} {
    max-width: 95vw;
    max-height: 90vh;
    margin: ${theme.spacing.sm};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  transition: all ${theme.transitions.fast};
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.status.info};
  }
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing.xl};
  padding-right: 60px; /* Make room for close button */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  position: relative;
`;

const ModalTitle = styled.h1`
  font-family: ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize["3xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
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
    font-size: ${theme.typography.fontSize["2xl"]};
  }
`;

const ModalSubtitle = styled.p`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.tracks.piano.primary};
  margin: ${theme.spacing.md} 0 0 0;
  font-weight: ${theme.typography.fontWeight.medium};

  ${theme.media.mobile} {
    font-size: ${theme.typography.fontSize.base};
  }
`;

const ModalContent = styled.div`
  padding: ${theme.spacing.xl};
`;

const InstructionsList = styled.div`
  display: grid;
  gap: ${theme.spacing.lg};
`;

const InstructionCategory = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  transition: all ${theme.transitions.normal};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const CategoryTitle = styled.h3`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  &::before {
    content: "";
    width: 4px;
    height: 20px;
    border-radius: 2px;
    background: ${(props) => props.color || theme.colors.tracks.piano.primary};
  }
`;

const InstructionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const InstructionIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => props.color || theme.colors.tracks.piano.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  flex-shrink: 0;
  margin-top: 2px;
`;

const InstructionText = styled.p`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const KeyboardShortcuts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ShortcutItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${theme.borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ShortcutKey = styled.kbd`
  background: ${theme.colors.tertiary};
  color: ${theme.colors.text.primary};
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.sm};
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  border: 1px solid ${theme.colors.border};
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.3);
`;

const ShortcutDescription = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
`;

function Instructions({ onClose }) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close when clicking overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose} aria-label="Close instructions">
          ×
        </CloseButton>

        <ModalHeader>
          <ModalTitle>How to Use</ModalTitle>
          <ModalSubtitle>Create music together in real time!</ModalSubtitle>
        </ModalHeader>

        <ModalContent>
          <InstructionsList>
            <InstructionCategory>
              <CategoryTitle color={theme.colors.tracks.piano.primary}>
                Basic Controls
              </CategoryTitle>
              <InstructionItem>
                <InstructionIcon color={theme.colors.tracks.piano.primary}>
                  1
                </InstructionIcon>
                <InstructionText>
                  Click on cells in the grid to activate sounds. Each row
                  represents a different instrument.
                </InstructionText>
              </InstructionItem>
              <InstructionItem>
                <InstructionIcon color={theme.colors.tracks.piano.primary}>
                  2
                </InstructionIcon>
                <InstructionText>
                  Use the play/pause button to start and stop the sequencer. The
                  grid will loop continuously.
                </InstructionText>
              </InstructionItem>
              <InstructionItem>
                <InstructionIcon color={theme.colors.tracks.piano.primary}>
                  3
                </InstructionIcon>
                <InstructionText>
                  The stop button will pause playback and return to the
                  beginning of the pattern.
                </InstructionText>
              </InstructionItem>
            </InstructionCategory>

            <InstructionCategory>
              <CategoryTitle color={theme.colors.tracks.bass.primary}>
                Audio Controls
              </CategoryTitle>
              <InstructionItem>
                <InstructionIcon color={theme.colors.tracks.bass.primary}>
                  🔊
                </InstructionIcon>
                <InstructionText>
                  Adjust the volume slider to control the overall output level.
                </InstructionText>
              </InstructionItem>
              <InstructionItem>
                <InstructionIcon color={theme.colors.tracks.bass.primary}>
                  ♪
                </InstructionIcon>
                <InstructionText>
                  Change the tempo using the BPM slider (60-150 BPM range).
                </InstructionText>
              </InstructionItem>
              <InstructionItem>
                <InstructionIcon color={theme.colors.tracks.bass.primary}>
                  🔇
                </InstructionIcon>
                <InstructionText>
                  Toggle the speaker icon to mute/unmute the entire sequencer.
                </InstructionText>
              </InstructionItem>
            </InstructionCategory>

            <InstructionCategory>
              <CategoryTitle color={theme.colors.tracks.drums.primary}>
                Instruments
              </CategoryTitle>
              <InstructionItem>
                <InstructionIcon color={theme.colors.tracks.piano.primary}>
                  🎹
                </InstructionIcon>
                <InstructionText>
                  <strong>Top 5 rows:</strong> Piano/Melodic sounds (F#, E, C#,
                  A, F#)
                </InstructionText>
              </InstructionItem>
              <InstructionItem>
                <InstructionIcon color={theme.colors.tracks.bass.primary}>
                  🎸
                </InstructionIcon>
                <InstructionText>
                  <strong>Middle 4 rows:</strong> Bass sounds (F#, E, C#, B)
                </InstructionText>
              </InstructionItem>
              <InstructionItem>
                <InstructionIcon color={theme.colors.tracks.drums.primary}>
                  🥁
                </InstructionIcon>
                <InstructionText>
                  <strong>Bottom 4 rows:</strong> Drum sounds (Open Hat, Hi-Hat,
                  Snare, Kick)
                </InstructionText>
              </InstructionItem>
            </InstructionCategory>

            <InstructionCategory>
              <CategoryTitle color={theme.colors.status.success}>
                Collaboration
              </CategoryTitle>
              <InstructionItem>
                <InstructionIcon color={theme.colors.status.success}>
                  👥
                </InstructionIcon>
                <InstructionText>
                  Share the URL with friends to collaborate in real-time. All
                  changes sync instantly!
                </InstructionText>
              </InstructionItem>
              <InstructionItem>
                <InstructionIcon color={theme.colors.status.success}>
                  🗑️
                </InstructionIcon>
                <InstructionText>
                  Use the trash button to clear all patterns and start fresh.
                </InstructionText>
              </InstructionItem>
            </InstructionCategory>
          </InstructionsList>

          <KeyboardShortcuts>
            <ShortcutItem>
              <ShortcutKey>Space</ShortcutKey>
              <ShortcutDescription>Play/Pause</ShortcutDescription>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutKey>Esc</ShortcutKey>
              <ShortcutDescription>Stop (or close this)</ShortcutDescription>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutKey>Del</ShortcutKey>
              <ShortcutDescription>Clear All</ShortcutDescription>
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutKey>M</ShortcutKey>
              <ShortcutDescription>Mute/Unmute</ShortcutDescription>
            </ShortcutItem>
          </KeyboardShortcuts>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default Instructions;
