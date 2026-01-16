import { NextResponse } from 'next/server';
import connect from '@/core/db/connect-mongo';
import { User } from '@/core/db/models/user';
import { CallRecord } from '@/core/db/models/call-record';

export async function POST(req: Request) {
    const { phone, prompt } = await req.json();

    // Fetch previous call summaries for this user
    let previousCallsContext = "";
    try {
        await connect();

        // Find user by phone
        const user = await User.findOne({ phone });

        if (user) {
            // Get all completed calls with summaries, ordered by date
            const previousCalls = await CallRecord.find({
                userId: user._id,
                status: "completed",
                summary: { $exists: true, $ne: null }
            })
            .sort({ startedAt: -1 })
            .limit(5) // Last 5 calls to avoid too much context
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

                console.log(`📚 Found ${previousCalls.length} previous calls for user`);
            }
        }
    } catch (error) {
        console.error("⚠️ Failed to fetch previous calls:", error);
        // Continue without previous context
    }

    // Build custom headers
    const customHeaders = [
        { name: "X-AI-Prompt", value: prompt },
    ];

    // Only add previous calls header if there's context
    if (previousCallsContext) {
        customHeaders.unshift({ name: "X-Previous-Call", value: previousCallsContext });
    }

    const response = await fetch('https://api.telnyx.com/v2/calls', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
        },
        body: JSON.stringify({
            to: phone,
            from: "+972524835373",
            connection_id: "2864772420361783121",
            webhook_url: `https://www.legacy-xyz.com/api/webhooks/telnyx`,
            record_channels: "dual",
            custom_headers: customHeaders,
        }),
    });

    if (!response.ok) {
        // Parsing the error body is crucial to knowing WHY it failed
        const errorData = await response.json();
        console.error("Telnyx Error Details:", JSON.stringify(errorData, null, 2));
        return NextResponse.json(errorData, { status: response.status });
    }

    return NextResponse.json(await response.json());
}