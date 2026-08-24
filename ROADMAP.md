# ROADMAP

## Phase 1: Foundation (Completed)
- [x] Scaffold Vite + React application.
- [x] Implement safe Web Audio API fallback for soundboard.
- [x] Implement local `getUserMedia` recording block for Voice Studio.
- [x] Implement primary safety disclaimers (`LEGAL_NOTICE.md`).

## Phase 2: Enhanced Local Effects (Active)
- [ ] Refactor Voice Studio to use `BiquadFilterNode` for telephone/radio effects.
- [x] Add a "Save to Disk" button to allow users to export their recorded `.webm` files locally.
- [x] Add visual audio analyzers (canvas-based waveforms) to the Voice Studio to show microphone input levels.

## Phase 3: Polish & Accessibility (Future)
- [ ] Convert static UI to a Progressive Web App (PWA) with a Service Worker for offline capability.
- [ ] Implement full keyboard navigation (a11y) across the Soundboard grid.
- [ ] Add customizable theming (Light/Dark/Neon).
