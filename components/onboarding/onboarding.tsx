'use client';
import { useState } from 'react';

export default function CallAgent() {
    const [phone, setPhone] = useState('');
    const [prompt, setPrompt] = useState('Ask the user about their day and summarize it.');
    const [status, setStatus] = useState('');

    const startCall = async () => {
        setStatus('Initiating call...');

        const res = await fetch('/api/make-call', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, prompt }),
        });

        if (res.ok) setStatus('Call initiated! agent will speak when answered.');
        else setStatus('Error starting call.');
    };

    return (
        <div className="p-10 max-w-md mx-auto space-y-4">
            <h1 className="text-2xl font-bold">AI Voice Agent Demo</h1>

            <input
                type="text"
                placeholder="+15550001234"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <textarea
                placeholder="What should the AI do?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="border p-2 w-full h-32 rounded"
            />

            <button
                onClick={startCall}
                className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700"
            >
                Call Now
            </button>

            <p className="text-sm text-gray-600">{status}</p>
        </div>
    );
}