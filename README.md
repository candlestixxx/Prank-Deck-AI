# Prank-Deck-AI
```markdown
# PrankDeck Universal 🎛️🎙️🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform Compatibility](https://img.shields.io/badge/Platforms-Windows%20%7C%20macOS%20%7C%20Android%20%7C%20iOS-blue.svg)](#)
[![Latency Target](https://img.shields.io/badge/Audio%20Latency-%3C500ms-brightgreen.svg)](#)

PrankDeck Universal is an all-in-one, cross-platform engine designed to route modulated voice profiles, real-time AI-cloned speech, and dynamic tap-to-trigger response grids directly into the audio pipeline of any system-wide voice utility. 

This repository houses the core architecture for the **System-Wide Virtual Audio Driver Matrix**, the **Low-Latency AI Text-to-Speech Streaming Loop**, and the user configuration profiles spanning across mobile, desktop, modern multiplayer titles, and standalone chat communication suites.

---

## 🏗️ High-Level System Architecture


```

[ Physical Microphone Input ]
│
▼
┌──────────────────────────────────────┐
│     PrankDeck Core Processing Core   │ ◄─── [ User Dashboard Grid UI ]
│ ┌──────────────────────────────────┐ │      (Tap Blocks, Sliders, Prompts)
│ │ • Audio DSP (Pitch & Formant)    │ │
│ │ • Sub-500ms AI Speech Generation │ │
│ └──────────────────────────────────┘ │
└────────────┬─────────────────────────┘
│ (Processed Audio Stream)
▼
┌──────────────────────────────────────┐
│  System Virtual Audio Driver Layer   │
│ ┌──────────────────────────────────┐ │
│ │ • Windows: WASAPI / SYSVAD       │ │
│ │ • macOS: AudioDriverKit CoreAudio│ │
│ │ • Android: Oboe Foreground Loop  │ │
│ │ • iOS: AVAudioSession Gateway    │ │
│ └──────────────────────────────────┘ │
└────────────┬─────────────────────────┘
│ (Registered as "Hardware Mic Input")
▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Target Application Voice Capture                      │
│  [💬 Apps] Discord, WhatsApp, Telegram, Messenger Kids                 │
│  [🎮 Games] Roblox, Fortnite, Minecraft, Rocket League Proximity Chat  │
└────────────────────────────────────────────────────────────────────────┘

```

---

## 📂 Repository Directory Structure

```text
├── drivers/                  # Platform-Specific OS Kernel/User Audio Drivers
│   ├── windows-sysvad/       # WASAPI Virtual Audio Device implementation (C++)
│   ├── macos-hal/            # AudioDriverKit CoreAudio Virtual HAL driver (Swift/C++)
│   ├── android-oboe/         # Low-latency background loopback engine (C++/Java)
│   └── ios-audio-unit/       # AUv3 CoreAudio interface capture extension (Swift)
├── core-orchestrator/        # Backend Real-time Audio Routing Pipeline (TypeScript)
│   ├── src/
│   │   ├── audio/            # DSP Engine, Pitch-shifting & Formant-modulation nodes
│   │   ├── ai-agent/         # LLM Streaming & ultra-low latency TTS WebSockets
│   │   └── guardrails/       # Regex interceptors, legal verification hooks
│   └── package.json
├── client-app/               # Cross-Platform User Interface (Flutter / React Native)
│   └── src/components/       # Tap-to-Trigger responsive soundboard visual grid
└── LEGAL_NOTICE.md           # Mandatory Global Liability & EULA Framework

```

---

## ⚖️ Legal & Liability Guardrails (Mandatory Compliance)

Because this software architecture is open for all-ages use cases, this engine enforces immutable program constraints built into the processing runtime to prevent structural liability.

### 1. Hard Click-Through EULA Block

The system-wide drivers cannot be initialized until an analytical agreement payload is confirmed by the system device identifier. The text of the complete notice is accessible inside [`LEGAL_NOTICE.md`](https://www.google.com/search?q=LEGAL_NOTICE.md).

> **⚠️ Core Liability Disclaimer Requirement:**
> This software application is provided strictly for entertainment, personal parody, and comedic usage. Under no circumstances shall this software be utilized to intentionally harass, defraud, stalk, or impersonate real persons without consent, or to assume the identity of any local, state, or federal government agency, law enforcement entity, emergency services operator, or financial institution. The developers, parent corporation, and distributors of this application explicitly disclaim all liability for any illicit, fraudulent, or illegal use of the real-time audio modulation tools.

### 2. Algorithmic Guardrails

The `core-orchestrator/src/guardrails/` component maintains:

* **Regex Prompt Filter:** An inline scanning engine that immediately intercept and drops any text inputs or voice transcription prompts associated with high-risk institutions (*e.g., "FBI", "IRS", "911", "Police Department"*).
* **Acoustic Signature Blocker:** DSP filters designed to monitor output frequencies and prevent the creation of emergency vehicle sirens, official agency tones, or state emergency broadcast signal replication.

---

## ⚡ Technical Core Features

* **Zero-Latency Audio Transcoding:** Directly maps audio frames matching standard VoIP and communications inputs inside standard processing blocks, completely preventing resampling delay.
* **Soundboard "Barge-In" Routing:** Integrates an automatic Voice Activity Detection (VAD) interrupt framework. Tapping a manual sound block instantly emits a `clear` message down the active output channel, clearing the queue to let the human operator immediately override an automated AI sequence.
* **Ages-Based Feature Mode Toggles:**
* *Junior / Safe Profile:* Restricts the generation pipeline entirely to local pre-loaded filters (Alien, Robot, Chipmunk) and wholesome soundboard effects.
* *Advanced Engine Profile:* Unlocks linear pitch adjustment sliders, custom real-time Text-to-Speech prompt nodes, and voice signature duplication frameworks.



---

## 🛠️ Local Development & Scaffolding Checklist

To spin up a local development instance of the orchestrator layer mapping to your hardware audio outputs:

### 1. Prerequisites

* Node.js >= v18.0.0
* CMake (for building platform-specific C++ drivers in `/drivers`)

### 2. Installation

```bash
# Clone the repository
git clone [https://github.com/yourusername/prankdeck-universal.git](https://github.com/yourusername/prankdeck-universal.git)
cd prankdeck-universal/core-orchestrator

# Install core orchestration packages
npm install

```

### 3. Environment Configuration

Create a `.env` file within the `core-orchestrator/` folder:

```env
PORT=5050
TTS_PROVIDER_API_KEY=your_low_latency_tts_key_here
LLM_PROVIDER_API_KEY=your_llm_intelligence_key_here
ENFORCE_SAFETY_GUARDRAILS=true

```

### 4. Running the Orchestrator

```bash
npm run dev

```

---

## 📜 License

This software configuration is released under the **MIT License**. The underlying platform virtual audio device drivers are subject to their respective Microsoft, Apple, and open-source foundation licensing agreements.

```

```
---

## 🌲 A Note from the Creator (LK2026)

> "I created this project during the second night of the Canadian wildfires in Detroit, Michigan on 7/17/2026. The smoke has been affecting the Metro Detroit area now for 3 days and 2 nights. It's a weary sort of vibe that has blanketed our piece of this earth—unlike any vibe I have ever experienced from mother nature, most likely because it's a totally new experience. 
>
> Gauging everything and everyone in my travels during these wildfires, I can feel a sort of leery uprising in energy, not only from nature, but from the people too. It's an amazing experience that we all will most likely end up regretting lol. 
>
> Based on the events of my life leading up to this repo, I find that humor is one of the essential ingredients needed for survival. It's a part of Love. I made this with the hopes of sharing laughs and creating hilarious moments for you to share with your family, friends, and even yourself! 
>
> I give all the thanks to the Lord, my creative partner, fellow artist, and good best friend Bob, my Family, and the very few friends who have supported me along the way. It's a long story... "
> 
> — **LK2026** 🕊️

---
