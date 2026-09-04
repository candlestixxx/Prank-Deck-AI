import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import './Soundboard.css';

// These would normally be real audio files, but we'll use a synthesizer for demonstration to avoid needing assets.
const SOUND_CATEGORIES = {
  Greetings: [
    { id: 'g1', label: 'Hello!', type: 'synth', freq: 440, typeOsc: 'sine' },
    { id: 'g2', label: 'Welcome', type: 'synth', freq: 523.25, typeOsc: 'triangle' },
    { id: 'g3', label: 'Hey there', type: 'synth', freq: 659.25, typeOsc: 'square' },
  ],
  Reactions: [
    { id: 'r1', label: 'Laugh', type: 'synth', freq: 880, typeOsc: 'sawtooth' },
    { id: 'r2', label: 'Gasp', type: 'synth', freq: 1046.50, typeOsc: 'triangle' },
    { id: 'r3', label: 'Boo', type: 'synth', freq: 130.81, typeOsc: 'sawtooth' },
  ],
  Effects: [
    { id: 'e1', label: 'Drum Roll', type: 'synth', freq: 100, typeOsc: 'square' },
    { id: 'e2', label: 'Rimshot', type: 'synth', freq: 300, typeOsc: 'sawtooth' },
    { id: 'e3', label: 'Trombone', type: 'synth', freq: 80, typeOsc: 'sine' },
  ]
};

type CustomSound = {
  id: string;
  label: string;
  type: 'custom';
  file: File;
};

const DB_NAME = 'PrankDeckDB';
const DB_VERSION = 1;
const STORE_NAME = 'customSounds';

export default function Soundboard() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [customSounds, setCustomSounds] = useState<CustomSound[]>([]);

  // Initialize IndexedDB and load existing sounds
  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      try {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          setCustomSounds(getAllRequest.result || []);
        };
      } catch {
        // Store might not exist yet if it failed to create
      }
    };
  }, []);

  const saveSoundToDB = (sound: CustomSound) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(sound);
    };
  };

  const removeSoundFromDB = (id: string) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(id);
    };
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newSounds: CustomSound[] = Array.from(e.target.files).map((file, index) => ({
        id: `custom-${Date.now()}-${index}`,
        label: file.name.replace(/\.[^/.]+$/, ""),
        type: 'custom',
        file
      }));

      setCustomSounds(prev => [...prev, ...newSounds]);
      newSounds.forEach(sound => saveSoundToDB(sound));
    }
  };

  const handleDeleteSound = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent playing sound when clicking delete
    setCustomSounds(prev => prev.filter(sound => sound.id !== id));
    removeSoundFromDB(id);
  };

  const playSound = async (sound: any) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (sound.type === 'synth') {
      // Setup Web Audio API Synthesizer Node
      // Using an oscillator paired with a gain node allows us to generate raw tones
      // and fade them out exponentially to avoid popping sounds at the end of the note.
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
    } else if (sound.type === 'custom') {
      // Decode and play custom audio file
      // Note: Re-reading arrayBuffer from File handles multiple plays since decodeAudioData detaches the buffer
      try {
        const arrayBuffer = await sound.file.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(0);
      } catch (err) {
        console.error("Error playing custom sound:", err);
      }
    }
  };

  return (
    <div className="soundboard-container">
      <h2>Mega Soundboard</h2>
      <p>Tap a button to play a sound locally on your speakers.</p>

      <div className="custom-upload-section category-section">
        <h3>Custom Sounds</h3>
        <p className="upload-description">Upload your own local audio files to play (they stay in your browser).</p>
        <input
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileUpload}
          title="Upload custom audio files"
          aria-label="Upload Custom Sounds"
          className="upload-input"
        />
        {customSounds.length > 0 && (
          <div className="buttons-grid custom-buttons-grid">
            {customSounds.map((sound) => (
              <div key={sound.id} className="custom-sound-wrapper">
                <button
                  className="sound-button custom-sound-button"
                  onClick={() => playSound(sound)}
                  title={`Play custom sound: ${sound.label}`}
                  aria-label={`Play ${sound.label}`}
                >
                  {sound.label}
                </button>
                <button
                  className="delete-sound-button"
                  onClick={(e) => handleDeleteSound(sound.id, e)}
                  title="Delete this sound"
                  aria-label={`Delete ${sound.label}`}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="categories-grid">
        {Object.entries(SOUND_CATEGORIES).map(([category, sounds]) => (
          <div key={category} className="category-section">
            <h3>{category}</h3>
            <div className="buttons-grid">
              {sounds.map((sound) => (
                <button
                  key={sound.id}
                  className="sound-button"
                  onClick={() => playSound(sound)}
                  title={`Play ${sound.label} sound`}
                  aria-label={`Play ${sound.label}`}
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
