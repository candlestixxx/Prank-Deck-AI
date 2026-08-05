# TODO

## Immediate Bug Fixes & Refactoring
- [ ] Currently, the `VoiceStudio` component forces a `webm` blob structure. Evaluate cross-browser compatibility (Safari may prefer `mp4` or raw `pcm` via `AudioWorklet`).
- [ ] Add explicit error handling UI to the microphone permission catch block (currently it just uses a standard browser `alert()`).
- [ ] The synth soundboard uses basic oscillators. Refactor to accept optional parameters for envelope shaping to make the "Drum Roll" actually sound like a drum.

## Explicit UI Tasks
- [ ] Add tooltips to the Soundboard buttons explaining what the sound is.
- [x] Make the active tab in the navigation bar more visually distinct (perhaps a glowing border).
- [x] Add an "X" or clear button to the Voice Studio to discard the current recording without playing it.

## Repository Sync (2026-08-05)
- [x] Fetch all remote branches — no new changes
- [x] Inspect all feature branches — all already merged into `main`
- [x] Sync `package.json` version to match `VERSION.md` (1.1.0)
- [x] Create `STRUCTURE.md` with full project map
- [x] Update `CHANGELOG.md`, `ROADMAP.md`, `TODO.md`, `HANDOFF.md`
- [x] Build verification (`npm run build`)
- [x] Push to `origin/main`
