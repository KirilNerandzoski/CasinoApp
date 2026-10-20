/**
 * Web Audio API Sound Synthesizer for Casino Privé
 * Zero external MP3 assets, zero missing file errors, zero latency.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  constructor() {
    // Read user sound preference from localStorage
    try {
      const savedMute = localStorage.getItem('casino_sound_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('casino_sound_volume');
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol);
      }
    } catch {
      // LocalStorage fallback
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('casino_sound_muted', String(muted));
    } catch {
      // Ignore
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('casino_sound_volume', String(this.volume));
    } catch {
      // Ignore
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Crisp ceramic chip click sound
   */
  public playChipClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(3200, t + 0.015);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);

    gain.gain.setValueAtTime(0.3 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Stacking multiple casino chips
   */
  public playChipStack() {
    if (this.isMuted) return;
    this.playChipClick();
    setTimeout(() => this.playChipClick(), 60);
    setTimeout(() => this.playChipClick(), 120);
  }

  /**
   * Smooth velvet card slide
   */
  public playCardSlide() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // White noise filtered to sound like card sliding on felt
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(1500, t + 0.08);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.25 * this.volume, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.13);
  }

  /**
   * Crisp card flip sound
   */
  public playCardFlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.03);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.07);

    gain.gain.setValueAtTime(0.2 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  /**
   * Roulette ball click against pocket frets
   */
  public playRouletteTick(pitchMultiplier = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200 * pitchMultiplier, t);
    osc.frequency.exponentialRampToValueAtTime(800 * pitchMultiplier, t + 0.02);

    gain.gain.setValueAtTime(0.2 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  /**
   * Ball bouncing and dropping into winning roulette pocket
   */
  public playBallDrop() {
    if (this.isMuted) return;
    const bounces = [0, 80, 150, 210, 260];
    bounces.forEach((delay, index) => {
      setTimeout(() => {
        this.playRouletteTick(1 - index * 0.1);
      }, delay);
    });
  }

  /**
   * Mechanical slot reel spin thud / click
   */
  public playReelStop(reelIndex: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Subtle pitch rise across reels (reel 1 slightly deeper, reel 5 higher)
    const baseFreq = 160 + reelIndex * 25;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);

    gain.gain.setValueAtTime(0.35 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Scatter symbol landed chime
   */
  public playScatterChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const frequencies = [880, 1108.73, 1318.51, 1760]; // A major sparkle
    frequencies.forEach((f, i) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.15 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.26);
      }, i * 45);
    });
  }

  /**
   * Winning bell / gold chime arpeggio
   */
  public playWinChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Rich luxury chords (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.25 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.46);
      }, idx * 75);
    });
  }

  /**
   * Big Win High-Roller Victory Fanfare
   */
  public playBigWin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const arpeggio = [
      { f: 523.25, d: 0 },
      { f: 659.25, d: 100 },
      { f: 783.99, d: 200 },
      { f: 1046.5, d: 300 },
      { f: 1318.51, d: 450 },
      { f: 1567.98, d: 600 },
      { f: 2093.0, d: 750 },
    ];

    arpeggio.forEach(({ f, d }) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);

        // Sub-harmonic shimmer
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(f * 1.5, t);

        gain.gain.setValueAtTime(0.28 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc2.start(t);
        osc.stop(t + 0.61);
        osc2.stop(t + 0.61);
      }, d);
    });
  }

  /**
   * Soft UI tactile feedback
   */
  public playButton() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

    gain.gain.setValueAtTime(0.12 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  }
}

export const soundEngine = new SoundEngine();
