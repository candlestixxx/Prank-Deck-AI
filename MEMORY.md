# MEMORY: Architectural Observations

## Codebase Traits
*   **Framework:** React 18+ with TypeScript for strong typing and component architecture.
*   **Build Tool:** Vite for lightning-fast HMR and optimized production builds.
*   **Audio Engine:** The application exclusively uses the browser's native `AudioContext` and `MediaRecorder` APIs.
    *   *Soundboard:* Utilizes `OscillatorNode` to generate synthesized sounds dynamically, eliminating the need to manage `.mp3` or `.wav` static assets in the repository.
    *   *Voice Studio:* Captures audio as `audio/webm` blobs, decodes them via `AudioContext.decodeAudioData`, and manipulates playback speed/pitch using `playbackRate` on an `AudioBufferSourceNode`.

## Design Preferences
*   **Component Structure:** Logically separated functional components (`Soundboard.tsx`, `VoiceStudio.tsx`) injected into a central `App.tsx` router/tab-manager.
*   **CSS strategy:** Scoped CSS files per component (`Soundboard.css`) combined with a global `App.css` for structural layout and color variables (supporting light/dark mode via `prefers-color-scheme`).
*   **Strict Security Posture:** No dependencies on Node.js backend services or C++ system drivers. The architecture acts entirely as a static SPA (Single Page Application).
