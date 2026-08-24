import { useRef } from 'react';
import './Soundboard.css';

// These would normally be real audio files, but we'll use a synthesizer for demonstration to avoid needing assets.
const SOUND_CATEGORIES = {
  Greetings: [
    { id: 'g1', label: 'Hello!', type: 'synth', freq: 440, typeOsc: 'sine', desc: 'A smooth sine wave beep' },
    { id: 'g2', label: 'Welcome', type: 'synth', freq: 523.25, typeOsc: 'triangle', desc: 'A bright triangle wave tone' },
    { id: 'g3', label: 'Hey there', type: 'synth', freq: 659.25, typeOsc: 'square', desc: 'A classic 8-bit square wave' },
  ],
  Reactions: [
    { id: 'r1', label: 'Laugh', type: 'synth', freq: 880, typeOsc: 'sawtooth', desc: 'A sharp sawtooth giggle' },
    { id: 'r2', label: 'Gasp', type: 'synth', freq: 1046.50, typeOsc: 'triangle', desc: 'A high pitched surprise' },
    { id: 'r3', label: 'Boo', type: 'synth', freq: 130.81, typeOsc: 'sawtooth', desc: 'A low, rumbling disapproval' },
  ],
  Effects: [
    { id: 'e1', label: 'Drum Roll', type: 'synth', freq: 100, typeOsc: 'square', desc: 'A fast-clicking snare substitute' },
    { id: 'e2', label: 'Rimshot', type: 'synth', freq: 300, typeOsc: 'sawtooth', desc: 'A snappy rimshot synth' },
    { id: 'e3', label: 'Trombone', type: 'synth', freq: 80, typeOsc: 'sine', desc: 'A deep, sad trombone note' },
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
      oscillator.frequency.setValueAtTime(sound.freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
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
