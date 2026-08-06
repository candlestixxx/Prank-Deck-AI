# CHANGELOG

## [1.2.0] — 2026-08-05

### Added
- Expanded Voice Studio effects library: 14 voice effects (was 2)
  - New effects: robot, echo, phone, slowmo, fast, deep, helium, reverb, alien, underwater, megaphone
  - Each effect has emoji + description label
  - Audio graph modifiers: `BiquadFilterNode`, delay node, reverb simulation, wave-shaping distortion
  - Effect definitions include: `playbackRate`, `filter` (type/frequency/Q), `delay` (time/feedback/wet), `distortion`
  - Effects displayed as scrollable grid of toggle buttons
- Refactored VoiceStudio component: `EffectDef` interface, `EFFECTS` constant array, stateful effect selection

## [1.1.1] — 2026-08-05

### Fixed
- Synced `package.json` version from `0.0.0` to `1.1.0` (was out of step with `VERSION.md`)

### Added
- `STRUCTURE.md` — full project structural map with branch inventory, file layout, and architecture notes

### Repository
- Confirmed all 3 remote feature branches already merged into `main`; no drift
- No submodules, no upstream fork

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
