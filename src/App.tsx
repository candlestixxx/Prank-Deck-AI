import { useState, useEffect } from 'react';
import './App.css';
import Soundboard from './components/Soundboard';
import VoiceStudio from './components/VoiceStudio';

function App() {
  const [activeTab, setActiveTab] = useState<'soundboard' | 'studio'>('soundboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check initial system preference or local storage (simplifying for this demo to just state)
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-top">
          <h1>PrankDeck Studio (Local)</h1>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
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
