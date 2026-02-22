// EffectsEngine.js — Real-time audio effects using Web Audio API
// Effects: Distortion, Filter, Reverb, Delay, Compressor

function makeDistortionCurve(amount) {
  const k = Math.max(0, Math.min(150, amount));
  const n = 44100;
  const curve = new Float32Array(n);
  const deg = Math.PI / 180;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

function generateReverbIR(ctx, duration = 2.0, decay = 3.0) {
  const length = Math.floor(ctx.sampleRate * Math.max(0.1, duration));
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

// Default effect settings (all disabled)
export const defaultEffectSettings = {
  distortion: { enabled: false, amount: 30 },
  filter: { enabled: false, type: "lowpass", frequency: 5000, Q: 1.0 },
  reverb: { enabled: false, mix: 30, decay: 2.0 },
  delay: { enabled: false, time: 250, feedback: 30, mix: 25 },
  compressor: { enabled: false, threshold: -24, ratio: 4 },
};

// Instrument-specific preset defaults (still all disabled, but tuned starting values)
export const instrumentEffectPresets = {
  piano: {
    distortion: { enabled: false, amount: 15 },
    filter: { enabled: false, type: "lowpass", frequency: 8000, Q: 0.7 },
    reverb: { enabled: false, mix: 35, decay: 2.5 },
    delay: { enabled: false, time: 300, feedback: 25, mix: 20 },
    compressor: { enabled: false, threshold: -20, ratio: 3 },
  },
  "grand-piano": {
    distortion: { enabled: false, amount: 10 },
    filter: { enabled: false, type: "lowpass", frequency: 10000, Q: 0.5 },
    reverb: { enabled: false, mix: 40, decay: 3.0 },
    delay: { enabled: false, time: 350, feedback: 20, mix: 15 },
    compressor: { enabled: false, threshold: -22, ratio: 2.5 },
  },
  keyboard: {
    distortion: { enabled: false, amount: 25 },
    filter: { enabled: false, type: "lowpass", frequency: 6000, Q: 1.5 },
    reverb: { enabled: false, mix: 25, decay: 1.5 },
    delay: { enabled: false, time: 200, feedback: 35, mix: 30 },
    compressor: { enabled: false, threshold: -18, ratio: 3.5 },
  },
  guitar: {
    distortion: { enabled: false, amount: 35 },
    filter: { enabled: false, type: "lowpass", frequency: 6000, Q: 1.0 },
    reverb: { enabled: false, mix: 30, decay: 2.0 },
    delay: { enabled: false, time: 250, feedback: 30, mix: 25 },
    compressor: { enabled: false, threshold: -20, ratio: 4 },
  },
  "electric-guitar": {
    distortion: { enabled: false, amount: 60 },
    filter: { enabled: false, type: "lowpass", frequency: 5000, Q: 2.0 },
    reverb: { enabled: false, mix: 25, decay: 1.5 },
    delay: { enabled: false, time: 300, feedback: 35, mix: 30 },
    compressor: { enabled: false, threshold: -15, ratio: 5 },
  },
  banjo: {
    distortion: { enabled: false, amount: 10 },
    filter: { enabled: false, type: "lowpass", frequency: 7000, Q: 0.8 },
    reverb: { enabled: false, mix: 20, decay: 1.5 },
    delay: { enabled: false, time: 200, feedback: 20, mix: 15 },
    compressor: { enabled: false, threshold: -20, ratio: 3 },
  },
  violin: {
    distortion: { enabled: false, amount: 10 },
    filter: { enabled: false, type: "lowpass", frequency: 9000, Q: 0.5 },
    reverb: { enabled: false, mix: 40, decay: 2.5 },
    delay: { enabled: false, time: 350, feedback: 20, mix: 15 },
    compressor: { enabled: false, threshold: -22, ratio: 2 },
  },
  harp: {
    distortion: { enabled: false, amount: 5 },
    filter: { enabled: false, type: "lowpass", frequency: 10000, Q: 0.3 },
    reverb: { enabled: false, mix: 45, decay: 3.0 },
    delay: { enabled: false, time: 400, feedback: 15, mix: 20 },
    compressor: { enabled: false, threshold: -25, ratio: 2 },
  },
  saxophone: {
    distortion: { enabled: false, amount: 20 },
    filter: { enabled: false, type: "lowpass", frequency: 7000, Q: 1.0 },
    reverb: { enabled: false, mix: 30, decay: 2.0 },
    delay: { enabled: false, time: 300, feedback: 25, mix: 20 },
    compressor: { enabled: false, threshold: -18, ratio: 3 },
  },
  trumpet: {
    distortion: { enabled: false, amount: 15 },
    filter: { enabled: false, type: "lowpass", frequency: 8000, Q: 0.8 },
    reverb: { enabled: false, mix: 25, decay: 1.8 },
    delay: { enabled: false, time: 250, feedback: 20, mix: 15 },
    compressor: { enabled: false, threshold: -20, ratio: 3.5 },
  },
  flute: {
    distortion: { enabled: false, amount: 5 },
    filter: { enabled: false, type: "lowpass", frequency: 12000, Q: 0.3 },
    reverb: { enabled: false, mix: 40, decay: 2.5 },
    delay: { enabled: false, time: 350, feedback: 20, mix: 20 },
    compressor: { enabled: false, threshold: -25, ratio: 2 },
  },
  clarinet: {
    distortion: { enabled: false, amount: 10 },
    filter: { enabled: false, type: "lowpass", frequency: 8000, Q: 0.7 },
    reverb: { enabled: false, mix: 30, decay: 2.0 },
    delay: { enabled: false, time: 300, feedback: 20, mix: 15 },
    compressor: { enabled: false, threshold: -22, ratio: 2.5 },
  },
  bass: {
    distortion: { enabled: false, amount: 50 },
    filter: { enabled: false, type: "lowpass", frequency: 3000, Q: 2.0 },
    reverb: { enabled: false, mix: 15, decay: 1.0 },
    delay: { enabled: false, time: 200, feedback: 20, mix: 15 },
    compressor: { enabled: false, threshold: -18, ratio: 6 },
  },
  drums: {
    distortion: { enabled: false, amount: 35 },
    filter: { enabled: false, type: "lowpass", frequency: 8000, Q: 1.0 },
    reverb: { enabled: false, mix: 20, decay: 0.8 },
    delay: { enabled: false, time: 150, feedback: 15, mix: 10 },
    compressor: { enabled: false, threshold: -15, ratio: 8 },
  },
  percussion: {
    distortion: { enabled: false, amount: 25 },
    filter: { enabled: false, type: "lowpass", frequency: 7000, Q: 1.5 },
    reverb: { enabled: false, mix: 25, decay: 1.0 },
    delay: { enabled: false, time: 180, feedback: 20, mix: 15 },
    compressor: { enabled: false, threshold: -18, ratio: 6 },
  },
};

/**
 * Create an audio effects chain on a given AudioContext.
 * Chain: input → distortion → filter → delay → reverb → compressor → output
 */
export function createEffectsChain(audioContext) {
  const ctx = audioContext;

  // --- Create all nodes ---

  // Input / output
  const input = ctx.createGain();
  const output = ctx.createGain();

  // Distortion (dry/wet)
  const distortion = ctx.createWaveShaper();
  distortion.oversample = "4x";
  distortion.curve = makeDistortionCurve(0);
  const distDry = ctx.createGain();
  const distWet = ctx.createGain();
  distDry.gain.value = 1;
  distWet.gain.value = 0;

  // Filter
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 20000; // pass-through by default
  filter.Q.value = 0.0001;

  // Delay (dry/wet with feedback)
  const delayNode = ctx.createDelay(2.0);
  delayNode.delayTime.value = 0.25;
  const delayFeedback = ctx.createGain();
  delayFeedback.gain.value = 0;
  const delayDry = ctx.createGain();
  const delayWet = ctx.createGain();
  delayDry.gain.value = 1;
  delayWet.gain.value = 0;

  // Reverb (dry/wet)
  let reverbNode;
  try {
    reverbNode = ctx.createConvolver();
    reverbNode.buffer = generateReverbIR(ctx, 2.0, 3.0);
  } catch (e) {
    console.warn("Failed to create reverb convolver:", e);
    reverbNode = null;
  }
  const reverbDry = ctx.createGain();
  const reverbWet = ctx.createGain();
  reverbDry.gain.value = 1;
  reverbWet.gain.value = 0;

  // Compressor
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = 0;
  compressor.ratio.value = 1;
  compressor.knee.value = 40;

  // --- Build the chain ---

  // Distortion section: input → dry/wet → postDist
  const postDist = ctx.createGain();
  input.connect(distDry);
  input.connect(distortion);
  distortion.connect(distWet);
  distDry.connect(postDist);
  distWet.connect(postDist);

  // Filter
  postDist.connect(filter);

  // Delay section: filter → dry/wet → postDelay
  const postDelay = ctx.createGain();
  filter.connect(delayDry);
  filter.connect(delayNode);
  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);
  delayNode.connect(delayWet);
  delayDry.connect(postDelay);
  delayWet.connect(postDelay);

  // Reverb section: postDelay → dry/wet → postReverb
  const postReverb = ctx.createGain();
  if (reverbNode) {
    postDelay.connect(reverbDry);
    postDelay.connect(reverbNode);
    reverbNode.connect(reverbWet);
    reverbDry.connect(postReverb);
    reverbWet.connect(postReverb);
  } else {
    postDelay.connect(postReverb);
  }

  // Compressor → output
  postReverb.connect(compressor);
  compressor.connect(output);

  // --- State tracking ---
  let currentSettings = JSON.parse(JSON.stringify(defaultEffectSettings));
  let lastReverbDecay = 2.0;

  const chain = {
    input,
    output,

    update(settings) {
      // Distortion
      if (settings.distortion !== undefined) {
        const d = settings.distortion;
        currentSettings.distortion = { ...d };
        if (d.enabled) {
          distDry.gain.value = 0;
          distWet.gain.value = 1;
          distortion.curve = makeDistortionCurve(d.amount || 30);
        } else {
          distDry.gain.value = 1;
          distWet.gain.value = 0;
        }
      }

      // Filter
      if (settings.filter !== undefined) {
        const f = settings.filter;
        currentSettings.filter = { ...f };
        if (f.enabled) {
          filter.type = f.type || "lowpass";
          filter.frequency.value = Math.max(20, Math.min(20000, f.frequency || 5000));
          filter.Q.value = Math.max(0.0001, Math.min(30, f.Q || 1.0));
        } else {
          filter.type = "lowpass";
          filter.frequency.value = 20000;
          filter.Q.value = 0.0001;
        }
      }

      // Reverb
      if (settings.reverb !== undefined && reverbNode) {
        const r = settings.reverb;
        currentSettings.reverb = { ...r };
        if (r.enabled) {
          const mix = Math.max(0, Math.min(100, r.mix || 30)) / 100;
          reverbDry.gain.value = 1 - mix * 0.5;
          reverbWet.gain.value = mix;
          if (Math.abs((r.decay || 2.0) - lastReverbDecay) > 0.2) {
            lastReverbDecay = r.decay || 2.0;
            try {
              reverbNode.buffer = generateReverbIR(ctx, lastReverbDecay, 3.0);
            } catch (e) {
              /* ignore IR regen errors */
            }
          }
        } else {
          reverbDry.gain.value = 1;
          reverbWet.gain.value = 0;
        }
      }

      // Delay
      if (settings.delay !== undefined) {
        const dl = settings.delay;
        currentSettings.delay = { ...dl };
        if (dl.enabled) {
          delayNode.delayTime.value = Math.max(0.01, (dl.time || 250) / 1000);
          delayFeedback.gain.value = Math.min(0.9, (dl.feedback || 30) / 100);
          const mix = Math.max(0, Math.min(100, dl.mix || 25)) / 100;
          delayDry.gain.value = 1 - mix * 0.5;
          delayWet.gain.value = mix;
        } else {
          delayDry.gain.value = 1;
          delayWet.gain.value = 0;
          delayFeedback.gain.value = 0;
        }
      }

      // Compressor
      if (settings.compressor !== undefined) {
        const c = settings.compressor;
        currentSettings.compressor = { ...c };
        if (c.enabled) {
          compressor.threshold.value = Math.max(-100, Math.min(0, c.threshold || -24));
          compressor.ratio.value = Math.max(1, Math.min(20, c.ratio || 4));
          compressor.knee.value = 10;
        } else {
          compressor.threshold.value = 0;
          compressor.ratio.value = 1;
          compressor.knee.value = 40;
        }
      }
    },

    hasAnyEnabled() {
      return (
        currentSettings.distortion.enabled ||
        currentSettings.filter.enabled ||
        currentSettings.reverb.enabled ||
        currentSettings.delay.enabled ||
        currentSettings.compressor.enabled
      );
    },

    getSettings() {
      return JSON.parse(JSON.stringify(currentSettings));
    },
  };

  return chain;
}
