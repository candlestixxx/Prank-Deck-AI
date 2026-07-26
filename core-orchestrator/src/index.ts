import express from 'express';
import ExpressWS from 'express-ws';
import WebSocket from 'ws';

const appBase = express();
const wsApp = ExpressWS(appBase);
const app = wsApp.app;

const PORT = process.env.PORT || 5050;

// 1. Initial Webhook: Instruct Twilio to open a Bidirectional WebSocket
app.post('/incoming-call', (req, res) => {
    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Say>Connecting to secure prank deck line.</Say>
            <Connect>
                <Stream url="wss://${req.headers.host}/media-stream" />
            </Connect>
        </Response>`);
});

// 2. Central WebSocket Handler
app.ws('/media-stream', (twilioWs: WebSocket) => {
    console.log('Twilio Media Stream WebSocket Connected.');

    let streamSid: string | null = null;
    let callSid: string | null = null;

    // Establish your persistent connection to your fast TTS engine (e.g., ElevenLabs Streaming WS)
    // Pass query arguments specifying: container=none, encoding=mulaw, sample_rate=8000
    const ttsWsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${process.env.VOICE_ID}/stream-input?model_id=eleven_flash_v2_5&output_format=ulaw_8000`;
    const ttsWs = new WebSocket(ttsWsUrl);

    ttsWs.on('open', () => {
        // Initialize ElevenLabs session settings
        ttsWs.send(JSON.stringify({
            text: " ",
            voice_settings: { stability: 0.4, similarity_boost: 0.8 },
            xi_api_key: process.env.ELEVENLABS_API_KEY
        }));
    });

    // Handle streaming audio back from the TTS engine
    ttsWs.on('message', (data: Buffer) => {
        if (!streamSid) return;

        // ElevenLabs outputs raw 8kHz mu-law chunks; base64 encode them and pipe directly to Twilio
        const base64Payload = data.toString('base64');
        const outboundMessage = {
            event: 'media',
            streamSid: streamSid,
            media: { payload: base64Payload }
        };
        twilioWs.send(JSON.stringify(outboundMessage));
    });

    // Handle incoming payloads from the active Twilio phone call leg
    twilioWs.on('message', (msg: string) => {
        const data = JSON.parse(msg);

        switch (data.event) {
            case 'start':
                streamSid = data.start.streamSid;
                callSid = data.start.callSid;
                console.log(`Stream started. StreamSid: ${streamSid}, CallSid: ${callSid}`);
                break;

            case 'media':
                // Inbound target audio payload (base64 mu-law)
                // const inboundAudioPayload = data.media.payload;

                // ROUTE A: Forward this raw buffer to your ASR / Transcription engine
                // streamToTranscriptionEngine(inboundAudioPayload);
                break;

            case 'stop':
                console.log('Twilio Call Stream stopped.');
                ttsWs.close();
                break;
        }
    });

    // ROUTE B: Interface hook exposed to the user's soundboard app layout
    // When the user clicks an arranged block, your app triggers this internal callback
    // function onUserManualTapTrigger(audioBuffer8kHzMulaw: Buffer) {
    //     if (!streamSid) return;
    //
    //     // Interrupt any ongoing AI speech by clearing the Twilio buffer
    //     twilioWs.send(JSON.stringify({ event: 'clear', streamSid: streamSid }));
    //
    //     // Chunk the pre-recorded/modulated audio into 160-byte packets and stream them
    //     const chunkSize = 160;
    //     for (let i = 0; i < audioBuffer8kHzMulaw.length; i += chunkSize) {
    //         const chunk = audioBuffer8kHzMulaw.subarray(i, i + chunkSize);
    //         twilioWs.send(JSON.stringify({
    //             event: 'media',
    //             streamSid: streamSid,
    //             media: { payload: chunk.toString('base64') }
    //         }));
    //     }
    // }
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Pipeline Orchestrator running on port ${PORT}`));
}

export default app;
