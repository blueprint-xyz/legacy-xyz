import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { phone, prompt } = await req.json();

    const response = await fetch('https://api.telnyx.com/v2/calls', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
        },
        body: JSON.stringify({
            to: phone,
            from: "+97223766068",
            connection_id: "2864772420361783121",
            webhook_url: `https://www.legacy-xyz.com/api/webhooks/telnyx`,
            record_channels: "dual",
            // Pass AI prompt - previous call context is fetched in the webhook
            custom_headers: [
                { name: "X-AI-Prompt", value: prompt },
            ],
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Telnyx Error Details:", JSON.stringify(errorData, null, 2));
        return NextResponse.json(errorData, { status: response.status });
    }

    return NextResponse.json(await response.json());
}