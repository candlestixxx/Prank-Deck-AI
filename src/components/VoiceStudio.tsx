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
        // Why? Leaving tracks open keeps the recording indicator active in the browser tab
        // and wastes system resources.
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
      } catch {
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

  const downloadRecording = () => {
    if (!audioBlobRef.current) return;

    // Create an invisible anchor tag to trigger the browser's download functionality
    // This satisfies the "record and download locally" roadmap requirement securely.
    const url = URL.createObjectURL(audioBlobRef.current);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = `prankdeck-recording-${Date.now()}.webm`;
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="voice-studio-container">
      <h2>Local Voice Studio</h2>
      <p>Record your voice and play it back locally with fun effects.</p>

      <div className="recording-controls">
        {!isRecording ? (
          <button
            className="record-btn"
            onClick={startRecording}
            title="Start recording your voice"
            aria-label="Start Recording"
          >
            🎤 Start Recording
          </button>
        ) : (
          <button
            className="stop-btn"
            onClick={stopRecording}
            title="Stop recording"
            aria-label="Stop Recording"
          >
            ⏹ Stop Recording
          </button>
        )}

        {isRecording && <div className="recording-indicator">Recording...</div>}
      </div>

      {hasRecording && (
        <div className="playback-controls">
          <h3>Apply Effect & Play</h3>
          <div className="effects-selector">
            <label title="Play back with normal pitch">
              <input
                type="radio"
                value="normal"
                checked={effect === 'normal'}
                onChange={(e) => setEffect(e.target.value)}
                aria-label="Normal Effect"
              /> Normal
            </label>
            <label title="Play back with a high-pitched chipmunk effect">
              <input
                type="radio"
                value="chipmunk"
                checked={effect === 'chipmunk'}
                onChange={(e) => setEffect(e.target.value)}
                aria-label="Chipmunk Effect"
              /> Chipmunk
            </label>
            <label title="Play back with a low-pitched monster effect">
              <input
                type="radio"
                value="monster"
                checked={effect === 'monster'}
                onChange={(e) => setEffect(e.target.value)}
                aria-label="Monster Effect"
              /> Monster
            </label>
          </div>

          <div className="playback-buttons">
            <button
              className="play-btn"
              onClick={playWithEffect}
              title="Play the recording with the selected effect"
              aria-label="Play Recording"
            >
              ▶ Play Recording
            </button>

            <button
              className="download-btn"
              onClick={downloadRecording}
              title="Download your original recording"
              aria-label="Download Recording"
            >
              💾 Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
