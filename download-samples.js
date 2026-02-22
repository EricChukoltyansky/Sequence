const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Free sample sources
const samples = {
  // Piano samples from Salamander Grand Piano (free, public domain)
  piano: [
    {
      url: "https://tonejs.github.io/audio/salamander/A4.mp3",
      name: "high.wav",
    },
    {
      url: "https://tonejs.github.io/audio/salamander/C4.mp3",
      name: "mid-high.wav",
    },
    {
      url: "https://tonejs.github.io/audio/salamander/F3.mp3",
      name: "mid.wav",
    },
    {
      url: "https://tonejs.github.io/audio/salamander/A2.mp3",
      name: "mid-low.wav",
    },
    {
      url: "https://tonejs.github.io/audio/salamander/C2.mp3",
      name: "low.wav",
    },
  ],
  "grand-piano": [
    {
      url: "https://tonejs.github.io/audio/salamander/A5.mp3",
      name: "high.wav",
    },
    {
      url: "https://tonejs.github.io/audio/salamander/C5.mp3",
      name: "mid-high.wav",
    },
    {
      url: "https://tonejs.github.io/audio/salamander/F4.mp3",
      name: "mid.wav",
    },
    {
      url: "https://tonejs.github.io/audio/salamander/A3.mp3",
      name: "mid-low.wav",
    },
    {
      url: "https://tonejs.github.io/audio/salamander/C3.mp3",
      name: "low.wav",
    },
  ],
  // Casio samples for keyboard
  keyboard: [
    { url: "https://tonejs.github.io/audio/casio/A4.mp3", name: "high.wav" },
    {
      url: "https://tonejs.github.io/audio/casio/C4.mp3",
      name: "mid-high.wav",
    },
    { url: "https://tonejs.github.io/audio/casio/F3.mp3", name: "mid.wav" },
    { url: "https://tonejs.github.io/audio/casio/A2.mp3", name: "mid-low.wav" },
    { url: "https://tonejs.github.io/audio/casio/C2.mp3", name: "low.wav" },
  ],
  // Guitar samples
  guitar: [
    {
      url: "https://tonejs.github.io/audio/harmonics/A4.mp3",
      name: "high.wav",
    },
    {
      url: "https://tonejs.github.io/audio/harmonics/C4.mp3",
      name: "mid-high.wav",
    },
    { url: "https://tonejs.github.io/audio/harmonics/F3.mp3", name: "mid.wav" },
    {
      url: "https://tonejs.github.io/audio/harmonics/A2.mp3",
      name: "mid-low.wav",
    },
    { url: "https://tonejs.github.io/audio/harmonics/C2.mp3", name: "low.wav" },
  ],
  // Drum samples from Tone.js examples
  drums: [
    {
      url: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/kick.mp3",
      name: "kick.wav",
    },
    {
      url: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/snare.mp3",
      name: "snare.wav",
    },
    {
      url: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/hihat.mp3",
      name: "hihat-open.wav",
    },
    {
      url: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/tom1.mp3",
      name: "hihat-closed.wav",
    },
  ],
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);

    protocol
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            console.log(`✓ Downloaded: ${path.basename(dest)}`);
            resolve();
          });
        } else {
          fs.unlink(dest, () => {});
          reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`)
          );
        }
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function downloadAllSamples() {
  console.log("Downloading instrument samples...\n");

  for (const [instrument, files] of Object.entries(samples)) {
    console.log(`Downloading ${instrument} samples...`);
    const dir = path.join(__dirname, "client", "public", "sounds", instrument);

    for (const file of files) {
      const dest = path.join(dir, file.name);
      try {
        await downloadFile(file.url, dest);
      } catch (error) {
        console.error(`✗ Error downloading ${file.name}:`, error.message);
      }
    }
    console.log("");
  }

  // Copy existing sounds to other instruments as fallbacks
  console.log("Creating fallback sounds for other instruments...");
  const soundsDir = path.join(__dirname, "client", "public", "sounds");

  // Copy piano to missing instruments
  const instrumentsToCopy = [
    "electric-guitar",
    "banjo",
    "violin",
    "harp",
    "saxophone",
    "trumpet",
    "flute",
    "clarinet",
    "percussion",
  ];
  for (const inst of instrumentsToCopy) {
    const sourceDir = path.join(soundsDir, "piano");
    const targetDir = path.join(soundsDir, inst);

    fs.readdirSync(sourceDir).forEach((file) => {
      const source = path.join(sourceDir, file);
      const target = path.join(targetDir, file);
      if (!fs.existsSync(target)) {
        fs.copyFileSync(source, target);
        console.log(`✓ Copied ${file} to ${inst}/`);
      }
    });
  }

  // Copy existing bass sounds
  const existingBass = ["bassFS.wav", "bassEF.wav", "bassCS.wav", "bassBF.wav"];
  const bassFiles = ["high.wav", "mid-high.wav", "mid.wav", "low.wav"];
  existingBass.forEach((file, i) => {
    const source = path.join(soundsDir, file);
    const target = path.join(soundsDir, "bass", bassFiles[i]);
    if (fs.existsSync(source) && !fs.existsSync(target)) {
      fs.copyFileSync(source, target);
      console.log(`✓ Copied ${file} to bass/${bassFiles[i]}`);
    }
  });

  console.log("\n✅ All samples downloaded and organized!");
}

downloadAllSamples().catch(console.error);
