// Procedural Web Audio API sound synthesizer & Voice Engine for Ruhi's Birthday Wonder-Verse
// Ultra-Energetic Festival Party Edition with Audio Ducking (Auto-lowering BGM when speaking!)

export type BGMTrack = 'party_remix' | 'bday_song' | 'starlight' | 'royal';

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private bgmMasterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private bgLoopInterval: number | null = null;
  private isPlayingBgm: boolean = false;
  private currentTrack: BGMTrack = 'party_remix';
  private voiceEnabled: boolean = true;
  private isSpeaking: boolean = false;
  private duckListeners: Array<(isDucked: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMuted = localStorage.getItem('ruhi_bday_sound_muted');
      this.isMuted = savedMuted === 'true';
      const savedVoice = localStorage.getItem('ruhi_bday_voice_enabled');
      this.voiceEnabled = savedVoice !== 'false';
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (!this.bgmMasterGain) {
        this.bgmMasterGain = this.ctx.createGain();
        this.bgmMasterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.bgmMasterGain.connect(this.ctx.destination);
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ruhi_bday_sound_muted', String(this.isMuted));
    }
    if (this.isMuted) {
      this.stopBackgroundMelody();
      this.stopSpeaking();
    } else {
      this.playAirHorn();
      this.startBackgroundMelody();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleVoice(): boolean {
    this.voiceEnabled = !this.voiceEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ruhi_bday_voice_enabled', String(this.voiceEnabled));
    }
    if (!this.voiceEnabled) {
      this.stopSpeaking();
    }
    return this.voiceEnabled;
  }

  public getVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  public setTrack(track: BGMTrack) {
    this.currentTrack = track;
    if (this.isPlayingBgm) {
      this.stopBackgroundMelody();
      this.startBackgroundMelody();
    }
  }

  public getCurrentTrack(): BGMTrack {
    return this.currentTrack;
  }

  public getIsPlayingBgm(): boolean {
    return this.isPlayingBgm;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  // ==========================================
  // AUDIO DUCKING SYSTEM (Jab aawaz bole tab music dheema ho jaye!)
  // ==========================================
  public onDuckChange(listener: (isDucked: boolean) => void): () => void {
    this.duckListeners.push(listener);
    return () => {
      this.duckListeners = this.duckListeners.filter((l) => l !== listener);
    };
  }

  public duckBgm(isDucked: boolean) {
    this.init();
    if (this.ctx && this.bgmMasterGain) {
      const now = this.ctx.currentTime;
      const targetGain = isDucked ? 0.18 : 1.0; // 82% lower when speaking!
      this.bgmMasterGain.gain.cancelScheduledValues(now);
      this.bgmMasterGain.gain.linearRampToValueAtTime(
        targetGain,
        now + (isDucked ? 0.2 : 0.6)
      );
    }
    this.duckListeners.forEach((listener) => listener(isDucked));
  }

  // ==========================================
  // ENERGETIC VOICE SYNTHESIS ENGINE
  // ==========================================
  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || !this.voiceEnabled || typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const cleanText = text
        .replace(/[*_#👑✨🌹🎉🎂❤️🎈⚡💥]/g, '')
        .replace(/—/g, ', ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();

      // Look for energetic pleasant voice
      const preferredVoice =
        voices.find((v) => v.lang.includes('hi') || v.lang.includes('hi_IN')) ||
        voices.find((v) => v.lang.includes('en-IN') || v.name.includes('India')) ||
        voices.find((v) => v.name.includes('Google') || v.name.includes('Natural')) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 1.02; // Energetic, crisp, pleasant tempo!
      utterance.pitch = 1.12; // Happy, celebratory brother voice!
      utterance.volume = 1.0;

      this.isSpeaking = true;
      // DUCK THE BACKGROUND MUSIC DOWN!
      this.duckBgm(true);

      utterance.onend = () => {
        this.isSpeaking = false;
        // RESTORE BACKGROUND MUSIC UP TO FULL ENERGETIC VOLUME!
        this.duckBgm(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.duckBgm(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
      this.duckBgm(false);
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.duckBgm(false);
    }
  }

  // ==========================================
  // 💥 DJ AIR HORN & ENERGETIC PARTY SFX
  // ==========================================
  public playAirHorn() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const bursts = [0, 0.14, 0.32];
    const durations = [0.12, 0.12, 0.42];

    bursts.forEach((startTime, idx) => {
      setTimeout(() => {
        try {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const duration = durations[idx];

          const f1 = 466.16; // Bb4
          const f2 = 587.33; // D5

          [f1, f2].forEach((freq) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.04, now + duration);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination); // Airhorn is full blast
            osc.start(now);
            osc.stop(now + duration);
          });
        } catch {
          // Ignored
        }
      }, startTime * 1000);
    });
  }

  public playBassDrop() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 1.0);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // Ignored
    }
  }

  public playCrowdCheer() {
    if (this.isMuted) return;
    this.playAirHorn();
    setTimeout(() => {
      this.playHarpArpeggio([523.25, 659.25, 783.99, 1046.5, 1318.5]);
    }, 220);
  }

  // ==========================================
  // STEP SOUND ENGINE
  // ==========================================
  public playStepSound(realmId: 1 | 2 | 3 | 4, stepIdx: number) {
    if (this.isMuted) return;

    switch (realmId) {
      case 1:
        this.playHarpArpeggio([523.25, 659.25, 783.99, 1046.5]);
        break;
      case 2:
        this.playCyberChord(440 + (stepIdx % 4) * 60);
        break;
      case 3:
        this.playMusicBoxChime([587.33, 739.99, 880, 1174.66]);
        break;
      case 4:
        this.playGoldenFanfare();
        break;
    }
  }

  // ==========================================
  // PROCEDURAL SOUND EFFECTS
  // ==========================================
  public playChime(freq = 659.25) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.25);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignored
    }
  }

  public playHarpArpeggio(notes: number[]) {
    notes.forEach((freq, i) => {
      setTimeout(() => this.playChime(freq), i * 55);
    });
  }

  public playCyberChord(baseFreq: number) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [baseFreq, baseFreq * 1.25, baseFreq * 1.5].forEach((f) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {
      // Ignored
    }
  }

  public playMusicBoxChime(notes: number[]) {
    notes.forEach((n, i) => {
      setTimeout(() => {
        try {
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n, now);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.5);
        } catch {
          // Ignored
        }
      }, i * 80);
    });
  }

  public playGoldenFanfare() {
    const fanfareNotes = [392.0, 523.25, 659.25, 783.99, 1046.5];
    fanfareNotes.forEach((n, i) => {
      setTimeout(() => {
        try {
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(n, now);
          gain.gain.setValueAtTime(0.24, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.45);
        } catch {
          // Ignored
        }
      }, i * 70);
    });
  }

  public playSealBreak() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);

      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((note, i) => {
        setTimeout(() => this.playChime(note), i * 50);
      });
    } catch {
      // Ignored
    }
  }

  public playCandleBlow() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      setTimeout(() => this.playChime(880), 180);
    } catch {
      // Ignored
    }
  }

  public playBalloonPop() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.09);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);

      setTimeout(() => this.playChime(1046.5), 50);
    } catch {
      // Ignored
    }
  }

  public playWarp() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.85);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.exponentialRampToValueAtTime(3000, now + 0.35);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.85);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // Ignored
    }
  }

  // ==========================================
  // BACKGROUND BGM LOOP ENGINE (Connected to bgmMasterGain for ducking)
  // ==========================================
  public startBackgroundMelody() {
    if (this.isMuted || this.isPlayingBgm) return;
    this.isPlayingBgm = true;
    this.init();

    // Track 0: ULTRA-ENERGETIC 130 BPM FESTIVAL REMIX
    const partyRemixNotes = [
      { f: 261.63, d: 180, chord: 65.41, kick: true },
      { f: 261.63, d: 180, snare: true },
      { f: 293.66, d: 360, chord: 73.42, kick: true },
      { f: 261.63, d: 360, snare: true },
      { f: 349.23, d: 360, chord: 87.31, kick: true },
      { f: 329.63, d: 720, kick: true },

      { f: 261.63, d: 180, chord: 65.41, kick: true },
      { f: 261.63, d: 180, snare: true },
      { f: 293.66, d: 360, chord: 73.42, kick: true },
      { f: 261.63, d: 360, snare: true },
      { f: 392.00, d: 360, chord: 98.00, kick: true },
      { f: 349.23, d: 720, kick: true },

      // Drop: "Happy Birthday Dear Ruhi!" (Bouncy Synth Lead)
      { f: 261.63, d: 180, chord: 130.81, kick: true },
      { f: 261.63, d: 180, snare: true },
      { f: 523.25, d: 360, chord: 130.81, kick: true },
      { f: 440.00, d: 360, chord: 110.00, snare: true },
      { f: 349.23, d: 360, chord: 87.31, kick: true },
      { f: 329.63, d: 360 },
      { f: 293.66, d: 600, chord: 73.42, kick: true },

      // Chorus Climax
      { f: 466.16, d: 180, chord: 116.54, kick: true },
      { f: 466.16, d: 180, snare: true },
      { f: 440.00, d: 360, chord: 110.00, kick: true },
      { f: 349.23, d: 360, chord: 87.31, snare: true },
      { f: 392.00, d: 360, chord: 98.00, kick: true },
      { f: 349.23, d: 850, chord: 65.41, kick: true },
    ];

    // Track 1: Classic Melodic Birthday Song
    const bdayNotes = [
      { f: 261.63, d: 300, chord: 130.81 },
      { f: 261.63, d: 300 },
      { f: 293.66, d: 600, chord: 146.83 },
      { f: 261.63, d: 600 },
      { f: 349.23, d: 600, chord: 174.61 },
      { f: 329.63, d: 1100 },

      { f: 261.63, d: 300, chord: 130.81 },
      { f: 261.63, d: 300 },
      { f: 293.66, d: 600, chord: 146.83 },
      { f: 261.63, d: 600 },
      { f: 392.00, d: 600, chord: 196.00 },
      { f: 349.23, d: 1100 },

      { f: 261.63, d: 300, chord: 130.81 },
      { f: 261.63, d: 300 },
      { f: 523.25, d: 600, chord: 261.63 },
      { f: 440.00, d: 600, chord: 220.00 },
      { f: 349.23, d: 600, chord: 174.61 },
      { f: 329.63, d: 600 },
      { f: 293.66, d: 1000, chord: 146.83 },

      { f: 466.16, d: 300, chord: 233.08 },
      { f: 466.16, d: 300 },
      { f: 440.00, d: 600, chord: 220.00 },
      { f: 349.23, d: 600, chord: 174.61 },
      { f: 392.00, d: 600, chord: 196.00 },
      { f: 349.23, d: 1300, chord: 130.81 },
    ];

    // Track 2: Starlight Dream
    const starlightNotes = [
      { f: 329.63, d: 500, chord: 164.81 },
      { f: 392.00, d: 500 },
      { f: 493.88, d: 800, chord: 246.94 },
      { f: 440.00, d: 500 },
      { f: 392.00, d: 800, chord: 196.00 },
      { f: 329.63, d: 1000 },
    ];

    // Track 3: Royal Symphony
    const royalNotes = [
      { f: 523.25, d: 450, chord: 261.63 },
      { f: 659.25, d: 450, chord: 329.63 },
      { f: 783.99, d: 850, chord: 392.00 },
      { f: 659.25, d: 450 },
      { f: 1046.5, d: 1200, chord: 523.25 },
    ];

    const currentNotesList =
      this.currentTrack === 'party_remix'
        ? partyRemixNotes
        : this.currentTrack === 'bday_song'
        ? bdayNotes
        : this.currentTrack === 'starlight'
        ? starlightNotes
        : royalNotes;

    let noteIndex = 0;
    const playNext = () => {
      if (!this.isPlayingBgm || this.isMuted) return;
      const n = currentNotesList[noteIndex];

      this.playSynthNote(
        n.f,
        n.d / 1000,
        n.chord,
        (n as { kick?: boolean }).kick,
        (n as { snare?: boolean }).snare
      );

      noteIndex = (noteIndex + 1) % currentNotesList.length;
      const delay = n.d + (noteIndex === 0 ? 1100 : 25);
      this.bgLoopInterval = window.setTimeout(playNext, delay);
    };

    playNext();
  }

  public stopBackgroundMelody() {
    this.isPlayingBgm = false;
    if (this.bgLoopInterval) {
      clearTimeout(this.bgLoopInterval);
      this.bgLoopInterval = null;
    }
  }

  private playSynthNote(
    freq: number,
    duration: number,
    chordBass?: number,
    kick?: boolean,
    snare?: boolean
  ) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const dest = this.bgmMasterGain || this.ctx.destination;

      // 1. Kick Drum
      if (kick) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(155, now);
        kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.09);
        kickGain.gain.setValueAtTime(0.32, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        kickOsc.connect(kickGain);
        kickGain.connect(dest);
        kickOsc.start(now);
        kickOsc.stop(now + 0.1);
      }

      // 2. Snare Clap
      if (snare) {
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(220, now);
        snareGain.gain.setValueAtTime(0.18, now);
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        snareOsc.connect(snareGain);
        snareGain.connect(dest);
        snareOsc.start(now);
        snareOsc.stop(now + 0.08);
      }

      // 3. Synth Melody Lead (Punchy Sawtooth)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = this.currentTrack === 'party_remix' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(this.currentTrack === 'party_remix' ? 0.09 : 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + duration);

      // 4. Deep Sub Bass
      if (chordBass) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(chordBass, now);
        bassGain.gain.setValueAtTime(0.12, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.1);
        bassOsc.connect(bassGain);
        bassGain.connect(dest);
        bassOsc.start(now);
        bassOsc.stop(now + duration * 1.1);
      }
    } catch {
      // Ignored
    }
  }
}

export const bdayAudio = new BirthdayAudioEngine();
