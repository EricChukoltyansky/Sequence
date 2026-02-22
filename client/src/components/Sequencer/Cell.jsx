import React from "react";
import styled from "styled-components";
import { theme, helpers } from "../../theme";

// Pre-compute track colors for all 13 rows so we don't call helpers every render
const trackColors = {};
for (let r = 1; r <= 13; r++) {
  trackColors[r] = helpers.getTrackColor(r);
}

// Compute inline styles based on activated/triggered/row — avoids styled-components class generation
function getCellStyle(activated, triggered, row) {
  const tc = trackColors[row] || trackColors[1];

  if (activated && triggered) {
    return {
      background: `linear-gradient(135deg, ${tc.primary}, ${tc.secondary})`,
      border: `2px solid ${tc.primary}`,
      boxShadow: `0 0 25px ${tc.primary}40, inset 0 2px 4px rgba(255,255,255,0.1)`,
    };
  }
  if (activated) {
    return {
      background: `linear-gradient(135deg, ${tc.background}, ${theme.colors.tertiary})`,
      border: `2px solid ${tc.primary}`,
      boxShadow: `0 0 10px ${tc.primary}30, inset 0 1px 2px rgba(255,255,255,0.05)`,
    };
  }
  if (triggered) {
    return {
      background: `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.tertiary})`,
      border: `2px solid ${theme.colors.borderLight}`,
      boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.05)`,
    };
  }
  return {
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: `0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.03)`,
  };
}

// All dynamic visuals are inline styles via .attrs() — ONE static CSS class, zero class churn
const StyledCell = styled.div.attrs(({ activated, triggered, row }) => ({
  style: getCellStyle(activated, triggered, row),
}))`
  width: 4rem;
  height: 4rem;
  border-radius: ${theme.borderRadius.lg};
  grid-column: ${(props) => props.column};
  grid-row: ${(props) => props.row};
  margin: 2px;
  position: relative;
  cursor: pointer;
  user-select: none;
  transition: all ${theme.transitions.fast};

  &:hover {
    transform: translateY(-1px) scale(1.02);
    border-radius: ${theme.borderRadius.xl};
  }

  &:active {
    transform: translateY(0) scale(0.98);
    transition: all ${theme.transitions.fast};
  }

  ${helpers.focus()}

  ${theme.media.mobile} {
    width: 2.5rem;
    height: 2.5rem;
    margin: 1px;
    border-radius: ${theme.borderRadius.md};

    &:hover {
      transform: scale(1.05);
      border-radius: ${theme.borderRadius.lg};
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
    &:hover { transform: none; }
    &:active { transform: none; }
  }
`;

const GearButton = styled.button`
  position: absolute;
  top: 3px;
  right: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.75);
  font-size: 9px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 150ms ease, transform 200ms ease;
  z-index: 2;
  padding: 0;
  line-height: 1;

  ${StyledCell}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    transform: rotate(60deg) scale(1.15);
  }
`;

const SettingsDot = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => (props.filled ? props.color || "#fff" : "transparent")};
  border: 1px solid ${(props) => props.color || "#fff"}${(props) => (props.filled ? "" : "60")};
  box-shadow: ${(props) => (props.filled ? `0 0 6px ${props.color || "#fff"}80` : "none")};
  pointer-events: none;
`;

function Cell({ activated, triggered, row, column, onClick, onCellSettingsClick, hasSettings }) {
  const handleGearClick = (e) => {
    e.stopPropagation();
    if (onCellSettingsClick) onCellSettingsClick(row - 1, column - 1);
  };

  const tc = trackColors[row];

  return (
    <StyledCell
      activated={activated}
      triggered={triggered}
      row={row}
      column={column}
      onClick={onClick}
    >
      {activated && (
        <GearButton onClick={handleGearClick} title="Cell sound settings">
          ⚙
        </GearButton>
      )}
      {activated && (
        <SettingsDot color={tc?.primary} filled={hasSettings} />
      )}
    </StyledCell>
  );
}

export default React.memo(Cell, (prevProps, nextProps) => {
  return (
    prevProps.activated === nextProps.activated &&
    prevProps.triggered === nextProps.triggered &&
    prevProps.row === nextProps.row &&
    prevProps.column === nextProps.column &&
    prevProps.hasSettings === nextProps.hasSettings
  );
});
