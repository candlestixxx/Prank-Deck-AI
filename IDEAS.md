# IDEAS: Future Expansions & Creative Pivots

This file documents aggressive, safe, and creative ideas for future iterations of PrankDeck Studio (Local Edition).

## 1. Advanced Browser-Based DSP (Safe Expansion)
*   **Reverb & Delay Nodes:** Chain `ConvolverNode` and `DelayNode` to the `AudioContext` to create "Cave," "Robot," or "Stadium" voice effects locally.
*   **Biquad Filters:** Implement low-pass and high-pass filters (`BiquadFilterNode`) for a "Telephone" or "Megaphone" effect.

## 2. Dynamic Synthesizer UI
*   Upgrade the "Mega Soundboard" from static synthesized beeps to a mini-synthesizer keyboard layout, allowing users to play simple melodies.
*   Add ADSR (Attack, Decay, Sustain, Release) envelope controls to the UI so users can shape the synthesized soundboard hits.

## 3. Local Export/Save
*   Allow users to download their pitch-shifted recordings directly to their local filesystem as `.webm` or `.wav` files (using a Blob URL and anchor download tag).

## 4. UI Theming Engine
*   Implement a React Context for theming, allowing users to switch the UI between "Neon Cyberpunk," "Classic Woodgrain," or "Minimalist Dark Mode."

## 5. Offline PWA Support
*   Add a Service Worker and `manifest.json` to turn the application into a Progressive Web App (PWA), allowing users to install the soundboard directly to their device home screen for offline use.
