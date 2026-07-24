# CHANGELOG

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
