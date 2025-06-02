import styled from "styled-components";
import { theme, helpers } from "../../theme";

const getBackground = (activated, triggered, row) => {
  const trackColor = helpers.getTrackColor(row);

  if (activated && triggered) {
    return `
      background: linear-gradient(135deg, ${trackColor.primary}, ${trackColor.secondary});
      border: 2px solid ${trackColor.primary};
    `;
  } else if (activated) {
    return `
      background: linear-gradient(135deg, ${trackColor.background}, ${theme.colors.tertiary});
      border: 2px solid ${trackColor.primary};
    `;
  } else if (triggered) {
    return `
      background: linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.tertiary});
      border: 2px solid ${theme.colors.borderLight};
    `;
  }

  return `
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
    border: 1px solid ${theme.colors.border};
  `;
};

const getBoxShadow = (activated, triggered, row) => {
  const trackColor = helpers.getTrackColor(row);

  if (activated && triggered) {
    return `
      ${helpers.glow(trackColor.primary, 20)},
      inset 0 2px 4px rgba(255, 255, 255, 0.1);
    `;
  } else if (activated) {
    return `
      ${helpers.glow(trackColor.primary, 12)},
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
    `;
  }

  return `
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);
  `;
};

const Cell = styled.div`
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

  /* Dynamic styling */
  ${(props) => getBackground(props.activated, props.triggered, props.row)}
  box-shadow: ${(props) =>
    getBoxShadow(props.activated, props.triggered, props.row)};

  /* Smooth transitions */
  transition: all ${theme.transitions.fast};

  /* Hover effects */
  &:hover {
    transform: translateY(-2px) scale(1.05);
    border-radius: ${theme.borderRadius.xl};

    ${(props) => {
      const trackColor = helpers.getTrackColor(props.row);
      if (!props.activated) {
        return `
          background: linear-gradient(135deg, ${theme.colors.hover}, ${
          theme.colors.tertiary
        });
          border: 2px solid ${trackColor.primary};
          box-shadow: ${helpers.glow(trackColor.primary, 15)};
        `;
      }
      return `
        box-shadow: ${helpers.glow(trackColor.primary, 25)};
      `;
    }}
  }

  /* Active state */
  &:active {
    transform: translateY(0) scale(0.98);
  }

  /* Focus for accessibility */
  ${helpers.focus()}

  /* Step indicator */
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
      width: 12px;
      height: 12px;
      background: ${theme.colors.text.secondary};
      border-radius: 50%;
      opacity: 0.8;
      animation: stepPulse 0.3s ease-out;
    }
    
    @keyframes stepPulse {
      0% { 
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
      }
      50% { 
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 1;
      }
      100% { 
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.8;
      }
    }
  `}

  /* Velocity indicator for activated cells */
  ${(props) =>
    props.activated &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 3px;
      right: 3px;
      width: 8px;
      height: 8px;
      background: ${helpers.getTrackColor(props.row).secondary};
      border-radius: 50%;
      opacity: 0.9;
      box-shadow: 0 0 4px ${helpers.getTrackColor(props.row).primary};
    }
  `}

  /* Mobile responsive */
  ${theme.media.mobile} {
    width: ${theme.components.cell.sizeSmall};
    height: ${theme.components.cell.sizeSmall};
    margin: 1px;
    border-radius: ${theme.borderRadius.md};

    &:hover {
      transform: scale(1.1);
    }
  }
`;

export default Cell;
