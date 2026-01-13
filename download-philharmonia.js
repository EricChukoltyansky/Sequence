const https = require("https");
const fs = require("fs");
const path = require("path");

// Philharmonia samples are organized differently
// They use format: instrument_note_dynamic_style.mp3
// Available at: https://philharmonia.co.uk/wp-content/uploads/sample-name.mp3

const instruments = {
  trumpet: {
    "F#": "https://philharmonia.co.uk/wp-content/uploads/2014/11/trumpet_Fs4_1_forte_normal.mp3",
    E: "https://philharmonia.co.uk/wp-content/uploads/2014/11/trumpet_E4_1_forte_normal.mp3",
    "C#": "https://philharmonia.co.uk/wp-content/uploads/2014/11/trumpet_Cs4_1_forte_normal.mp3",
    A: "https://philharmonia.co.uk/wp-content/uploads/2014/11/trumpet_A3_1_forte_normal.mp3",
  },
  flute: {
    "F#": "https://philharmonia.co.uk/wp-content/uploads/2014/07/flute_Fs4_1_forte_normal.mp3",
    E: "https://philharmonia.co.uk/wp-content/uploads/2014/07/flute_E4_1_forte_normal.mp3",
    "C#": "https://philharmonia.co.uk/wp-content/uploads/2014/07/flute_Cs4_1_forte_normal.mp3",
    A: "https://philharmonia.co.uk/wp-content/uploads/2014/07/flute_A3_1_forte_normal.mp3",
  },
  clarinet: {
    "F#": "https://philharmonia.co.uk/wp-content/uploads/2014/05/clarinet_Fs4_1_forte_normal.mp3",
    E: "https://philharmonia.co.uk/wp-content/uploads/2014/05/clarinet_E4_1_forte_normal.mp3",
    "C#": "https://philharmonia.co.uk/wp-content/uploads/2014/05/clarinet_Cs4_1_forte_normal.mp3",
    A: "https://philharmonia.co.uk/wp-content/uploads/2014/05/clarinet_A3_1_forte_normal.mp3",
  },
  saxophone: {
    "F#": "https://philharmonia.co.uk/wp-content/uploads/2016/11/saxophone_Fs4_1_forte_normal.mp3",
    E: "https://philharmonia.co.uk/wp-content/uploads/2016/11/saxophone_E4_1_forte_normal.mp3",
    "C#": "https://philharmonia.co.uk/wp-content/uploads/2016/11/saxophone_Cs4_1_forte_normal.mp3",
    A: "https://philharmonia.co.uk/wp-content/uploads/2016/11/saxophone_A3_1_forte_normal.mp3",
  },
  violin: {
    "F#": "https://philharmonia.co.uk/wp-content/uploads/2016/03/violin_Fs4_1_forte_arco-normal.mp3",
    E: "https://philharmonia.co.uk/wp-content/uploads/2016/03/violin_E4_1_forte_arco-normal.mp3",
    "C#": "https://philharmonia.co.uk/wp-content/uploads/2016/03/violin_Cs4_1_forte_arco-normal.mp3",
    A: "https://philharmonia.co.uk/wp-content/uploads/2016/03/violin_A3_1_forte_arco-normal.mp3",
  },
  harp: {
    "F#": "https://philharmonia.co.uk/wp-content/uploads/2014/07/harp_Fs4_1_forte_normal.mp3",
    E: "https://philharmonia.co.uk/wp-content/uploads/2014/07/harp_E4_1_forte_normal.mp3",
    "C#": "https://philharmonia.co.uk/wp-content/uploads/2014/07/harp_Cs4_1_forte_normal.mp3",
    A: "https://philharmonia.co.uk/wp-content/uploads/2014/07/harp_A3_1_forte_normal.mp3",
  },
  guitar: {
    "F#": "https://philharmonia.co.uk/wp-content/uploads/2014/07/guitar_Fs4_1_forte_normal.mp3",
    E: "https://philharmonia.co.uk/wp-content/uploads/2014/07/guitar_E4_1_forte_normal.mp3",
    "C#": "https://philharmonia.co.uk/wp-content/uploads/2014/07/guitar_Cs4_1_forte_normal.mp3",
    A: "https://philharmonia.co.uk/wp-content/uploads/2014/07/guitar_A3_1_forte_normal.mp3",
  },
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (res) => {
          if (res.statusCode === 200) {
            res.pipe(file);
            file.on("finish", () => {
              file.close();
              console.log(`✓ Downloaded: ${path.basename(dest)}`);
              resolve();
            });
          } else {
            fs.unlink(dest, () => {});
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        }).on("error", reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(dest)}`);
          resolve();
        });
      } else {
        fs.unlink(dest, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log("Downloading Philharmonia Orchestra samples...\n");
  
  for (const [instrument, notes] of Object.entries(instruments)) {
    console.log(`Downloading ${instrument}...`);
    const dir = path.join(__dirname, "client", "public", "sounds", instrument);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    for (const [noteName, url] of Object.entries(notes)) {
      const dest = path.join(dir, `${noteName}.mp3`);
      
      try {
        await downloadFile(url, dest);
        await new Promise(resolve => setTimeout(resolve, 500)); // Be nice to their server
      } catch (error) {
        console.error(`✗ Failed ${instrument} ${noteName}:`, error.message);
      }
    }
    console.log("");
  }
  
  console.log("✅ Download complete!");
}

downloadAll().catch(console.error);
