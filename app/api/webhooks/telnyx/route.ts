import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const event = body.data;

    // 1. Listen for when the call is answered
    if (event.event_type === 'call.answered') {
        const callControlId = event.payload.call_control_id;

        // Retrieve the prompt we sent in the custom headers earlier
        // (In production, you might fetch this from a DB using the call ID)
        const aiPrompt = event.payload.custom_headers?.find(h => h.name === "X-AI-Prompt")?.value
            || "You are a helpful assistant.";

        // 2. Command Telnyx to start the AI Agent
        await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/ai_assistant_start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
            },
            body: JSON.stringify({
                assistant: {
                    system_prompt: aiPrompt,
                    voice: "Telnyx.KokoroTTS.af_bella", // Choose a voice
                    openai_api_key: process.env.OPENAI_API_KEY // Optional: Use your own key or Telnyx's models
                },
                transcription: {
                    language: "en"
                }
            }),
        });

        console.log(`AI Agent started for call ${callControlId}`);
    }

    // 3. Listen for when the call ends to get the summary
    if (event.event_type === 'call.conversation.ended') {
        console.log("Transcript:", event.payload.transcript);
        // TODO: Save transcript/summary to your database here
    }

    return NextResponse.json({ received: true });
}