import { useState } from 'react';
import './App.css';
import { SoundboardGrid } from './components/SoundboardGrid';

function App() {
  const [target] = useState('John Doe');

  return (
    <div className="App" style={{ padding: '20px' }}>
      <header className="App-header">
        <h1>PrankDeck AI Dashboard</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #666', paddingBottom: '10px' }}>
          <span>Target: {target}</span>
          <span>Voice Profile: [ Angry Neighbor v2 ] | Pitch: +12%</span>
        </div>
      </header>
      <main style={{ marginTop: '20px' }}>
        <SoundboardGrid />
      </main>
    </div>
  );
}

export default App;
