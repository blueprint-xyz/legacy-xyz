import { NextResponse } from 'next/server';

// ⚠️ GLOBAL VARIABLE: In production (Vercel/AWS), this empties on every request.
// But locally on your computer, this often stays alive long enough to debug a single call.
const debugTranscripts: Record<string, string[]> = {};

export async function POST(req: Request) {
    const body = await req.json();
    const event = body.data;

    // 🔍 1. LOG EVERY EVENT TYPE (So you know the webhook is hitting you)
    console.log(`\n🔔 EVENT: ${event.event_type} | Call ID: ${event.payload.call_control_id?.slice(-4)}`);

    // ---------------------------------------------------------
    // EVENT A: CALL ANSWERED -> START AI
    // ---------------------------------------------------------
    if (event.event_type === 'call.answered') {
        const callControlId: string = event.payload.call_control_id;
        const aiPrompt = event.payload.custom_headers?.find((h: Record<string, string>) => h.name === "X-AI-Prompt")?.value || "Helpful assistant";

        // Reset transcript storage for this new call
        debugTranscripts[callControlId] = [];

        console.log(`🚀 STARTING AI... (Prompt: "${aiPrompt.substring(0, 20)}...")`);

        const aiResponse = await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/ai_assistant_start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
            },
            body: JSON.stringify({
                assistant: {
                    id: "assistant-608374c2-d91a-40c2-a9fe-d00be2921a42", // Your ID
                    system_prompt: aiPrompt,
                    voice: "Telnyx.KokoroTTS.af_bella",
                    openai_api_key: process.env.OPENAI_API_KEY,
                    greeting: "Hello! I am your AI assistant. How can I help you today?",
                },
                transcription: { language: "en" }
            }),
        });

        if (!aiResponse.ok) {
            console.error("❌ START FAILED:", await aiResponse.text());
        } else {
            console.log("✅ AI STARTED.");
        }
    }

    // ---------------------------------------------------------
    // EVENT B: TRANSCRIPTION (The most important part for you!)
    // ---------------------------------------------------------
    if (event.event_type === 'ai_assistant.transcription') {
        const { call_control_id, text, role } = event.payload;

        // 1. Log immediately to console (This proves it works!)
        console.log(`🗣️  [${role.toUpperCase()}]: "${text}"`);

        // 2. Try to save it to memory
        if (debugTranscripts[call_control_id]) {
            debugTranscripts[call_control_id].push(`${role}: ${text}`);
        }
    }

    // ---------------------------------------------------------
    // EVENT C: CALL ENDED -> DUMP EVERYTHING
    // ---------------------------------------------------------
    if (event.event_type === 'call.hangup' || event.event_type === 'call.conversation.ended') {
        const callControlId = event.payload.call_control_id;

        console.log("\n🛑 CALL ENDED. DUMPING MEMORY:");
        console.log("--------------------------------");

        const fullLog = debugTranscripts[callControlId]?.join('\n');

        if (fullLog) {
            console.log(fullLog);
        } else {
            console.log("⚠️ Full transcript memory was empty (Expected if server restarted).");
            console.log("⚠️ CHECK THE '🗣️' LOGS ABOVE - If you saw those, it worked!");
        }

        console.log("--------------------------------\n");

        // Cleanup
        delete debugTranscripts[callControlId];
    }

    return NextResponse.json({ received: true });
}