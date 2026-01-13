// Instrument sound mappings for the sequencer
// Maps instrument IDs to their corresponding sound sample names

export const instrumentSoundMap = {
  // Piano/Keyboard instruments
  piano: {
    type: "piano",
    samples: {
      CATHFS: "piano-high",
      CATEF: "piano-mid-high",
      CATCS: "piano-mid",
      CATAF: "piano-mid-low",
      CATFS: "piano-low",
    },
  },
  "grand-piano": {
    type: "piano",
    samples: {
      CATHFS: "grand-piano-high",
      CATEF: "grand-piano-mid-high",
      CATCS: "grand-piano-mid",
      CATAF: "grand-piano-mid-low",
      CATFS: "grand-piano-low",
    },
  },
  keyboard: {
    type: "synth",
    samples: {
      CATHFS: "synth-high",
      CATEF: "synth-mid-high",
      CATCS: "synth-mid",
      CATAF: "synth-mid-low",
      CATFS: "synth-low",
    },
  },

  // String instruments
  guitar: {
    type: "guitar",
    samples: {
      CATHFS: "guitar-high",
      CATEF: "guitar-mid-high",
      CATCS: "guitar-mid",
      CATAF: "guitar-mid-low",
      CATFS: "guitar-low",
    },
  },
  "electric-guitar": {
    type: "guitar",
    samples: {
      CATHFS: "electric-guitar-high",
      CATEF: "electric-guitar-mid-high",
      CATCS: "electric-guitar-mid",
      CATAF: "electric-guitar-mid-low",
      CATFS: "electric-guitar-low",
    },
  },
  banjo: {
    type: "guitar",
    samples: {
      CATHFS: "banjo-high",
      CATEF: "banjo-mid-high",
      CATCS: "banjo-mid",
      CATAF: "banjo-mid-low",
      CATFS: "banjo-low",
    },
  },
  violin: {
    type: "strings",
    samples: {
      CATHFS: "violin-high",
      CATEF: "violin-mid-high",
      CATCS: "violin-mid",
      CATAF: "violin-mid-low",
      CATFS: "violin-low",
    },
  },
  harp: {
    type: "strings",
    samples: {
      CATHFS: "harp-high",
      CATEF: "harp-mid-high",
      CATCS: "harp-mid",
      CATAF: "harp-mid-low",
      CATFS: "harp-low",
    },
  },

  // Bass instruments
  bass: {
    type: "bass",
    samples: {
      FS: "bass-high",
      EF: "bass-mid-high",
      CS: "bass-mid",
      BF: "bass-low",
    },
  },

  // Wind instruments
  saxophone: {
    type: "woodwind",
    samples: {
      CATHFS: "saxophone-high",
      CATEF: "saxophone-mid-high",
      CATCS: "saxophone-mid",
      CATAF: "saxophone-mid-low",
      CATFS: "saxophone-low",
    },
  },
  trumpet: {
    type: "brass",
    samples: {
      CATHFS: "trumpet-high",
      CATEF: "trumpet-mid-high",
      CATCS: "trumpet-mid",
      CATAF: "trumpet-mid-low",
      CATFS: "trumpet-low",
    },
  },
  flute: {
    type: "woodwind",
    samples: {
      CATHFS: "flute-high",
      CATEF: "flute-mid-high",
      CATCS: "flute-mid",
      CATAF: "flute-mid-low",
      CATFS: "flute-low",
    },
  },
  clarinet: {
    type: "woodwind",
    samples: {
      CATHFS: "clarinet-high",
      CATEF: "clarinet-mid-high",
      CATCS: "clarinet-mid",
      CATAF: "clarinet-mid-low",
      CATFS: "clarinet-low",
    },
  },

  // Percussion instruments
  drums: {
    type: "drums",
    samples: {
      OH: "drums-hihat-open",
      CH: "drums-hihat-closed",
      CP: "drums-clap",
      BD: "drums-kick",
    },
  },
  percussion: {
    type: "percussion",
    samples: {
      OH: "percussion-hihat-open",
      CH: "percussion-hihat-closed",
      CP: "percussion-clap",
      BD: "percussion-kick",
    },
  },
};

// Helper function to get sound sample name for an instrument and note
export const getSoundSample = (instrumentId, noteName) => {
  const instrument = instrumentSoundMap[instrumentId];
  if (!instrument) {
    console.warn(`Instrument ${instrumentId} not found in sound map`);
    return noteName; // Fallback to original note name
  }

  const sample = instrument.samples[noteName];
  if (!sample) {
    console.warn(`Note ${noteName} not found for instrument ${instrumentId}`);
    return noteName; // Fallback to original note name
  }

  return sample;
};

// Helper function to get the instrument type category
export const getInstrumentType = (instrumentId) => {
  const instrument = instrumentSoundMap[instrumentId];
  return instrument?.type || "unknown";
};

export default instrumentSoundMap;
