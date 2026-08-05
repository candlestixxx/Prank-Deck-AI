# Project Structure Map

> Last updated: 2026-08-05 | Version: 1.1.0

## Repository
| Property | Value |
|----------|-------|
| **Remote URL** | `https://github.com/candlestixxx/Prank-Deck-AI.git` |
| **Default Branch** | `main` |
| **Upstream Fork** | None (standalone origin) |
| **Language** | TypeScript |
| **Framework** | Vite + React 19 |

## Branch Inventory
| Branch | HEAD Commit | Status |
|--------|-------------|--------|
| `main` | `a59cda6` | **Active** — current release (v1.1.0) |
| `init-documentation-and-ui-enhancement` | merged | Fully merged into `main` |
| `init-safe-architecture` | merged | Fully merged into `main` |
| `jules-9956925773432264551-9f00ac93` | merged | Fully merged into `main` |

## Submodules
- **None** — No git submodules configured.

## File Layout
```
Prank-Deck-AI/
├── .gitignore                    # Node.js/Vite hygiene
├── .oxlintrc.json                # Oxford linter config
├── CHANGELOG.md                  # Release history
├── DEPLOY.md                     # Local setup & build instructions
├── HANDOFF.md                    # Session handoff log
├── IDEAS.md                      # Feature brainstorming
├── LEGAL_NOTICE.md               # Safety & legal disclaimers
├── MEMORY.md                     # Architectural decisions log
├── README.md                     # Project overview
├── ROADMAP.md                    # Phased development plan
├── STRUCTURE.md                  # This file — structural map
├── TODO.md                       # Immediate action items
├── VERSION.md                    # Semantic version (1.1.0)
├── VISION.md                     # Project vision statement
├── index.html                    # SPA entry point
├── package.json                  # Root dependencies & scripts
├── package-lock.json
├── tsconfig.json                 # TypeScript base config
├── tsconfig.app.json             # App-specific TS config
├── tsconfig.node.json            # Node-specific TS config
├── vite.config.ts                # Vite build config
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Root component (tab-based routing)
│   ├── App.css
│   ├── index.css                 # Global styles
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   └── components/
│       ├── Soundboard.tsx         # Web Audio API synthesizer soundboard
│       ├── Soundboard.css
│       ├── VoiceStudio.tsx        # MediaRecorder voice recording + effects
│       └── VoiceStudio.css
└── core-orchestrator/
    ├── package.json               # Express + WebSocket backend
    ├── package-lock.json
    ├── tsconfig.json
    ├── dist/                      # Compiled JS output
    │   ├── index.js               # Express server with WS endpoints
    │   └── index.test.js          # Node test runner tests
    └── src/
        ├── index.ts               # Server source (WebSocket orchestration)
        └── index.test.ts          # Test source
```

## Architecture Notes
- **Frontend:** Single-page React app with tab-based routing (no react-router). Uses Web Audio API (`AudioContext`, `OscillatorNode`) for sound synthesis and `MediaRecorder` for voice capture.
- **Backend (core-orchestrator):** Express 5 + WebSocket server for real-time orchestration. Currently in development — compiled to `dist/` via `tsc`.
- **Safety Boundary:** Strictly local-only; no C++ drivers, no virtual audio routing, no third-party app injection.
