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
            from: "+972524835373",
            connection_id: "2864772420361783121",
            // This URL handles the call logic (see next file)
            // webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/telnyx`,
            webhook_url: `https://www.legacy-xyz.com/api/webhooks/telnyx`,
            // We pass the AI prompt as custom metadata to use later
            custom_headers: [
                { name: "X-AI-Prompt", value: prompt }
            ]
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