import React from "react";
import styled from "styled-components";
import { theme } from "../../theme";

const LoaderContainer = styled.div`
  background: ${theme.colors.primary};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: calc(16px + (24 - 16) * (100vw - 320px) / (1280 - 320));
  height: 100vh;
  display: grid;
  place-items: center;
  position: relative;

  /* Same dot pattern as main sequencer */
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(255, 255, 255, 0.08) 1px,
    transparent 0
  );
  background-size: 20px 20px;
`;

const LoaderBlob = styled.div`
  position: relative;
  width: 12em;
  height: 12em;
`;

const Blob = styled.div`
  animation: ${(props) => props.animation} 8s linear infinite;
  border-radius: 50%;
  mix-blend-mode: screen;
  position: absolute;
  top: 0;
  left: 0;
  width: 9em;
  height: 9em;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);

  &.red {
    background: linear-gradient(
      135deg,
      ${theme.colors.tracks.drums.primary},
      #ff6b9d
    );
  }

  &.green {
    animation-name: moveG;
    background: linear-gradient(
      135deg,
      ${theme.colors.status.success},
      #00f260
    );
  }

  &.blue {
    animation-name: moveB;
    background: linear-gradient(
      135deg,
      ${theme.colors.tracks.bass.primary},
      #667eea
    );
  }
`;

const LoadingText = styled.div`
  position: absolute;
  bottom: -4em;
  left: 50%;
  transform: translateX(-50%);
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }
`;

const Loader = () => (
  <LoaderContainer>
    <LoaderBlob>
      <Blob className="red" />
      <Blob className="green" />
      <Blob className="blue" />
      <LoadingText>Loading sounds...</LoadingText>
    </LoaderBlob>

    <style jsx>{`
      @keyframes moveR {
        from,
        to {
          border-radius: 54% 79% 75% 58% / 70% 66% 71% 47%;
          transform: translate(0, 0) rotate(-35deg) scale(0.875, 1);
        }
        33% {
          border-radius: 79% 43% 56% 67% / 58% 64% 61% 60%;
          transform: translate(2.75em, 0) rotate(0) scale(0.75, 0.875);
        }
        67% {
          border-radius: 55% 77% 56% 67% / 58% 64% 61% 60%;
          transform: translate(1.25em, -0.5em) rotate(0) scale(1.125, 0.875);
        }
      }

      @keyframes moveG {
        from,
        to {
          border-radius: 60% 59% 51% 58% / 69% 64% 52% 55%;
          transform: translate(2.25em, 1em) rotate(45deg) scale(1.125, 0.875);
        }
        33% {
          border-radius: 51% 95% 72% 59% / 75% 98% 54% 75%;
          transform: translate(0, 0.5em) rotate(0) scale(1, 1);
        }
        67% {
          border-radius: 74% 85% 63% 87% / 81% 100% 62% 82%;
          transform: translate(1em, 2em) rotate(0) scale(0.75, 0.875);
        }
      }

      @keyframes moveB {
        from,
        to {
          border-radius: 52% 59% 50% 58% / 56% 80% 40% 59%;
          transform: translate(1.75em, 3em) rotate(0) scale(1, 1);
        }
        25% {
          border-radius: 71% 58% 100% 43% / 68% 53% 85% 68%;
          transform: translate(-0.75em, 3em) rotate(10deg) scale(0.75, 1);
        }
        50% {
          border-radius: 99% 62% 87% 69% / 93% 92% 79% 75%;
          transform: translate(2em, 2em) rotate(0) scale(0.7, 0.7);
        }
        75% {
          border-radius: 78% 98% 100% 73% / 75% 76% 100% 91%;
          transform: translate(3.5em, 2em) rotate(0) scale(0.875, 0.875);
        }
      }
    `}</style>
  </LoaderContainer>
);

export default Loader;
