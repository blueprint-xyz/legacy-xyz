import { NextResponse } from 'next/server';
import connect from '@/core/db/connect-mongo';
import { User } from '@/core/db/models/user';
import { CallRecord } from '@/core/db/models/call-record';
import { Agent } from '@/core/db/models/agent';

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

        let previousCallsContext = "";
        let agent = null;

        try {
            await connect();

            // Fetch the active agent configuration
            agent = await Agent.findOne({ isActive: true });
            if (!agent) {
                console.error("❌ No active agent found in database!");
                return NextResponse.json({ error: "No active agent configured" }, { status: 500 });
            }
            console.log(`🤖 Using agent: ${agent.name}`);

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
            return NextResponse.json({ error: "Failed to process call" }, { status: 500 });
        }

        // Build AI prompt and greeting based on agent config and caller history
        let aiPrompt = agent.systemPrompt;
        let greeting: string;

        if (previousCallsContext) {
            aiPrompt = `${agent.systemPrompt}\n\nIMPORTANT CONTEXT FROM PREVIOUS CALLS:\n${previousCallsContext}\n\nUse this context to continue the conversation naturally. You may ask follow-up questions about what was discussed before.`;
            greeting = agent.returningGreeting;
        } else {
            greeting = agent.firstTimeGreeting;
            console.log("👋 First-time caller - no previous context");
        }

        // 1. FORCE START RECORDING (with transcription enabled)
        await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/record_start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
            },
            body: JSON.stringify({
                format: "mp3",
                channels: "dual",
                transcription: true,
            }),
        });
        console.log("🔴 Command Sent: Start Recording (with transcription)");

        // 2. Start the AI Agent with config from database
        const aiResponse = await fetch(`https://api.telnyx.com/v2/calls/${callControlId}/actions/ai_assistant_start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
            },
            body: JSON.stringify({
                assistant: {
                    id: agent.assistantId,
                    instructions: aiPrompt,
                    voice: agent.voice,
                    openai_api_key: process.env.OPENAI_API_KEY,
                    greeting,
                },
                inference: {
                    features: ["summary", "transcription"],
                    summary_length: agent.summaryLength,
                },
                transcription: { language: agent.language }
            }),
        });

        if (aiResponse.ok) console.log("✅ AI Started");
        else console.error("❌ AI Start Failed", await aiResponse.text());
    }

    // ---------------------------------------------------------
    // EVENT 2: RECORDING TRANSCRIPTION SAVED (full transcript)
    // ---------------------------------------------------------
    if (event.event_type === 'call.recording.transcription.saved') {
        const callControlId = event.payload.call_control_id;
        const transcriptionText = event.payload.transcription_text;

        console.log("\n📜 FULL TRANSCRIPTION RECEIVED!");
        console.log("-------------------------------------");
        console.log(transcriptionText?.substring(0, 500) + "...");
        console.log("-------------------------------------\n");

        try {
            await connect();

            // Save the full transcription text to a new field
            await CallRecord.findOneAndUpdate(
                { callControlId },
                { fullTranscript: transcriptionText }
            );
            console.log("✅ Full transcript saved to database");
        } catch (error) {
            console.error("❌ Failed to save full transcript:", error);
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