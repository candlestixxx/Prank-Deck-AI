import { useState } from 'react';
import './App.css';
import Soundboard from './components/Soundboard';
import VoiceStudio from './components/VoiceStudio';

function App() {
  const [activeTab, setActiveTab] = useState<'soundboard' | 'studio'>('soundboard');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>PrankDeck Studio (Local)</h1>
        <p className="app-subtitle">Safe, web-based soundboard & voice effects for personal entertainment</p>
        <nav className="app-nav">
          <button
            className={`nav-button ${activeTab === 'soundboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('soundboard')}
          >
            Mega Soundboard
          </button>
          <button
            className={`nav-button ${activeTab === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('studio')}
          >
            Voice Studio
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'soundboard' ? <Soundboard /> : <VoiceStudio />}
      </main>

      <footer className="app-footer">
        <p>This software is provided strictly for entertainment, personal parody, and comedic usage. It is designed for local playback and recording only.</p>
      </footer>
    </div>
  );
}

export default App;
