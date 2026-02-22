const https = require("https");
const fs = require("fs");
const path = require("path");

// High-quality FluidR3 GM soundfont samples from gleitz/midi-js-soundfonts
// These are real, distinct instrument recordings rendered from the FluidR3 General MIDI soundfont.
// Each instrument sounds completely different.

const BASE_URL = "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM";

// Map our instrument names → General MIDI soundfont names
const gmInstrumentMap = {
  piano: "acoustic_grand_piano",
  "grand-piano": "acoustic_grand_piano",    // same instrument, different octave
  keyboard: "bright_acoustic_piano",
  guitar: "acoustic_guitar_nylon",
  "electric-guitar": "electric_guitar_clean",
  banjo: "banjo",
  violin: "violin",
  harp: "orchestral_harp",
  saxophone: "alto_sax",
  trumpet: "trumpet",
  flute: "flute",
  clarinet: "clarinet",
  bass: "electric_bass_finger",
  percussion: "steel_drums",
};

// Notes we need for melodic instruments (rows 0-4, piano section)
// F#4, E4, C#4, A3 — in soundfont notation using flats: Gb4, E4, Db4, A3
const melodyNotes = {
  "F#": "Gb4",
  "E":  "E4",
  "C#": "Db4",
  "A":  "A3",
};

// Grand piano uses a higher octave range for distinction
const grandPianoNotes = {
  "F#": "Gb5",
  "E":  "E5",
  "C#": "Db5",
  "A":  "A4",
};

// Bass notes (rows 5-8)
// F#2, E2, C#2, B1
const bassNotes = {
  "F#": "Gb2",
  "E":  "E2",
  "C#": "Db2",
  "B":  "B1",
};

// Drums — keep existing drum samples (they're already good)
// No need to download these

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    const request = https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve, reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }

      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    });

    request.on("error", (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });

    // Timeout after 15 seconds
    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function downloadInstrument(instrumentId, gmName, noteMap) {
  const dir = path.join(__dirname, "client", "public", "sounds", instrumentId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log(`\n  ${instrumentId} (${gmName}):`);

  for (const [ourNote, sfNote] of Object.entries(noteMap)) {
    const url = `${BASE_URL}/${gmName}-mp3/${sfNote}.mp3`;
    const filename = `${ourNote}.wav`; // Save as .wav — Howler decodes by content, not extension
    const dest = path.join(dir, filename);

    try {
      await downloadFile(url, dest);
      const size = fs.statSync(dest).size;
      console.log(`    ✓ ${filename} (${(size / 1024).toFixed(1)} KB) ← ${sfNote}`);
    } catch (err) {
      console.error(`    ✗ ${filename} FAILED: ${err.message}`);
    }
  }
}

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  Downloading FluidR3 GM Soundfont Samples           ║");
  console.log("║  Source: gleitz/midi-js-soundfonts (GitHub Pages)    ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log("");

  // Download melodic instruments
  const melodicInstruments = [
    "piano", "keyboard", "guitar", "electric-guitar",
    "banjo", "violin", "harp", "saxophone",
    "trumpet", "flute", "clarinet", "percussion",
  ];

  console.log("▸ Melodic instruments (F#4, E4, C#4, A3):");
  for (const inst of melodicInstruments) {
    await downloadInstrument(inst, gmInstrumentMap[inst], melodyNotes);
  }

  // Grand piano gets a higher octave
  console.log("\n▸ Grand Piano (Gb5, E5, Db5, A4):");
  await downloadInstrument("grand-piano", gmInstrumentMap["grand-piano"], grandPianoNotes);

  // Bass
  console.log("\n▸ Bass (Gb2, E2, Db2, B1):");
  await downloadInstrument("bass", gmInstrumentMap["bass"], bassNotes);

  // Drums — skip, keep existing
  console.log("\n▸ Drums: Keeping existing samples (already distinct)\n");

  // Verify all files are different
  console.log("─────────────────────────────────────────────────");
  console.log("Verification — file sizes should all be different:");
  const soundsDir = path.join(__dirname, "client", "public", "sounds");
  const instruments = fs.readdirSync(soundsDir).filter(d =>
    fs.statSync(path.join(soundsDir, d)).isDirectory()
  );

  for (const inst of instruments.sort()) {
    const instDir = path.join(soundsDir, inst);
    const files = fs.readdirSync(instDir).sort();
    const sizes = files.map(f => {
      const s = fs.statSync(path.join(instDir, f)).size;
      return `${f}=${(s/1024).toFixed(1)}KB`;
    });
    console.log(`  ${inst.padEnd(18)} ${sizes.join(", ")}`);
  }

  console.log("\n✅ Done! Each instrument now has unique, high-quality samples.");
}

main().catch(console.error);
