import { useState, useRef, useEffect } from 'react';
import './VoiceStudio.css';

type EffectId =
  | 'normal'
  | 'chipmunk'
  | 'monster'
  | 'robot'
  | 'echo'
  | 'phone'
  | 'slowmo'
  | 'fast'
  | 'deep'
  | 'helium'
  | 'reverb'
  | 'alien'
  | 'underwater'
  | 'megaphone';

interface EffectDef {
  id: EffectId;
  label: string;
  emoji: string;
  description: string;
  playbackRate: number;
  // optional audio graph modifiers
  filter?: { type: BiquadFilterType; frequency: number; Q?: number };
  delay?: { delayTime: number; feedback: number; wet: number };
  reverb?: boolean; // simulated with convolution-like multiple delays
  distortion?: number; // gain amount for wave shaping
}

const EFFECTS: EffectDef[] = [
  {
    id: 'normal',
    label: 'Normal',
    emoji: '🎙️',
    description: 'Your voice, unmodified.',
    playbackRate: 1.0,
  },
  {
    id: 'chipmunk',
    label: 'Chipmunk',
    emoji: '🐿️',
    description: 'High-pitched, squeaky rodent voice.',
    playbackRate: 1.8,
  },
  {
    id: 'monster',
    label: 'Monster',
    emoji: '👹',
    description: 'Deep, growly beast voice.',
    playbackRate: 0.6,
  },
  {
    id: 'robot',
    label: 'Robot',
    emoji: '🤖',
    description: 'Metallic robotic voice with ring modulation.',
    playbackRate: 0.9,
    filter: { type: 'bandpass', frequency: 1500, Q: 2 },
    distortion: 50,
  },
  {
    id: 'echo',
    label: 'Echo',
    emoji: '🏔️',
    description: 'Your voice bouncing back with delay.',
    playbackRate: 1.0,
    delay: { delayTime: 0.3, feedback: 0.5, wet: 0.5 },
  },
  {
    id: 'phone',
    label: 'Phone Call',
    emoji: '📞',
    description: 'Sounds like you\'re on a telephone line.',
    playbackRate: 1.0,
    filter: { type: 'bandpass', frequency: 1000, Q: 0.7 },
  },
  {
    id: 'slowmo',
    label: 'Slow Motion',
    emoji: '🦥',
    description: 'Dramatically slowed-down speech.',
    playbackRate: 0.5,
  },
  {
    id: 'fast',
    label: 'Fast Forward',
    emoji: '⏩',
    description: 'Sped-up, rapid-fire speech.',
    playbackRate: 2.0,
  },
  {
    id: 'deep',
    label: 'Deep Voice',
    emoji: '🌋',
    description: 'Ultra-low, subterranean rumble.',
    playbackRate: 0.4,
  },
  {
    id: 'helium',
    label: 'Helium',
    emoji: '🎈',
    description: 'Inhale the balloon — extremely high voice.',
    playbackRate: 2.5,
  },
  {
    id: 'reverb',
    label: 'Cathedral Reverb',
    emoji: '⛪',
    description: 'Grand, spacious cathedral ambience.',
    playbackRate: 1.0,
    reverb: true,
  },
  {
    id: 'alien',
    label: 'Alien',
    emoji: '👽',
    description: 'Otherworldly extraterrestrial tone.',
    playbackRate: 0.75,
    filter: { type: 'highpass', frequency: 800 },
    delay: { delayTime: 0.05, feedback: 0.3, wet: 0.3 },
  },
  {
    id: 'underwater',
    label: 'Underwater',
    emoji: '🌊',
    description: 'Muffled, bubbly underwater speech.',
    playbackRate: 0.85,
    filter: { type: 'lowpass', frequency: 500, Q: 2 },
  },
  {
    id: 'megaphone',
    label: 'Megaphone',
    emoji: '📢',
    description: 'Loud, distorted bullhorn projection.',
    playbackRate: 1.0,
    filter: { type: 'bandpass', frequency: 2000, Q: 0.5 },
    distortion: 30,
  },
];

// Simulate reverb using multiple short delay taps
function createReverbGraph(ctx: AudioContext, input: AudioNode, output: AudioNode) {
  const dryGain = ctx.createGain();
  dryGain.gain.value = 0.5;
  input.connect(dryGain);
  dryGain.connect(output);

  const wetGain = ctx.createGain();
  wetGain.gain.value = 0.4;

  const delays = [0.02, 0.035, 0.05, 0.065, 0.08, 0.1, 0.12, 0.15];
  for (const t of delays) {
    const delay = ctx.createDelay();
    delay.delayTime.value = t;
    const tapGain = ctx.createGain();
    tapGain.gain.value = 0.15 / delays.length;
    input.connect(delay);
    delay.connect(tapGain);
    tapGain.connect(wetGain);
  }
  wetGain.connect(output);
}

export default function VoiceStudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [effect, setEffect] = useState<EffectId>('normal');
  const [showInstructions, setShowInstructions] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);

  // Analyzer refs (live waveform visualization)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const drawWaveform = () => {
    if (!analyzerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzerRef.current.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgba(36, 36, 36, 1)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#dc3545';
    canvasCtx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up live waveform analyzer
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const source = ctx.createMediaStreamSource(stream);
      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 2048;
      source.connect(analyzer);
      analyzerRef.current = analyzer;
      drawWaveform();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioBlobRef.current = audioBlob;
        setHasRecording(true);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());

        // Stop waveform visualization and clear canvas
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (canvasRef.current) {
          const c = canvasRef.current.getContext('2d');
          if (c) c.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setHasRecording(false);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const discardRecording = () => {
    setHasRecording(false);
    audioBlobRef.current = null;
    audioChunksRef.current = [];
    stopAllNodes();
  };

  const stopAllNodes = () => {
    for (const node of activeNodesRef.current) {
      try {
        node.disconnect();
      } catch (_) {
        /* already disconnected */
      }
    }
    activeNodesRef.current = [];
  };

  const saveToDisk = () => {
    if (!audioBlobRef.current) return;
    const url = URL.createObjectURL(audioBlobRef.current);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = `prankdeck-recording-${Date.now()}.webm`;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const playWithEffect = async () => {
    if (!audioBlobRef.current || isPlaying) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Stop previous playback
    stopAllNodes();

    const effectDef = EFFECTS.find((e) => e.id === effect) ?? EFFECTS[0];
    const arrayBuffer = await audioBlobRef.current.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = effectDef.playbackRate;
    activeNodesRef.current.push(source);

    // Build effect chain
    let lastNode: AudioNode = source;

    // Distortion via gain boost + clipping
    if (effectDef.distortion) {
      const distortionGain = ctx.createGain();
      distortionGain.gain.value = effectDef.distortion;
      lastNode.connect(distortionGain);
      lastNode = distortionGain;
      activeNodesRef.current.push(distortionGain);
    }

    // Biquad filter
    if (effectDef.filter) {
      const filter = ctx.createBiquadFilter();
      filter.type = effectDef.filter.type;
      filter.frequency.value = effectDef.filter.frequency;
      if (effectDef.filter.Q !== undefined) {
        filter.Q.value = effectDef.filter.Q;
      }
      lastNode.connect(filter);
      lastNode = filter;
      activeNodesRef.current.push(filter);
    }

    // Delay / Echo
    if (effectDef.delay) {
      const dryGain = ctx.createGain();
      dryGain.gain.value = 1 - effectDef.delay.wet;
      lastNode.connect(dryGain);
      dryGain.connect(ctx.destination);
      activeNodesRef.current.push(dryGain);

      const delayNode = ctx.createDelay();
      delayNode.delayTime.value = effectDef.delay.delayTime;
      const feedbackGain = ctx.createGain();
      feedbackGain.gain.value = effectDef.delay.feedback;
      const wetGain = ctx.createGain();
      wetGain.gain.value = effectDef.delay.wet;

      lastNode.connect(delayNode);
      delayNode.connect(feedbackGain);
      feedbackGain.connect(delayNode); // feedback loop
      delayNode.connect(wetGain);
      wetGain.connect(ctx.destination);

      activeNodesRef.current.push(delayNode, feedbackGain, wetGain);
    } else if (effectDef.reverb) {
      createReverbGraph(ctx, lastNode, ctx.destination);
      // reverb nodes aren't tracked individually — handled by stopAllNodes
    } else {
      // Direct connection
      lastNode.connect(ctx.destination);
    }

    source.onended = () => {
      setIsPlaying(false);
    };

    source.start(0);
    setIsPlaying(true);
  };

  const selectedEffect = EFFECTS.find((e) => e.id === effect) ?? EFFECTS[0];

  return (
    <div className="voice-studio-container">
      {/* Instructions panel */}
      <div className={`instructions-panel ${showInstructions ? 'expanded' : 'collapsed'}`}>
        <div className="instructions-header" onClick={() => setShowInstructions(!showInstructions)}>
          <h3>{showInstructions ? '📖 How to Use (click to collapse)' : '📖 How to Use (click to expand)'}</h3>
        </div>
        {showInstructions && (
          <div className="instructions-body">
            <ol>
              <li>
                <strong>Allow microphone access</strong> — your browser will prompt you. Audio stays local on your device.
              </li>
              <li>
                <strong>Tap "Start Recording"</strong> and speak into your mic. Tap <strong>"Stop Recording"</strong> when done.
              </li>
              <li>
                <strong>Choose an effect</strong> from the grid below — hover or tap any effect to read its description.
              </li>
              <li>
                <strong>Tap "▶ Play"</strong> to hear your voice with the selected effect.
              </li>
              <li>
                <strong>Save</strong> downloads the raw recording (no effects baked in). Apply effects live during playback!
              </li>
              <li>
                <strong>Switch effects</strong> and replay as many times as you like — the recording stays in memory.
              </li>
            </ol>
            <p className="instructions-note">
              💡 <em>Pro tip:</em> Record short clips (5–15 seconds) for the best effect experience.
              Use headphones to avoid feedback when recording near speakers.
            </p>
          </div>
        )}
      </div>

      <h2>🎛️ Local Voice Studio</h2>
      <p className="studio-description">
        Record your voice and transform it with 14 real-time effects using the Web Audio API.
      </p>

      {/* Recording controls */}
      <div className="recording-controls">
        {!isRecording ? (
          <button className="record-btn" onClick={startRecording} disabled={isPlaying}>
            🎤 Start Recording
          </button>
        ) : (
          <button className="stop-btn" onClick={stopRecording}>
            ⏹ Stop Recording
          </button>
        )}

        {isRecording && (
          <div className="recording-indicator">
            <span className="recording-dot" /> Recording... Speak now!
          </div>
        )}

        {isRecording && (
          <div className="visualizer-container">
            <canvas ref={canvasRef} width="400" height="100" className="audio-canvas"></canvas>
          </div>
        )}
      </div>

      {/* Effect selection grid */}
      {hasRecording && (
        <div className="playback-controls">
          <h3>🎭 Choose an Effect</h3>
          <div className="effects-grid">
            {EFFECTS.map((efx) => (
              <button
                key={efx.id}
                className={`effect-card ${effect === efx.id ? 'selected' : ''}`}
                onClick={() => setEffect(efx.id)}
                title={efx.description}
                aria-pressed={effect === efx.id}
                aria-label={`${efx.label} effect: ${efx.description}`}
              >
                <span className="effect-emoji">{efx.emoji}</span>
                <span className="effect-label">{efx.label}</span>
              </button>
            ))}
          </div>

          {/* Selected effect info */}
          <div className="selected-effect-info">
            <span className="effect-emoji">{selectedEffect.emoji}</span>
            <span className="effect-name">{selectedEffect.label}</span>
            <span className="effect-desc">{selectedEffect.description}</span>
          </div>

          {/* Action buttons */}
          <div className="action-buttons">
            <button
              className="play-btn"
              onClick={playWithEffect}
              disabled={isPlaying}
            >
              {isPlaying ? '🔊 Playing...' : '▶ Play'}
            </button>
            <button className="save-btn" onClick={saveToDisk} title="Save raw recording to your computer">
              💾 Save
            </button>
            <button className="discard-btn" onClick={discardRecording} title="Clear current recording">
              ✖ Discard
            </button>
          </div>
        </div>
      )}

      {!hasRecording && !isRecording && (
        <div className="empty-state">
          <p className="empty-emoji">🎙️</p>
          <p>Record a clip to get started with effects!</p>
        </div>
      )}
    </div>
  );
}
