import React, { useState } from 'react';

interface BlockProps {
    label: string;
    onClick: () => void;
}

const ResponseBlock: React.FC<BlockProps> = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="response-block"
        style={{
            padding: '10px 15px',
            margin: '5px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        }}
    >
        {label}
    </button>
);

const Section: React.FC<{ title: string; blocks: string[]; onTrigger: (label: string) => void }> = ({ title, blocks, onTrigger }) => (
    <div className="grid-section" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {blocks.map((block) => (
                <ResponseBlock key={block} label={block} onClick={() => onTrigger(block)} />
            ))}
        </div>
    </div>
);

export const SoundboardGrid: React.FC = () => {
    const [lastTriggered, setLastTriggered] = useState<string | null>(null);

    const handleTrigger = (label: string) => {
        setLastTriggered(label);
        // In a real app, this would emit a WebSocket message to the orchestrator
        console.log(`Triggered: ${label}`);
    };

    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            <h2>Live Call Interface</h2>
            {lastTriggered && <p style={{ color: 'green' }}>Last Triggered: {lastTriggered}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Section title="GREETINGS" blocks={["Hello?", "Who's this?"]} onTrigger={handleTrigger} />
                <Section title="ACCUSATIONS" blocks={["You hit my car", "Pay up!"]} onTrigger={handleTrigger} />
                <Section title="DEFENSIVE" blocks={["No way", "Check video"]} onTrigger={handleTrigger} />
                <Section title="AI ASSIST" blocks={["🤖 Generate Comeback"]} onTrigger={handleTrigger} />
            </div>
        </div>
    );
};

export default SoundboardGrid;
