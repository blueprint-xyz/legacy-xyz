import { NextRequest, NextResponse } from "next/server";
import connect from "@/core/db/connect-mongo";
import { Agent } from "@/core/db/models/agent";

export async function GET() {
    try {
        await connect();

        const agents = await Agent.find().sort({ createdAt: -1 });

        return NextResponse.json({ agents });
    } catch (error) {
        console.error("❌ Failed to fetch agents:", error);
        return NextResponse.json(
            { error: "Failed to fetch agents" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        await connect();

        // If this agent should be active, deactivate all others first
        if (body.isActive) {
            await Agent.updateMany({}, { isActive: false });
        }

        const agent = await Agent.create(body);

        return NextResponse.json({ agent }, { status: 201 });
    } catch (error) {
        console.error("❌ Failed to create agent:", error);
        return NextResponse.json(
            { error: "Failed to create agent" },
            { status: 500 }
        );
    }
}