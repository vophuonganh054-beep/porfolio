type Listener = (isPlaying: boolean, elapsedSeconds: number) => void;

class RetroAudioSynth {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private synthTimer: number | null = null;
  private elapsedTimer: number | null = null;
  private elapsedSeconds = 0;
  private synthStep = 0;
  private listeners: Set<Listener> = new Set();

  public readonly trackName = 'Blue & You';
  public readonly trackArtist = 'Retro 8-Bit Lofi';

  private readonly NOTES: Record<string, number> = {
    F2: 87.31, G2: 98.0, A2: 110.0, B2: 123.47,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
  };

  // Melody arrangement for "Blue & You" - nostalgic dreamy lofi progression (Cmaj7 - Am7 - Fmaj7 - G7)
  private readonly melodyPattern: Array<{ melody: string | null; chord: string | null; bass: string | null }> = [
    // Bar 1: Cmaj7 - "Your morning eyes, I could stare like watching stars..."
    { melody: 'G4', chord: 'C4', bass: 'C3' },
    { melody: 'E4', chord: 'E4', bass: null },
    { melody: 'G4', chord: 'G4', bass: null },
    { melody: 'A4', chord: 'B3', bass: null },
    { melody: 'G4', chord: 'E4', bass: 'C3' },
    { melody: 'E4', chord: 'G4', bass: null },
    { melody: 'D4', chord: 'C4', bass: null },
    { melody: 'C4', chord: 'B3', bass: null },

    // Bar 2: Am7 - "Or look around at a town you don't recognise..."
    { melody: 'E5', chord: 'C4', bass: 'A2' },
    { melody: 'D5', chord: 'E4', bass: null },
    { melody: 'C5', chord: 'A3', bass: null },
    { melody: 'B4', chord: 'E4', bass: null },
    { melody: 'A4', chord: 'C4', bass: 'A2' },
    { melody: 'C5', chord: 'E4', bass: null },
    { melody: 'B4', chord: 'G4', bass: null },
    { melody: 'A4', chord: 'C4', bass: null },

    // Bar 3: Fmaj7 - "If all the world remains this shade of blue..."
    { melody: 'A4', chord: 'C4', bass: 'F2' },
    { melody: 'C5', chord: 'A3', bass: null },
    { melody: 'E5', chord: 'C4', bass: null },
    { melody: 'D5', chord: 'A3', bass: null },
    { melody: 'C5', chord: 'F3', bass: 'F2' },
    { melody: 'D5', chord: 'A3', bass: null },
    { melody: 'E5', chord: 'C4', bass: null },
    { melody: 'D5', chord: 'A3', bass: null },

    // Bar 4: G7 / Fm - "I'll forget it all but you... It's all blue and you..."
    { melody: 'C5', chord: 'B3', bass: 'G2' },
    { melody: 'D5', chord: 'D4', bass: null },
    { melody: 'E5', chord: 'G4', bass: null },
    { melody: 'D5', chord: 'B3', bass: null },
    { melody: 'C5', chord: 'E4', bass: 'G2' },
    { melody: 'B4', chord: 'D4', bass: null },
    { melody: 'A4', chord: 'G4', bass: null },
    { melody: 'G4', chord: 'B3', bass: null },
  ];

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.isPlaying, this.elapsedSeconds);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying, this.elapsedSeconds));
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number, time: number) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  private step() {
    if (!this.isPlaying || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const stepData = this.melodyPattern[this.synthStep % this.melodyPattern.length];
    const stepDuration = 0.32;

    if (stepData.melody && this.NOTES[stepData.melody]) {
      this.playTone(this.NOTES[stepData.melody], 'square', stepDuration * 0.85, 0.04, now);
    }
    if (stepData.chord && this.NOTES[stepData.chord]) {
      this.playTone(this.NOTES[stepData.chord], 'triangle', stepDuration * 0.9, 0.05, now);
    }
    if (stepData.bass && this.NOTES[stepData.bass]) {
      this.playTone(this.NOTES[stepData.bass], 'triangle', stepDuration * 1.5, 0.08, now);
    }

    this.synthStep++;
  }

  public start() {
    this.initAudio();
    this.isPlaying = true;
    this.step();

    if (this.synthTimer) window.clearInterval(this.synthTimer);
    this.synthTimer = window.setInterval(() => this.step(), 320);

    if (!this.elapsedTimer) {
      this.elapsedTimer = window.setInterval(() => {
        this.elapsedSeconds++;
        this.notify();
      }, 1000);
    }

    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    if (this.synthTimer) {
      window.clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
    if (this.elapsedTimer) {
      window.clearInterval(this.elapsedTimer);
      this.elapsedTimer = null;
    }
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  public restart() {
    this.elapsedSeconds = 0;
    this.synthStep = 0;
    if (!this.isPlaying) {
      this.start();
    } else {
      this.notify();
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      elapsedSeconds: this.elapsedSeconds,
    };
  }

  /**
   * Chơi âm thanh 'bíp' ngắn cổ điển (retro 8-bit button beep)
   * Sử dụng wave vuông/tam giác với envelope decay cực nhanh
   */
  public playButtonBeep(
    type: 'beep' | 'coin' | 'select' | 'pop' | 'shield' | 'invincible' | 'regen' | 'berserk' = 'beep'
  ) {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      if (type === 'coin') {
        // Âm bíp leng keng kiểu nhặt coin Mario/Arcade (2 nốt B5 -> E6)
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
        return;
      }

      if (type === 'select') {
        // Âm bíp menu lựa chọn retro
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
        return;
      }

      if (type === 'pop') {
        // Âm bíp pop bong bóng / nổ hạt pixel
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.05);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
        return;
      }

      if (type === 'shield') {
        // Sci-fi pixel shield barrier hum & charge
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        osc.frequency.setValueAtTime(660, now + 0.13);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
        return;
      }

      if (type === 'invincible') {
        // 8-bit Star Power / Invincibility Arpeggio Fanfare
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((freq, idx) => {
          if (!this.audioCtx) return;
          const starOsc = this.audioCtx.createOscillator();
          const starGain = this.audioCtx.createGain();
          const noteTime = now + idx * 0.055;

          starOsc.type = 'square';
          starOsc.frequency.setValueAtTime(freq, noteTime);

          starGain.gain.setValueAtTime(0.001, noteTime);
          starGain.gain.linearRampToValueAtTime(0.07, noteTime + 0.01);
          starGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.18);

          starOsc.connect(starGain);
          starGain.connect(this.audioCtx.destination);
          starOsc.start(noteTime);
          starOsc.stop(noteTime + 0.2);
        });
        return;
      }

      if (type === 'regen') {
        // Healing chime
        const notes = [392.0, 493.88, 587.33, 783.99];
        notes.forEach((freq, idx) => {
          if (!this.audioCtx) return;
          const chimeOsc = this.audioCtx.createOscillator();
          const chimeGain = this.audioCtx.createGain();
          const noteTime = now + idx * 0.06;

          chimeOsc.type = 'sine';
          chimeOsc.frequency.setValueAtTime(freq, noteTime);

          chimeGain.gain.setValueAtTime(0.001, noteTime);
          chimeGain.gain.linearRampToValueAtTime(0.08, noteTime + 0.01);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.25);

          chimeOsc.connect(chimeGain);
          chimeGain.connect(this.audioCtx.destination);
          chimeOsc.start(noteTime);
          chimeOsc.stop(noteTime + 0.26);
        });
        return;
      }

      if (type === 'berserk') {
        // Electric zap pulse
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(950, now + 0.08);
        osc.frequency.linearRampToValueAtTime(320, now + 0.18);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
        return;
      }

      // Default: retro short button beep (8-bit square click)
      osc.type = 'square';
      // Pitch hơi trượt nhẹ từ 850Hz xuống 650Hz tạo tiếng "bíp" giòn tan vui tai
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.045);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // AudioContext có thể bị chặn nếu user chưa tương tác lần nào
    }
  }
}

export const audioSynth = new RetroAudioSynth();

/**
 * Helper function để phát âm bíp nhanh chóng trên các sự kiện onClick
 */
export function playRetroBeep(type?: 'beep' | 'coin' | 'select' | 'pop' | 'shield' | 'invincible' | 'regen' | 'berserk') {
  audioSynth.playButtonBeep(type);
}

