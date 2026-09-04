# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - IndexedDB Persistence for Custom Sounds
- Implemented IndexedDB via `PrankDeckDB` to persist custom uploaded files across browser reloads.
- Added a delete button and styling to custom sounds to manage the stored IndexedDB entries.

## [1.4.0] - Advanced DSP Filters
- Added 'Radio' effect to Voice Studio using a BiquadFilterNode chain to simulate small speakers.
- Added 'Echo' effect to Voice Studio using a DelayNode with a feedback loop.

## [1.3.0] - Audio Canvas Visualizer
- Added a `<canvas>` element to Voice Studio that draws real-time oscilloscope waveforms.
- Implemented Web Audio API `AnalyserNode` logic to hook into the mic stream and playback nodes.
- Styled the visualizer with a sleek dark theme and blue accent line.

## [1.2.0] - Voice Studio Recording Downloads
- Added ability to download recorded `.webm` files directly from the browser locally in Voice Studio.
- Completed all outstanding immediate tasks in TODO.md.

## [1.1.0] - Custom Sounds & Mobile Layout
- Added custom audio file upload support to the Soundboard component using Blob/ArrayBuffer.
- Added media queries to `Soundboard.css` and `App.css` to improve mobile responsiveness.

## [1.0.0] - Initial Standardization
- Initial creation of standard documentation (VISION, MEMORY, DEPLOY, IDEAS, ROADMAP, TODO, HANDOFF, VERSION).
- Added UI tooltips and robust code commenting to core components.
