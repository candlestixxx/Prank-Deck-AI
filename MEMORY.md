# Architectural Memories

- The project relies heavily on the Web Audio API (`AudioContext`) to synthesize sounds and process microphone input.
- Routing is simply handled via a React state variable `activeTab` in `App.tsx` instead of a heavy router like `react-router-dom`, keeping the app lightweight.
- Media handling requires user interaction to initialize the audio context due to browser autoplay policies.
