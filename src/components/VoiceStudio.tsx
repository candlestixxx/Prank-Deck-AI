import { useState, useRef, useEffect } from 'react';
import './VoiceStudio.css';

export default function VoiceStudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [effect, setEffect] = useState('normal');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Analyzer refs
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

    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * canvas.height / 2;

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

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
      'audio/aac',
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return ''; // Default to browser's native format if none explicitly match
  };

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up analyzer
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

      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        audioBlobRef.current = audioBlob;
        setHasRecording(true);

        // Stop all tracks to release microphone
        if (streamRef.current) {
           streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (animationFrameRef.current) {
           cancelAnimationFrame(animationFrameRef.current);
        }

        // Clear canvas
        if (canvasRef.current) {
           const ctx = canvasRef.current.getContext('2d');
           if (ctx) {
             ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
           }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setHasRecording(false);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMsg("Could not access microphone. Please check your browser permissions and ensure no other application is using it.");
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
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore
      }
    }
  };

  const saveToDisk = () => {
    if (!audioBlobRef.current) return;
    const url = URL.createObjectURL(audioBlobRef.current);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;

    // Determine file extension based on blob type
    const mimeType = audioBlobRef.current.type;
    let ext = 'webm';
    if (mimeType.includes('mp4')) ext = 'mp4';
    else if (mimeType.includes('ogg')) ext = 'ogg';
    else if (mimeType.includes('aac')) ext = 'aac';

    a.download = `prankdeck-recording-${Date.now()}.${ext}`;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const playWithEffect = async () => {
    if (!audioBlobRef.current) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;

    // Stop previous playback if any
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore if already stopped
      }
    }

    const arrayBuffer = await audioBlobRef.current.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    sourceNodeRef.current = source;

    // Apply simple pitch shifting for effects
    if (effect === 'chipmunk') {
      source.playbackRate.value = 1.8;
    } else if (effect === 'monster') {
      source.playbackRate.value = 0.6;
    } else {
      source.playbackRate.value = 1.0;
    }

    // Apply Biquad Filter for Telephone effect
    if (effect === 'telephone') {
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 2000;

      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 500;

      source.connect(lowpass);
      lowpass.connect(highpass);
      highpass.connect(ctx.destination);
    } else {
      source.connect(ctx.destination);
    }

    source.start(0);
  };

  return (
    <div className="voice-studio-container">
      <h2>Local Voice Studio</h2>
      <p>Record your voice and play it back locally with fun effects.</p>

      <div className="recording-controls">
        {!isRecording ? (
          <button className="record-btn" onClick={startRecording}>
            🎤 Start Recording
          </button>
        ) : (
          <button className="stop-btn" onClick={stopRecording}>
            ⏹ Stop Recording
          </button>
        )}

        {isRecording && <div className="recording-indicator">Recording...</div>}
      </div>

      {errorMsg && (
        <div className="error-message">
          <p>⚠️ {errorMsg}</p>
        </div>
      )}

      <div className="visualizer-container" style={{ display: isRecording ? 'block' : 'none' }}>
         <canvas ref={canvasRef} width="400" height="100" className="audio-canvas"></canvas>
      </div>

      {hasRecording && (
        <div className="playback-controls">
          <h3>Apply Effect & Play</h3>
          <div className="effects-selector">
            <label>
              <input
                type="radio"
                value="normal"
                checked={effect === 'normal'}
                onChange={(e) => setEffect(e.target.value)}
              /> Normal
            </label>
            <label>
              <input
                type="radio"
                value="chipmunk"
                checked={effect === 'chipmunk'}
                onChange={(e) => setEffect(e.target.value)}
              /> Chipmunk
            </label>
            <label>
              <input
                type="radio"
                value="monster"
                checked={effect === 'monster'}
                onChange={(e) => setEffect(e.target.value)}
              /> Monster
            </label>
            <label>
              <input
                type="radio"
                value="telephone"
                checked={effect === 'telephone'}
                onChange={(e) => setEffect(e.target.value)}
              /> Telephone
            </label>
          </div>

          <div className="action-buttons">
            <button className="play-btn" onClick={playWithEffect}>
              ▶ Play
            </button>
            <button className="save-btn" onClick={saveToDisk} title="Save audio to your computer">
              💾 Save
            </button>
            <button className="discard-btn" onClick={discardRecording} title="Clear recording">
              ✖ Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
