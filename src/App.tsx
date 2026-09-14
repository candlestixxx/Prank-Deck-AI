import { useState } from 'react';
import './App.css';
import Soundboard from './components/Soundboard';
import VoiceStudio from './components/VoiceStudio';
import { AudioProvider, useSharedAudio } from './contexts/SharedAudio';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'soundboard' | 'studio'>('soundboard');
  const { volume, setVolume, initializeAudio } = useSharedAudio();

  return (
    <div className="app-container" onClickCapture={initializeAudio}>
      <header className="app-header">
        <h1>PrankDeck Studio (Local)</h1>
        <p className="app-subtitle">Safe, web-based soundboard & voice effects for personal entertainment</p>

        <div className="master-volume-control" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="master-volume" style={{ marginRight: '10px' }}>Master Volume:</label>
          <input
            id="master-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            title="Adjust master volume"
            aria-label="Master Volume Control"
          />
        </div>

        <nav className="app-nav">
          <button
            className={`nav-button ${activeTab === 'soundboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('soundboard')}
            title="Open the Mega Soundboard"
            aria-label="Mega Soundboard Tab"
          >
            Mega Soundboard
          </button>
          <button
            className={`nav-button ${activeTab === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('studio')}
            title="Open the Voice Studio"
            aria-label="Voice Studio Tab"
          >
            Voice Studio
          </button>
        </nav>
      </header>

      {/*
        Routing logic:
        Since this is a lightweight app, we avoid react-router-dom.
        Instead, we conditionally render the main view based on the activeTab state.
      */}
      <main className="app-main">
        {activeTab === 'soundboard' ? <Soundboard /> : <VoiceStudio />}
      </main>

      <footer className="app-footer">
        <p>This software is provided strictly for entertainment, personal parody, and comedic usage. It is designed for local playback and recording only.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}

export default App;
