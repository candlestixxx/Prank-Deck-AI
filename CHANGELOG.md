# CHANGELOG

## [1.6.0] - 2026-07-27

### Added
- Upgraded the static web application to a Progressive Web App (PWA) using `vite-plugin-pwa` and Workbox, allowing for offline capability and native-like installation on devices.
- Generated a `manifest.webmanifest` and Service Worker during the build process.

## [1.5.0] - 2026-07-26

### Added
- Implemented a dynamic Light/Dark mode UI toggle via a button in the main header, refactoring CSS to use `data-theme` CSS variables.
- Improved cross-browser compatibility in the Voice Studio by dynamically determining the best supported recording `mimeType` using `MediaRecorder.isTypeSupported` (e.g., fallback to `audio/mp4` for Safari).
- Updated "Save to Disk" functionality to export files with the correct extension based on the actual recorded mime type.

## [1.4.0] - 2026-07-25

### Added
- Implemented ADSR (Attack, Decay, Sustain, Release) envelope shaping for the Soundboard synthesizer, dramatically improving the percussive and dynamic quality of the generated sounds.
- Added full keyboard accessibility (a11y) to the Soundboard grid, including `Enter`/`Space` triggers and visible focus outlines.

## [1.3.0] - 2026-07-24

### Added
- Added a "Telephone" DSP effect utilizing chained `BiquadFilterNode`s (highpass and lowpass) to the Voice Studio.
- Implemented a clean, inline UI error message for microphone permission failures, replacing the default browser alert.

## [1.2.0] - 2026-07-24

### Added
- Added a visual audio analyzer (canvas waveform) to the Voice Studio to show real-time microphone input levels during recording.
- Added descriptive tooltips to the Soundboard buttons.

## [1.1.0] - 2026-07-21

### Added
- Added "Save to Disk" functionality in the Voice Studio, allowing local export of `.webm` files.
- Added a "Discard" button in the Voice Studio to safely clear the active recording buffer.
- Updated Navigation UI to include a glowing border and distinct visual state for the active tab.

## [1.0.0] - 2026-07-17

### Added
- Initialized PrankDeck Studio (Local Edition).
- Built "Mega Soundboard" using `AudioContext` and `OscillatorNode` for local, zero-asset playback.
- Built "Voice Studio" using `MediaRecorder` for capturing local microphone input safely.
- Implemented basic playback rate modification (Chipmunk, Monster effects) applied locally via `AudioBufferSourceNode`.
- Created robust safety documentation (`LEGAL_NOTICE.md`).
- Established core project governance files (`VISION.md`, `MEMORY.md`, `DEPLOY.md`, `IDEAS.md`, `ROADMAP.md`, `TODO.md`, `VERSION.md`).
