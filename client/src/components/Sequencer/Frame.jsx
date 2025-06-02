import styled from "styled-components";
import { theme } from "../../theme";

const Frame = styled.div`
  display: grid;
  margin: 0 auto;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  width: 75vw;
  height: calc(100vh - 80px);
  padding: ${theme.spacing.lg};
  gap: 2px;

  /* Enhanced grid background */
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.secondary} 100%
  );
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.borderLight};

  /* Multiple shadow layers for depth */
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(255, 255, 255, 0.03);

  /* Subtle inner border */
  &::before {
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: ${theme.borderRadius.lg};
    pointer-events: none;
  }

  position: relative;

  /* Mobile responsive */
  ${theme.media.mobile} {
    width: 95vw;
    height: calc(100vh - 60px);
    padding: ${theme.spacing.md};
    gap: 1px;
  }

  /* Animation on mount */
  animation: frameAppear 1s ease-out;

  @keyframes frameAppear {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

export default Frame;
