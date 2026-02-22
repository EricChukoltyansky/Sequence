const steps = 16;
const initialCellState = { activated: false };
const lineMap = [
  "F#", // Piano/Trumpet top note
  "E", // Piano/Trumpet
  "C#", // Piano/Trumpet
  "A", // Piano/Trumpet
  "F#", // Piano/Trumpet bottom note
  "F#", // Bass top note
  "E", // Bass
  "C#", // Bass
  "B", // Bass bottom note
  "OH", // Drums - Open Hi-hat
  "CH", // Drums - Closed Hi-hat
  "CP", // Drums - Clap/Snare
  "BD", // Drums - Bass Drum/Kick
];

const initialState = lineMap.map(() => {
  return new Array(steps).fill(initialCellState);
});

export { steps, lineMap, initialState };
