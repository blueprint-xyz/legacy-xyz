import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis using environment variables automatically
// (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN)
const redis = Redis.fromEnv();

export async function POST(req: Request) {
    const body = await req.json();
    const event = body.data;

    // Log the event type for debugging
    console.log(`\n🔔 EVENT: ${event.event_type} | Call ID: ${event.payload.call_control_id?.slice(-4)}`);

    // ---------------------------------------------------------
    // EVENT A: CALL ANSWERED -> START AI
    // ---------------------------------------------------------
    if (event.event_type === 'call.answered') {
        const callControlId = event.payload.call_control_id;

        // 1. Get the prompt from headers
        const aiPrompt = event.payload.custom_headers?.find((h: Record<string, string>) => h.name === "X-AI-Prompt")?.value
            || "You are a helpful assistant.";

        // 2. Clear any existing data for this call ID in Redis (Clean Slate)
        // We use the callControlId as the Key in Redis
        await redis.del(callControlId);

        console.log(`🚀 STARTING AI...`);

        // 3. Start the AI Agent
        const aiResponse = await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/ai_assistant_start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
            },
            body: JSON.stringify({
                assistant: {
                    id: "assistant-608374c2-d91a-40c2-a9fe-d00be2921a42", // Your Assistant ID
                    // Use 'instructions' to override the system prompt dynamically
                    instructions: aiPrompt,
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
    // EVENT B: TRANSCRIPTION -> SAVE TO UPSTASH REDIS
    // ---------------------------------------------------------
    if (event.event_type === 'ai_assistant.transcription') {
        const { call_control_id, text, role } = event.payload;

        console.log(`🗣️  [${role.toUpperCase()}]: "${text}"`);

        // RPUSH appends the new text to the end of the list stored at 'call_control_id'
        // This is an async operation to the cloud database
        await redis.rpush(call_control_id, `${role}: ${text}`);

        // Optional: Set the key to expire in 24 hours so your DB doesn't fill up forever
        await redis.expire(call_control_id, 86400);
    }

    // ---------------------------------------------------------
    // EVENT C: CALL ENDED -> FETCH FROM UPSTASH REDIS
    // ---------------------------------------------------------
    if (event.event_type === 'call.hangup' || event.event_type === 'call.conversation.ended') {
        const callControlId = event.payload.call_control_id;

        console.log("\n🛑 CALL ENDED. FETCHING TRANSCRIPT FROM REDIS...");
        console.log("--------------------------------");

        // LRANGE fetches the whole list from index 0 to -1 (the end)
        const transcriptList = await redis.lrange(callControlId, 0, -1);

        const fullLog = transcriptList.join('\n');

        if (fullLog) {
            console.log("📜 FULL TRANSCRIPT:");
            console.log(fullLog);

            // TODO: Here is where you would save `fullLog` to your main database (Postgres/Mongo)
        } else {
            console.log("⚠️ No transcript found in Redis.");
        }

        console.log("--------------------------------\n");

        // Cleanup: Remove the temporary key from Redis
        await redis.del(callControlId);
    }

    return NextResponse.json({ received: true });
}