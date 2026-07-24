import { useState, useRef } from 'react';
import './VoiceStudio.css';

export default function VoiceStudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [effect, setEffect] = useState('normal');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setHasRecording(false);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
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
    a.download = `prankdeck-recording-${Date.now()}.webm`;
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

    source.connect(ctx.destination);
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
