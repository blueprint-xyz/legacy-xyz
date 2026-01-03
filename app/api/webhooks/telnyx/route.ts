import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
    const body = await req.json();
    const event = body.data;

    console.log(`\n🔔 EVENT: ${event.event_type} | ID: ${event.payload.call_control_id?.slice(-4)}`);

    // 1. START AI (Keep this exactly as it was)
    if (event.event_type === 'call.answered') {
        const callControlId = event.payload.call_control_id;
        const aiPrompt = event.payload.custom_headers?.find((h: Record<string, string>) => h.name === "X-AI-Prompt")?.value || "Helpful assistant";

        // IMPORTANT: Enable "inference" (Insights) so we get the summary at the end
        const aiResponse = await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/ai_assistant_start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
            },
            body: JSON.stringify({
                assistant: {
                    id: "assistant-608374c2-d91a-40c2-a9fe-d00be2921a42",
                    instructions: aiPrompt,
                    voice: "Telnyx.KokoroTTS.af_bella",
                    openai_api_key: process.env.OPENAI_API_KEY,
                    greeting: "Hello! I am your AI assistant. How can I help you today?",
                },
                // Request the summary/transcript to be generated after the call
                inference: {
                    summary_length: "short"
                },
                transcription: { language: "en" }
            }),
        });

        if (aiResponse.ok) console.log("✅ AI Started");
        else console.error("❌ AI Start Failed", await aiResponse.text());
    }

    // 2. [NEW] CAPTURE THE FULL SUMMARY/TRANSCRIPT
    // This event fires 10-20 seconds AFTER the call ends.
    if (event.event_type === 'call.conversation_insights.generated') {
        const payload = event.payload;

        console.log("\n💎 GEM DETECTED: Insights Generated!");
        console.log("-------------------------------------");

        // Print the automated summary
        console.log("📝 SUMMARY:", payload.summary);

        // Print the full transcript (if available in payload)
        // Note: Sometimes it's inside 'transcription' or 'prose' depending on API version
        console.log("📜 FULL TRANSCRIPT JSON:", JSON.stringify(payload.transcription || payload.prose, null, 2));

        console.log("-------------------------------------\n");
    }

    // (Optional) You can keep the real-time logger for debugging if you fix the portal settings
    if (event.event_type === 'ai_assistant.transcription') {
        console.log(`🗣️ [${event.payload.role}]: ${event.payload.text}`);
    }

    return NextResponse.json({ received: true });
}