import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const event = body.data;

    // 1. Listen for when the call is answered
    if (event.event_type === 'call.answered') {
        const callControlId = event.payload.call_control_id;

        console.log('callControlId', callControlId);
        // Retrieve the prompt we sent in the custom headers earlier
        // (In production, you might fetch this from a DB using the call ID)
        const aiPrompt = event.payload.custom_headers?.find((h: Record<string, string>) => h.name === "X-AI-Prompt")?.value
            || "You are a helpful assistant.";

        // 2. Command Telnyx to start the AI Agent
        const aiResponse = await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/ai_assistant_start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
            },
            body: JSON.stringify({
                assistant: {
                    id: "assistant-608374c2-d91a-40c2-a9fe-d00be2921a42",
                    system_prompt: aiPrompt,
                    voice: "Telnyx.KokoroTTS.af_bella",
                    // IMPORTANT: OpenAI keys are often required unless you use Telnyx hosted models
                    openai_api_key: process.env.OPENAI_API_KEY,
                    // FORCE the AI to speak first
                    greeting: "Hello! I am your AI assistant. How can I help you today?",
                },
                transcription: {
                    language: "en"
                }
            }),
        });

        if (!aiResponse.ok) {
            const errorBody = await aiResponse.json();
            console.error("CRITICAL: AI Failed to Start!", JSON.stringify(errorBody, null, 2));
        } else {
            const successBody = await aiResponse.json();
            console.log("SUCCESS: AI Started. Telnyx Response:", JSON.stringify(successBody, null, 2));
        }
    }

    // 3. Listen for when the call ends to get the summary
    if (event.event_type === 'call.conversation.ended') {
        console.log("Transcript:", event.payload.transcript);
        // TODO: Save transcript/summary to your database here
    }

    return NextResponse.json({ received: true });
}