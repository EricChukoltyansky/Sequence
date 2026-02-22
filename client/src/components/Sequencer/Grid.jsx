import React from "react";
import Frame from "./Frame";
import Cell from "./Cell";

const Grid = ({ sequence, handleToggleStep, currentStep, onCellSettingsClick }) => (
  <Frame rows={13} columns={16}>
    {sequence.map((line, i) =>
      line.map((time, j) => (
        <Cell
          key={`${i}-${j}`}
          column={j + 1}
          row={i + 1}
          activated={sequence[i][j].activated}
          triggered={j === currentStep}
          hasSettings={!!sequence[i][j].settings}
          onClick={() => handleToggleStep(i, j)}
          onCellSettingsClick={onCellSettingsClick}
        />
      ))
    )}
  </Frame>
);

export default React.memo(Grid);
