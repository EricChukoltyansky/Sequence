const https = require("https");
const fs = require("fs");
const path = require("path");

// MIDI.js Soundfont library - each instrument has unique, real samples
// Source: https://gleitz.github.io/midi-js-soundfonts/
const SOUNDFONT_BASE = "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM";

// Map our instrument IDs to General MIDI instrument names in the soundfont
const instrumentMap = {
  piano:            "acoustic_grand_piano",
  "grand-piano":    "bright_acoustic_piano",
  keyboard:         "electric_piano_1",
  guitar:           "acoustic_guitar_nylon",
  "electric-guitar":"electric_guitar_clean",
  banjo:            "banjo",
  violin:           "violin",
  saxophone:        "alto_sax",
  trumpet:          "trumpet",
  flute:            "flute",
  clarinet:         "clarinet",
  harp:             "orchestral_harp",
  percussion:       "synth_drum",
};

// Notes needed for each track type
// Piano track rows: F#4, E4, C#4, A3, (F#4 again for 5th row)
// Bass track rows:  F#2, E2, C#2, B1
// Note: soundfont uses 's' for sharp, e.g. Fs4 = F#4
const melodicNotes = {
  "F#": "Fs4",
  "E":  "E4",
  "C#": "Cs4",
  "A":  "A3",
};

const bassNotes = {
  "F#": "Fs2",
  "E":  "E2",
  "C#": "Cs2",
  "B":  "B1",
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const makeRequest = (targetUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error("Too many redirects"));
        return;
      }

      const protocol = targetUrl.startsWith("https") ? https : require("http");
      protocol.get(targetUrl, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          makeRequest(response.headers.location, redirectCount + 1);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode} for ${targetUrl}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
        file.on("error", (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      }).on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    };
    makeRequest(url);
  });
}

async function downloadInstrument(instrumentId, soundfontName, notes) {
  const dir = path.join(__dirname, "client", "public", "sounds", instrumentId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log(`\nDownloading ${instrumentId} (${soundfontName})...`);

  for (const [noteName, soundfontNote] of Object.entries(notes)) {
    const url = `${SOUNDFONT_BASE}/${soundfontName}-mp3/${soundfontNote}.mp3`;
    const dest = path.join(dir, `${noteName}.mp3`);

    try {
      await downloadFile(url, dest);
      const size = fs.statSync(dest).size;
      console.log(`  ✓ ${noteName}.mp3 (${(size / 1024).toFixed(1)} KB)`);
    } catch (error) {
      console.error(`  ✗ ${noteName}.mp3 failed: ${error.message}`);
    }

    // Small delay to be nice to the server
    await new Promise(r => setTimeout(r, 300));
  }
}

async function main() {
  console.log("=== Downloading unique instrument samples ===");
  console.log(`Source: ${SOUNDFONT_BASE}\n`);

  // Download melodic instruments (piano-like: F#, E, C#, A)
  for (const [instrumentId, soundfontName] of Object.entries(instrumentMap)) {
    await downloadInstrument(instrumentId, soundfontName, melodicNotes);
  }

  // Download bass with bass-range notes
  await downloadInstrument("bass", "acoustic_bass", bassNotes);

  // Drums are already unique — skip
  console.log("\n✓ Drums already have unique samples — skipping");

  // Summary
  console.log("\n=== Download complete! ===");
  console.log("Verifying uniqueness...\n");

  const soundsDir = path.join(__dirname, "client", "public", "sounds");
  const instruments = fs.readdirSync(soundsDir).filter(d =>
    fs.statSync(path.join(soundsDir, d)).isDirectory()
  );

  for (const inst of instruments) {
    const instDir = path.join(soundsDir, inst);
    const files = fs.readdirSync(instDir);
    const mp3Files = files.filter(f => f.endsWith(".mp3"));
    const wavFiles = files.filter(f => f.endsWith(".wav"));
    const sizes = mp3Files.map(f => fs.statSync(path.join(instDir, f)).size);
    console.log(`  ${inst}: ${mp3Files.length} mp3, ${wavFiles.length} wav — sizes: ${sizes.map(s => `${(s/1024).toFixed(1)}KB`).join(", ")}`);
  }
}

main().catch(console.error);
