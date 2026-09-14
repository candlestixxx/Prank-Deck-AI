import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type SharedAudioContextType = {
  getAudioCtx: () => AudioContext | null;
  getMasterGain: () => GainNode | null;
  volume: number;
  setVolume: (val: number) => void;
  initializeAudio: () => void;
};

const SharedAudioContext = createContext<SharedAudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [volume, setVolume] = useState<number>(1.0);

  // Note: AudioContext often must be initialized in response to user interaction
  const initializeAudio = () => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);
      masterGainRef.current = gain;
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const getAudioCtx = () => audioCtxRef.current;
  const getMasterGain = () => masterGainRef.current;

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  return (
    <SharedAudioContext.Provider
      value={{
        getAudioCtx,
        getMasterGain,
        volume,
        setVolume,
        initializeAudio
      }}
    >
      {children}
    </SharedAudioContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSharedAudio() {
  const context = useContext(SharedAudioContext);
  if (context === undefined) {
    throw new Error('useSharedAudio must be used within an AudioProvider');
  }
  return context;
}
