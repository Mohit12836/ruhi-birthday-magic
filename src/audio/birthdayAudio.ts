// Procedural Web Audio API sound synthesizer for Ruhi's Birthday Wonder-Verse
// Requires zero external sound files; instant, crystal-clear, and responsive

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgLoopInterval: number | null = null;
  private isPlayingBgm: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ruhi_bday_sound_muted');
      this.isMuted = saved === 'true';
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
    } else {
      this.playChime(523.25); // C5
      this.startBackgroundMelody();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play a soft sweet chime
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

  // Wax seal break sound (snap + sparkle)
  public playSealBreak() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Click snap
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

      // Harp shimmer
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((note, i) => {
        setTimeout(() => this.playChime(note), i * 60);
      });
    } catch {
      // Ignored
    }
  }

  // Candle blow puff sound (soft white noise whoosh)
  public playCandleBlow() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Filtered noise sweep
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

  // Balloon pop sound
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

  // Dimensional Warp Jump Whoosh
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

  // Gentle acoustic Happy Birthday melody loop (piano-like sine chimes)
  public startBackgroundMelody() {
    if (this.isMuted || this.isPlayingBgm) return;
    this.isPlayingBgm = true;

    // Happy birthday melody notes & durations
    // C4, C4, D4, C4, F4, E4...
    const notes = [
      { f: 261.63, d: 350 },
      { f: 261.63, d: 350 },
      { f: 293.66, d: 700 },
      { f: 261.63, d: 700 },
      { f: 349.23, d: 700 },
      { f: 329.63, d: 1400 },

      { f: 261.63, d: 350 },
      { f: 261.63, d: 350 },
      { f: 293.66, d: 700 },
      { f: 261.63, d: 700 },
      { f: 392.0,  d: 700 },
      { f: 349.23, d: 1400 },

      { f: 261.63, d: 350 },
      { f: 261.63, d: 350 },
      { f: 523.25, d: 700 },
      { f: 440.0,  d: 700 },
      { f: 349.23, d: 700 },
      { f: 329.63, d: 700 },
      { f: 293.66, d: 1200 },
    ];

    let noteIndex = 0;
    const playNext = () => {
      if (!this.isPlayingBgm || this.isMuted) return;
      const n = notes[noteIndex];
      this.playPianoNote(n.f, n.d / 1000);
      noteIndex = (noteIndex + 1) % notes.length;
      const delay = n.d + (noteIndex === 0 ? 3000 : 150); // Pause between loops
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

  private playPianoNote(freq: number, duration: number) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignored
    }
  }
}

export const bdayAudio = new BirthdayAudioEngine();
