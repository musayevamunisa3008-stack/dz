// Web Audio API Synthesizer for tactile automotive audio feedback
// No external MP3 downloads required; fully synthesized in browser!

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playClick(pitch: number = 800) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio might be blocked before first user interaction
    }
  }

  public playHeadlight(turnOn: boolean) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Relay switch click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(turnOn ? 450 : 280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(turnOn ? 900 : 180, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore
    }
  }

  public playEngineStart(type: 'electric' | 'gasoline' | 'hybrid' = 'electric') {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      if (type === 'electric') {
        // Futuristic dual oscillator sci-fi electric motor spool-up
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sawtooth';

        osc1.frequency.setValueAtTime(140, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.8);

        osc2.frequency.setValueAtTime(70, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

        // Filter for futuristic smooth sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(2500, ctx.currentTime + 0.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(filter);
        filter.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.9);
        osc2.stop(ctx.currentTime + 0.9);
      } else {
        // Deep V8/V10 rumble and rev roar
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(190, ctx.currentTime + 0.35);
        osc.frequency.linearRampToValueAtTime(95, ctx.currentTime + 0.8);

        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.35);
        filter.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.9);
      }
    } catch {
      // Ignore
    }
  }

  public playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch {
      // Ignore
    }
  }
}

export const audio = new AudioManager();
