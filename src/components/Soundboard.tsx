import { useRef } from 'react';
import './Soundboard.css';

// These would normally be real audio files, but we'll use a synthesizer for demonstration to avoid needing assets.
const SOUND_CATEGORIES = {
  Greetings: [
    { id: 'g1', label: 'Hello!', type: 'synth', freq: 440, typeOsc: 'sine', desc: 'A smooth sine wave beep', env: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.5 } },
    { id: 'g2', label: 'Welcome', type: 'synth', freq: 523.25, typeOsc: 'triangle', desc: 'A bright triangle wave tone', env: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.3 } },
    { id: 'g3', label: 'Hey there', type: 'synth', freq: 659.25, typeOsc: 'square', desc: 'A classic 8-bit square wave', env: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 } },
  ],
  Reactions: [
    { id: 'r1', label: 'Laugh', type: 'synth', freq: 880, typeOsc: 'sawtooth', desc: 'A sharp sawtooth giggle', env: { attack: 0.05, decay: 0.1, sustain: 0.2, release: 0.1 } },
    { id: 'r2', label: 'Gasp', type: 'synth', freq: 1046.50, typeOsc: 'triangle', desc: 'A high pitched surprise', env: { attack: 0.01, decay: 0.3, sustain: 0.0, release: 0.1 } },
    { id: 'r3', label: 'Boo', type: 'synth', freq: 130.81, typeOsc: 'sawtooth', desc: 'A low, rumbling disapproval', env: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 1.0 } },
  ],
  Effects: [
    { id: 'e1', label: 'Laser', type: 'synth', freq: 1000, typeOsc: 'square', desc: 'A retro laser sweep', env: { attack: 0.01, decay: 0.1, sustain: 0.0, release: 0.1 }, sweep: true },
    { id: 'e2', label: 'Rimshot', type: 'synth', freq: 300, typeOsc: 'sawtooth', desc: 'A snappy rimshot synth', env: { attack: 0.001, decay: 0.05, sustain: 0.0, release: 0.05 } },
    { id: 'e3', label: 'Trombone', type: 'synth', freq: 80, typeOsc: 'sine', desc: 'A deep, sad trombone note', env: { attack: 0.2, decay: 0.3, sustain: 0.9, release: 0.8 } },
  ]
};

export default function Soundboard() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = (sound: any) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (sound.type === 'synth') {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = sound.typeOsc;

      const now = ctx.currentTime;
      const env = sound.env || { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.5 };
      const duration = env.attack + env.decay + env.release;

      if (sound.sweep) {
        oscillator.frequency.setValueAtTime(sound.freq, now);
        oscillator.frequency.exponentialRampToValueAtTime(sound.freq / 10, now + duration);
      } else {
        oscillator.frequency.setValueAtTime(sound.freq, now);
      }

      // ADSR Envelope
      gainNode.gain.setValueAtTime(0, now);
      // Attack
      gainNode.gain.linearRampToValueAtTime(0.8, now + env.attack);
      // Decay to Sustain
      gainNode.gain.setTargetAtTime(0.8 * env.sustain, now + env.attack, env.decay / 3);
      // Release
      gainNode.gain.setTargetAtTime(0, now + env.attack + env.decay, env.release / 3);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(now);
      oscillator.stop(now + duration + 0.5); // Add buffer for release tail
    }
  };

  return (
    <div className="soundboard-container">
      <h2>Mega Soundboard</h2>
      <p>Tap a button to play a sound locally on your speakers.</p>

      <div className="categories-grid">
        {Object.entries(SOUND_CATEGORIES).map(([category, sounds]) => (
          <div key={category} className="category-section">
            <h3>{category}</h3>
            <div className="buttons-grid">
              {sounds.map((sound) => (
                <button
                  key={sound.id}
                  className="sound-button"
                  title={sound.desc}
                  onClick={() => playSound(sound)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      playSound(sound);
                    }
                  }}
                  aria-label={`Play ${sound.label} sound`}
                >
                  {sound.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
