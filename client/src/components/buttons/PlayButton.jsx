import styled from "styled-components";
import { IoPlayOutline, IoPauseOutline } from "react-icons/io5";
import { theme, helpers } from "../../theme";

const TransportButton = styled.button`
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

const PlayButtonStyled = styled(TransportButton)`
  color: ${theme.colors.transport.play};
  box-shadow: ${theme.shadows.md},
    ${helpers.glow(theme.colors.transport.play, 8)};

  &:hover {
    box-shadow: ${theme.shadows.lg},
      ${helpers.glow(theme.colors.transport.play, 15)};
  }
`;

const PauseButtonStyled = styled(TransportButton)`
  color: ${theme.colors.transport.pause};
  box-shadow: ${theme.shadows.md},
    ${helpers.glow(theme.colors.transport.pause, 8)};

  &:hover {
    box-shadow: ${theme.shadows.lg},
      ${helpers.glow(theme.colors.transport.pause, 15)};
  }
`;

export default function PlayButton({ playing, onClick }) {
  return (
    <>
      {playing ? (
        <PauseButtonStyled
          onClick={onClick}
          aria-label="Pause sequencer"
          isActive={true}
        >
          <IoPauseOutline />
        </PauseButtonStyled>
      ) : (
        <PlayButtonStyled
          onClick={onClick}
          aria-label="Play sequencer"
          isActive={false}
        >
          <IoPlayOutline />
        </PlayButtonStyled>
      )}
    </>
  );
}
