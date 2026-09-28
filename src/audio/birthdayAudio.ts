// Procedural Web Audio API sound synthesizer & Voice Engine for Ruhi's Birthday Wonder-Verse
// Requires zero external sound files; instant, crystal-clear, and responsive across all devices.

export type BGMTrack = 'bday_song' | 'starlight' | 'royal';

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgLoopInterval: number | null = null;
  private isPlayingBgm: boolean = false;
  private currentTrack: BGMTrack = 'bday_song';
  private voiceEnabled: boolean = true;
  private isSpeaking: boolean = false;

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
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
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
      this.playChime(523.25); // C5
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
  // VOICE SYNTHESIS ENGINE (Hindi / Hinglish Warm Sisterly Narration)
  // ==========================================
  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || !this.voiceEnabled || typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const cleanText = text
        .replace(/[*_#👑✨🌹🎉🎂❤️🎈]/g, '')
        .replace(/—/g, ', ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();

      // Look for Hindi voice or Indian English voice
      const preferredVoice =
        voices.find((v) => v.lang.includes('hi') || v.lang.includes('hi_IN')) ||
        voices.find((v) => v.lang.includes('en-IN') || v.name.includes('India')) ||
        voices.find((v) => v.name.includes('Google') || v.name.includes('Natural')) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 0.92; // Sweet, emotional, slow pacing
      utterance.pitch = 1.08; // Warm and pleasant tone
      utterance.volume = 0.9;

      this.isSpeaking = true;

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  // ==========================================
  // STEP SOUND ENGINE (Specialized sound for every step)
  // ==========================================
  public playStepSound(realmId: 1 | 2 | 3 | 4, stepIdx: number) {
    if (this.isMuted) return;

    switch (realmId) {
      case 1: // Starlight: Heavenly sparkling arpeggio
        this.playHarpArpeggio([523.25, 659.25, 783.99, 1046.5]);
        break;
      case 2: // Cyber Citadel: Electric futuristic chord
        this.playCyberChord(440 + (stepIdx % 4) * 60);
        break;
      case 3: // Enchanted Garden: Sweet music box chime
        this.playMusicBoxChime([587.33, 739.99, 880, 1174.66]);
        break;
      case 4: // Royal Eternity: Grand golden fanfare
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
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.3);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Ignored
    }
  }

  public playHarpArpeggio(notes: number[]) {
    notes.forEach((freq, i) => {
      setTimeout(() => this.playChime(freq), i * 70);
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
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
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
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.6);
        } catch {
          // Ignored
        }
      }, i * 110);
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
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.5);
        } catch {
          // Ignored
        }
      }, i * 90);
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
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);

      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((note, i) => {
        setTimeout(() => this.playChime(note), i * 60);
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
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      setTimeout(() => this.playChime(880), 200);
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
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.09);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);

      setTimeout(() => this.playChime(1046.5), 60);
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
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.9);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2500, now + 0.4);
      filter.frequency.exponentialRampToValueAtTime(250, now + 0.9);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.95);
    } catch {
      // Ignored
    }
  }

  // ==========================================
  // BACKGROUND BGM LOOP ENGINE (Multi-track)
  // ==========================================
  public startBackgroundMelody() {
    if (this.isMuted || this.isPlayingBgm) return;
    this.isPlayingBgm = true;

    // Track 1: Happy Birthday Dear Ruhi (Full Melody with Chords)
    const bdayNotes = [
      { f: 261.63, d: 350, chord: 130.81 }, // C4
      { f: 261.63, d: 350 },
      { f: 293.66, d: 700, chord: 146.83 }, // D4
      { f: 261.63, d: 700 },
      { f: 349.23, d: 700, chord: 174.61 }, // F4
      { f: 329.63, d: 1400 }, // E4

      { f: 261.63, d: 350, chord: 130.81 },
      { f: 261.63, d: 350 },
      { f: 293.66, d: 700, chord: 146.83 },
      { f: 261.63, d: 700 },
      { f: 392.0,  d: 700, chord: 196.00 }, // G4
      { f: 349.23, d: 1400 },

      // "Happy Birthday Dear Ruhi..."
      { f: 261.63, d: 350, chord: 130.81 },
      { f: 261.63, d: 350 },
      { f: 523.25, d: 700, chord: 261.63 }, // C5
      { f: 440.0,  d: 700, chord: 220.00 }, // A4
      { f: 349.23, d: 700, chord: 174.61 }, // F4
      { f: 329.63, d: 700 },
      { f: 293.66, d: 1200, chord: 146.83 }, // D4

      // "Happy Birthday to you!"
      { f: 466.16, d: 350, chord: 233.08 }, // Bb4
      { f: 466.16, d: 350 },
      { f: 440.0,  d: 700, chord: 220.00 },
      { f: 349.23, d: 700, chord: 174.61 },
      { f: 392.0,  d: 700, chord: 196.00 },
      { f: 349.23, d: 1600, chord: 130.81 }, // F4 final
    ];

    // Track 2: Starlight Dream Lullaby
    const starlightNotes = [
      { f: 329.63, d: 600, chord: 164.81 },
      { f: 392.0,  d: 600 },
      { f: 493.88, d: 900, chord: 246.94 },
      { f: 440.0,  d: 600 },
      { f: 392.0,  d: 900, chord: 196.00 },
      { f: 329.63, d: 1200 },
      { f: 293.66, d: 600, chord: 146.83 },
      { f: 329.63, d: 600 },
      { f: 392.0,  d: 1400, chord: 196.00 },
    ];

    // Track 3: Royal Golden Symphony
    const royalNotes = [
      { f: 523.25, d: 500, chord: 261.63 },
      { f: 659.25, d: 500, chord: 329.63 },
      { f: 783.99, d: 1000, chord: 392.00 },
      { f: 659.25, d: 500 },
      { f: 783.99, d: 500 },
      { f: 1046.5, d: 1400, chord: 523.25 },
    ];

    const currentNotesList =
      this.currentTrack === 'bday_song'
        ? bdayNotes
        : this.currentTrack === 'starlight'
        ? starlightNotes
        : royalNotes;

    let noteIndex = 0;
    const playNext = () => {
      if (!this.isPlayingBgm || this.isMuted) return;
      const n = currentNotesList[noteIndex];
      this.playPianoNote(n.f, n.d / 1000, n.chord);
      noteIndex = (noteIndex + 1) % currentNotesList.length;
      const delay = n.d + (noteIndex === 0 ? 2500 : 80);
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

  private playPianoNote(freq: number, duration: number, chordBass?: number) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Melody Tone (warm triangle with sine harmonic)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);

      // Bass Chord Pad (if present)
      if (chordBass) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(chordBass, now);
        bassGain.gain.setValueAtTime(0.05, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.2);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + duration * 1.2);
      }
    } catch {
      // Ignored
    }
  }
}

export const bdayAudio = new BirthdayAudioEngine();
