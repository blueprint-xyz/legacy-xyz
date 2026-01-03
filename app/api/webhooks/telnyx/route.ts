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

    // ---------------------------------------------------------
    // EVENT 1: CALL ANSWERED -> START AI
    // ---------------------------------------------------------
    if (event.event_type === 'call.answered') {
        const callControlId = event.payload.call_control_id;
        const aiPrompt = event.payload.custom_headers?.find((h: Record<string, string>) => h.name === "X-AI-Prompt")?.value || "Helpful assistant";

        // 1. FORCE START RECORDING (This fixes your problem) 🔴
        // We explicitly tell the API: "Start recording NOW"
        await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/record_start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
            },
            body: JSON.stringify({
                format: "mp3",
                channels: "dual"
            }),
        });
        console.log("🔴 Command Sent: Start Recording");

        // 2. Start the AI Agent
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
                inference: {
                    features: ["summary", "transcription"],
                    summary_length: "short"
                },
                transcription: { language: "en" }
            }),
        });

        if (aiResponse.ok) console.log("✅ AI Started");
        else console.error("❌ AI Start Failed", await aiResponse.text());
    }

    // ---------------------------------------------------------
    // EVENT 2: INSIGHTS GENERATED (Summary)
    // ---------------------------------------------------------
    if (event.event_type === 'call.conversation_insights.generated') {
        const summary = event.payload.results?.[0]?.result || "No summary available.";

        console.log("\n💎 GEM DETECTED: Insights Generated!");
        console.log("-------------------------------------");
        console.log("📝 SUMMARY:", summary);
        // Uncomment below to see raw data if needed
        // console.log(JSON.stringify(event.payload, null, 2));
        console.log("-------------------------------------\n");
    }

    // ---------------------------------------------------------
    // EVENT 3: REAL-TIME TRANSCRIPTION LOGS
    // ---------------------------------------------------------
    if (event.event_type === 'ai_assistant.transcription') {
        console.log(`🗣️ [${event.payload.role}]: ${event.payload.text}`);
    }

    // ---------------------------------------------------------
    // EVENT 4: RECORDING SAVED (Audio File)
    // ---------------------------------------------------------
    if (event.event_type === 'call.recording.saved') {
        const recordingData = event.payload;

        console.log(JSON.stringify(recordingData));
        console.log("\n🎙️ RECORDING READY!");
        console.log("-------------------------------------");
        // This is the link to the MP3 file
        console.log("🔗 Audio URL:", recordingData.recording_urls.mp3);
        console.log("⏱️ Duration:", recordingData.duration_seconds, "seconds");
        console.log("-------------------------------------\n");

        // TODO: Save 'recordingData.recording_urls.mp3' to your database
    }

    return NextResponse.json({ received: true });
}