import styled from "styled-components";
import { theme, helpers } from "../../theme";

const getBackground = (activated, triggered, row) => {
  const trackColor = helpers.getTrackColor(row);

  switch (true) {
    case activated && triggered:
      return `
      background: linear-gradient(135deg, ${trackColor.primary}, ${trackColor.secondary});
      animation: cellPulse 0.5s ease-in-out;
      `;
    case activated && !triggered:
      return `
        background: linear-gradient(135deg, ${trackColor.background}, ${theme.colors.tertiary});
        border: 2px solid ${trackColor.primary};
      `;
    case !activated && triggered:
      return `
        background: linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.tertiary});
        border: 2px solid ${theme.colors.borderLight};
      `;
    default:
      return `
        background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
        border: 1px solid ${theme.colors.border};
      `;
  }
};

const getBoxShadow = (activated, triggered, row) => {
  const trackColor = helpers.getTrackColor(row);

  switch (true) {
    case activated && triggered:
      return `
        ${helpers.glow(trackColor.primary, 25)},
        inset 0 2px 4px rgba(255, 255, 255, 0.1);
      `;
    case activated && !triggered:
      return `
        ${helpers.glow(trackColor.primary, 10)},
        inset 0 1px 2px rgba(255, 255, 255, 0.05);
      `;
    case !activated && triggered:
      return `
        0 2px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.05);
      `;

    default:
      // Default - minimal shadow for depth
      return `
        0 1px 3px rgba(0, 0, 0, 0.2),
        inset 0 1px 1px rgba(255, 255, 255, 0.03);
      `;
  }
};

const getBorder = (activated, triggered) => {
  switch (true) {
    case activated && triggered:
      return "none";
    case activated && !triggered:
      return "none";
    case !activated && triggered:
      return "none";
    default:
      return "solid 2px grey";
  }
};

const Cell = styled.div.attrs(({ activated, triggered, row }) => ({
  style: {
    // Dynamic styles are set via CSS-in-JS for better performance
  },
}))`
  /* Base cell styling */
  width: ${theme.components.cell.size};
  height: ${theme.components.cell.size};
  border-radius: ${theme.borderRadius.lg};
  grid-column: ${(props) => props.column};
  grid-row: ${(props) => props.row};
  margin: ${theme.spacing.xs};
  position: relative;
  cursor: pointer;
  user-select: none;

  /* Dynamic background and shadows */
  ${(props) => getBackground(props.activated, props.triggered, props.row)}
  box-shadow: ${(props) =>
    getBoxShadow(props.activated, props.triggered, props.row)};

  /* Smooth transitions */
  transition: all ${theme.transitions.fast};

  /* Hover effects */
  &:hover {
    transform: translateY(-1px) scale(1.02);
    border-radius: ${theme.borderRadius.xl};

    ${(props) => {
      const trackColor = helpers.getTrackColor(props.row);
      if (!props.activated) {
        return `
          background: linear-gradient(135deg, ${theme.colors.hover}, ${
          theme.colors.tertiary
        });
          border-color: ${trackColor.primary};
          box-shadow: ${helpers.glow(trackColor.primary, 8)};
        `;
      }
      return `
        box-shadow: ${helpers.glow(trackColor.primary, 30)};
      `;
    }}
  }

  /* Active state (mouse down) */
  &:active {
    transform: translateY(0) scale(0.98);
    transition: all ${theme.transitions.fast};
  }

  /* Focus for accessibility */
  ${helpers.focus()}

  /* Velocity indicator for activated cells */
  ${(props) =>
    props.activated &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 6px;
      height: 6px;
      background: ${helpers.getTrackColor(props.row).secondary};
      border-radius: 50%;
      opacity: 0.8;
    }
  `}
  
  /* Pulse animation for playing cells */
  @keyframes cellPulse {
    0% {
      transform: scale(1);
      box-shadow: ${(props) =>
        helpers.glow(helpers.getTrackColor(props.row).primary, 20)};
    }
    50% {
      transform: scale(1.05);
      box-shadow: ${(props) =>
        helpers.glow(helpers.getTrackColor(props.row).primary, 35)};
    }
    100% {
      transform: scale(1);
      box-shadow: ${(props) =>
        helpers.glow(helpers.getTrackColor(props.row).primary, 25)};
    }
  }

  /* Step position indicator - shows current playback position */
  ${(props) =>
    props.triggered &&
    !props.activated &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: ${theme.colors.text.secondary};
      border-radius: 50%;
      opacity: 0.6;
      animation: stepPulse 0.3s ease-out;
    }
    
    @keyframes stepPulse {
      0% { 
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
      }
      50% { 
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0.8;
      }
      100% { 
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.6;
      }
    }
  `}

  /* Mobile responsive sizing */
  ${theme.media.mobile} {
    width: ${theme.components.cell.sizeSmall};
    height: ${theme.components.cell.sizeSmall};
    margin: 1px;
    border-radius: ${theme.borderRadius.md};

    &:hover {
      transform: scale(1.05);
      border-radius: ${theme.borderRadius.lg};
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border-width: 2px;

    ${(props) =>
      props.activated &&
      `
      border-width: 3px;
    `}
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;

    &:hover {
      transform: none;
    }

    &:active {
      transform: none;
    }
  }
`;

export default Cell;
