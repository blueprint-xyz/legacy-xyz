import { NextResponse } from 'next/server';
import connect from '@/core/db/connect-mongo';
import { User } from '@/core/db/models/user';
import { CallRecord } from '@/core/db/models/call-record';

export async function POST(req: Request) {
    const body = await req.json();
    const event = body.data;

    console.log(`\n🔔 EVENT: ${event.event_type} | ID: ${event.payload.call_control_id?.slice(-4)}`);

    // ---------------------------------------------------------
    // EVENT 1: CALL ANSWERED -> CREATE RECORD & START AI
    // ---------------------------------------------------------
    if (event.event_type === 'call.answered') {
        const callControlId = event.payload.call_control_id;
        const toPhone = event.payload.to;

        // Extract base prompt from custom headers
        const basePrompt = event.payload.custom_headers?.find(
            (h: Record<string, string>) => h.name === "X-AI-Prompt"
        )?.value || "You are a friendly AI assistant helping to capture life stories. Ask thoughtful questions about the user's life, memories, and experiences.";

        let aiPrompt = basePrompt;
        let greeting: string;
        let previousCallsContext = "";

        try {
            await connect();

            // Find user by phone number
            const user = await User.findOne({ phone: toPhone });

            if (user) {
                // Fetch previous completed calls with summaries
                const previousCalls = await CallRecord.find({
                    userId: user._id,
                    status: "completed",
                    summary: { $exists: true, $ne: null }
                })
                .sort({ startedAt: -1 })
                .limit(5)
                .select({ summary: 1, startedAt: 1 });

                if (previousCalls.length > 0) {
                    previousCallsContext = previousCalls
                        .map((call, index) => {
                            const date = call.startedAt
                                ? new Date(call.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : 'Unknown date';
                            return `Call ${index + 1} (${date}): ${call.summary}`;
                        })
                        .join('\n\n');

                    console.log(`📚 Found ${previousCalls.length} previous calls for context`);
                }

                // Create call record for this new call
                await CallRecord.create({
                    userId: user._id,
                    callControlId,
                    phone: toPhone,
                    startedAt: new Date(),
                    status: "in_progress",
                });
                console.log("📝 Call record created for user:", user._id);
            } else {
                console.log("⚠️ No user found for phone:", toPhone);
            }
        } catch (error) {
            console.error("❌ Failed to process call.answered:", error);
        }

        // Build AI prompt and greeting based on whether this is a first-time or returning caller
        if (previousCallsContext) {
            aiPrompt = `${basePrompt}\n\nIMPORTANT CONTEXT FROM PREVIOUS CALLS:\n${previousCallsContext}\n\nUse this context to continue the conversation naturally. You may ask follow-up questions about what was discussed before.`;
            greeting = "Welcome back! It's great to hear from you again. I've been looking forward to continuing your story from where we left off. What would you like to share today?";
        } else {
            greeting = "Hello! It's time for your Legacy interview. I'm here to listen and help you record another chapter of your life story. How are you feeling today?";
            console.log("👋 First-time caller - no previous context");
        }

        // 1. FORCE START RECORDING
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
                    greeting,
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
    // EVENT 2: REAL-TIME TRANSCRIPTION -> SAVE TO DB
    // ---------------------------------------------------------
    if (event.event_type === 'ai_assistant.transcription') {
        const callControlId = event.payload.call_control_id;
        const role = event.payload.role;
        const text = event.payload.text;

        console.log(`🗣️ [${role}]: ${text}`);

        try {
            await connect();

            // Append transcript entry to call record
            await CallRecord.findOneAndUpdate(
                { callControlId },
                {
                    $push: {
                        transcript: {
                            role: role === "agent" ? "assistant" : "user",
                            text,
                            timestamp: new Date(),
                        },
                    },
                }
            );
        } catch (error) {
            console.error("❌ Failed to save transcript:", error);
        }
    }

    // ---------------------------------------------------------
    // EVENT 3: INSIGHTS GENERATED -> SAVE SUMMARY
    // ---------------------------------------------------------
    if (event.event_type === 'call.conversation_insights.generated') {
        const callControlId = event.payload.call_control_id;
        const summary = event.payload.results?.[0]?.result || "No summary available.";

        console.log("\n💎 INSIGHTS GENERATED!");
        console.log("-------------------------------------");
        console.log("📝 SUMMARY:", summary);
        console.log("-------------------------------------\n");

        try {
            await connect();

            // Save summary to call record
            await CallRecord.findOneAndUpdate(
                { callControlId },
                { summary }
            );
            console.log("✅ Summary saved to database");
        } catch (error) {
            console.error("❌ Failed to save summary:", error);
        }
    }

    // ---------------------------------------------------------
    // EVENT 4: RECORDING SAVED -> SAVE AUDIO URL
    // ---------------------------------------------------------
    if (event.event_type === 'call.recording.saved') {
        const callControlId = event.payload.call_control_id;
        const recordingUrl = event.payload.recording_urls?.mp3;
        const durationSeconds = event.payload.duration_seconds;

        console.log("\n🎙️ RECORDING READY!");
        console.log("-------------------------------------");
        console.log("🔗 Audio URL:", recordingUrl);
        console.log("⏱️ Duration:", durationSeconds, "seconds");
        console.log("-------------------------------------\n");

        try {
            await connect();

            // Save recording URL to call record
            await CallRecord.findOneAndUpdate(
                { callControlId },
                {
                    recordingUrl,
                    durationSeconds,
                }
            );
            console.log("✅ Recording URL saved to database");
        } catch (error) {
            console.error("❌ Failed to save recording URL:", error);
        }
    }

    // ---------------------------------------------------------
    // EVENT 5: CALL HANGUP -> MARK CALL COMPLETED
    // ---------------------------------------------------------
    if (event.event_type === 'call.hangup') {
        const callControlId = event.payload.call_control_id;
        const toPhone = event.payload.to;

        console.log("\n📞 CALL ENDED");
        console.log("-------------------------------------");
        console.log("📱 User Phone:", toPhone);

        try {
            await connect();

            // Update call record with end time and status
            const callRecord = await CallRecord.findOneAndUpdate(
                { callControlId },
                {
                    endedAt: new Date(),
                    status: "completed",
                },
                { new: true }
            );

            if (callRecord) {
                console.log("✅ Call record updated - Status: completed");
                console.log("📊 Transcript entries:", callRecord.transcript.length);
            } else {
                console.log("⚠️ No call record found for:", callControlId);
            }

            console.log("-------------------------------------\n");
        } catch (error) {
            console.error("❌ Failed to update call record:", error);
        }
    }

    return NextResponse.json({ received: true });
}