# VISION: PrankDeck Studio (Local Edition)

## Ultimate Goal
To provide a highly entertaining, safe, and entirely local web-based soundboard and voice modification application. The project strictly prioritizes user safety by ensuring all audio synthesis and modification happens client-side in the browser, explicitly preventing any system-level audio injection, interception, or external application spoofing.

## Core Foundational Concepts
1.  **Local Execution Only:** The application relies entirely on browser-native APIs (Web Audio API, `getUserMedia`) to handle recording and playback. Audio data never leaves the user's browser, nor is it routed to virtual drivers.
2.  **Safety by Design:** By omitting virtual audio drivers (like WASAPI, SYSVAD, or AudioDriverKit), the application physically cannot be used as a "man-in-the-middle" to alter live communication streams in apps like Discord or Zoom.
3.  **Instant Responsiveness:** Using the React framework and Vite for rapid development, the UI must feel snappy. Soundboard buttons trigger synthesized tones instantly without requiring external asset fetching.
4.  **Creative Play:** Providing safe, built-in DSP effects (pitch shifting, speed manipulation) allows users to experiment with their voice in a sandbox environment.

## User-Satisfaction Design
*   **Grid Interface:** A touch-friendly, visually distinct grid for the "Mega Soundboard" grouping sounds by category.
*   **Clear Modals & Controls:** The "Voice Studio" uses intuitive recording paradigms (Start/Stop buttons with clear visual indicators) to prevent confusion.
*   **Wholesome Themes:** Pre-packaged effects (Chipmunk, Monster) lean towards lighthearted fun.
