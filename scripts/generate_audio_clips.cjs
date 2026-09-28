const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to write a 16-bit PCM WAV file
function createWavFile(filename, durationSec, sampleRate, sampleGenerator) {
  const numChannels = 2;
  const bytesPerSample = 2;
  const totalSamples = Math.floor(durationSec * sampleRate);
  const dataSize = totalSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // ByteRate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const [left, right] = sampleGenerator(t, i);

    const intLeft = Math.max(-32768, Math.min(32767, Math.floor(left * 32767)));
    const intRight = Math.max(-32768, Math.min(32767, Math.floor(right * 32767)));

    buffer.writeInt16LE(intLeft, offset);
    buffer.writeInt16LE(intRight, offset + 2);
    offset += 4;
  }

  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

const sampleRate = 44100;

// ========================================================
// 1. HAPPY BIRTHDAY PARTY REMIX (Upbeat 128 BPM Dance Track)
// ========================================================
console.log('Generating happy_birthday_remix.wav...');
createWavFile('happy_birthday_remix.wav', 12.0, sampleRate, (t, i) => {
  const bpm = 128;
  const beat = (t * bpm) / 60;
  const beatFrac = beat % 1;

  // Kick Drum on every beat
  const kickEnv = Math.exp(-beatFrac * 12);
  const kickFreq = 150 * Math.exp(-beatFrac * 20) + 40;
  const kick = Math.sin(2 * Math.PI * kickFreq * t) * kickEnv * 0.45;

  // Hi-Hat on off-beats
  const offbeatFrac = (beat + 0.5) % 1;
  const hatEnv = Math.exp(-offbeatFrac * 35);
  const hat = (Math.random() * 2 - 1) * hatEnv * 0.15;

  // Happy Birthday Melody Notes
  const notes = [
    { n: 261.63, b: 0, d: 0.75 }, // C4
    { n: 261.63, b: 0.75, d: 0.25 },
    { n: 293.66, b: 1, d: 1 },    // D4
    { n: 261.63, b: 2, d: 1 },    // C4
    { n: 349.23, b: 3, d: 1 },    // F4
    { n: 329.63, b: 4, d: 2 },    // E4

    { n: 261.63, b: 6, d: 0.75 },
    { n: 261.63, b: 6.75, d: 0.25 },
    { n: 293.66, b: 7, d: 1 },
    { n: 261.63, b: 8, d: 1 },
    { n: 392.00, b: 9, d: 1 },    // G4
    { n: 349.23, b: 10, d: 2 },   // F4

    { n: 261.63, b: 12, d: 0.75 },
    { n: 261.63, b: 12.75, d: 0.25 },
    { n: 523.25, b: 13, d: 1 },   // C5
    { n: 440.00, b: 14, d: 1 },   // A4
    { n: 349.23, b: 15, d: 1 },   // F4
    { n: 329.63, b: 16, d: 1 },   // E4
    { n: 293.66, b: 17, d: 2 },   // D4

    { n: 466.16, b: 19, d: 0.75 },
    { n: 466.16, b: 19.75, d: 0.25 },
    { n: 440.00, b: 20, d: 1 },
    { n: 349.23, b: 21, d: 1 },
    { n: 392.00, b: 22, d: 1 },
    { n: 349.23, b: 23, d: 2 },
  ];

  let melody = 0;
  for (const item of notes) {
    if (beat >= item.b && beat < item.b + item.d) {
      const noteT = (beat - item.b) * (60 / bpm);
      const env = Math.sin(Math.min(Math.PI, (noteT / (item.d * (60 / bpm))) * Math.PI));
      const osc = Math.sin(2 * Math.PI * item.n * t) + 0.3 * Math.sin(4 * Math.PI * item.n * t);
      melody += osc * env * 0.35;
      break;
    }
  }

  // Bass Synth Line
  const bassNotes = [130.81, 146.83, 174.61, 196.00];
  const currentBass = bassNotes[Math.floor(beat / 2) % bassNotes.length];
  const bass = Math.sin(2 * Math.PI * currentBass * t) * 0.2;

  const total = (kick + hat + melody + bass) * 0.75;
  return [total, total];
});

// ========================================================
// 2. "PHOOLON KA TAARON KA, SABKA KEHNA HAI" (Sister Song)
// ========================================================
console.log('Generating ek_hazaron_mein.wav...');
createWavFile('ek_hazaron_mein.wav', 14.0, sampleRate, (t, i) => {
  const bpm = 100;
  const beat = (t * bpm) / 60;

  // Phoolon Ka Taaron Ka, Sabka Kehna Hai:
  // C4, D4, E4, E4, E4, F4, E4, D4, C4...
  const sisterMelody = [
    { n: 261.63, b: 0, d: 1 },   // Phoo-
    { n: 293.66, b: 1, d: 1 },   // lon
    { n: 329.63, b: 2, d: 1.5 }, // ka
    { n: 329.63, b: 3.5, d: 1 }, // taa-
    { n: 349.23, b: 4.5, d: 1 }, // ron
    { n: 329.63, b: 5.5, d: 1 }, // ka
    { n: 293.66, b: 6.5, d: 1.5 }, // sab-
    { n: 261.63, b: 8, d: 2 },   // ka kehna hai

    // Ek hazaron mein meri behna hai:
    { n: 329.63, b: 10, d: 1 },  // Ek
    { n: 349.23, b: 11, d: 1 },  // ha-
    { n: 392.00, b: 12, d: 1.5 }, // zaa-
    { n: 392.00, b: 13.5, d: 1 }, // ron
    { n: 440.00, b: 14.5, d: 1 }, // mein
    { n: 392.00, b: 15.5, d: 1.5 }, // me-
    { n: 349.23, b: 17, d: 1 },  // ri
    { n: 329.63, b: 18, d: 2 },  // beh-na hai
    { n: 293.66, b: 20, d: 2 },  // saari
    { n: 261.63, b: 22, d: 3 },  // umar hame sang rehna hai
  ];

  let melody = 0;
  for (const item of sisterMelody) {
    if (beat >= item.b && beat < item.b + item.d) {
      const noteT = (beat - item.b) * (60 / bpm);
      const noteDur = item.d * (60 / bpm);
      const env = Math.exp(-noteT * 1.5) * (1 - Math.exp(-noteT * 30));
      // Acoustic chime timbre
      const osc =
        Math.sin(2 * Math.PI * item.n * t) * 0.7 +
        Math.sin(4 * Math.PI * item.n * t) * 0.2 +
        Math.sin(6 * Math.PI * item.n * t) * 0.1;
      melody += osc * env * 0.5;
      break;
    }
  }

  // Soft warm strings pad in background
  const padFreqs = [130.81, 164.81, 196.00];
  let pad = 0;
  for (const pf of padFreqs) {
    pad += Math.sin(2 * Math.PI * pf * t) * 0.06;
  }

  const left = (melody + pad) * 0.8;
  const right = (melody * 0.9 + pad * 1.1) * 0.8;
  return [left, right];
});

// ========================================================
// 3. DJ AIR HORN & BASS DROP
// ========================================================
console.log('Generating party_airhorn_drop.wav...');
createWavFile('party_airhorn_drop.wav', 4.0, sampleRate, (t, i) => {
  // Triple airhorn blast (0 to 1.2s), then massive bass drop (1.3 to 4.0s)
  let val = 0;

  if (t < 1.2) {
    const burstTimes = [0, 0.2, 0.45];
    for (const bt of burstTimes) {
      if (t >= bt && t < bt + 0.25) {
        const localT = t - bt;
        const env = Math.exp(-localT * 3);
        const f1 = 466.16;
        const f2 = 587.33;
        const horn = (Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t)) * 0.35;
        val += horn * env;
      }
    }
  } else {
    // 808 Bass drop
    const dropT = t - 1.2;
    const bassFreq = Math.max(32, 140 * Math.exp(-dropT * 1.8));
    const bassEnv = Math.exp(-dropT * 0.8);
    const bass = Math.sin(2 * Math.PI * bassFreq * t) * bassEnv * 0.6;
    val += bass;
  }

  return [val, val];
});

console.log('All audio clips created successfully in public/audio/ !');
