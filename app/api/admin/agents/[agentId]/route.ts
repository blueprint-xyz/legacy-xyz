import { NextRequest, NextResponse } from "next/server";
import connect from "@/core/db/connect-mongo";
import { Agent } from "@/core/db/models/agent";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ agentId: string }> }
) {
    try {
        const { agentId } = await params;

        await connect();

        const agent = await Agent.findById(agentId);
        if (!agent) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ agent });
    } catch (error) {
        console.error("❌ Failed to fetch agent:", error);
        return NextResponse.json(
            { error: "Failed to fetch agent" },
            { status: 500 }
        );
    }
}

// PUT /api/admin/agents/[agentId] - Update agent
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ agentId: string }> }
) {
    try {
        const { agentId } = await params;
        const body = await request.json();

        await connect();

        // If this agent should be active, deactivate all others first
        if (body.isActive) {
            await Agent.updateMany(
                { _id: { $ne: agentId } },
                { isActive: false }
            );
        }

        const agent = await Agent.findByIdAndUpdate(
            agentId,
            body,
            { new: true, runValidators: true }
        );

        if (!agent) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ agent });
    } catch (error) {
        console.error("❌ Failed to update agent:", error);
        return NextResponse.json(
            { error: "Failed to update agent" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/agents/[agentId] - Delete agent
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ agentId: string }> }
) {
    try {
        const { agentId } = await params;

        await connect();

        const agent = await Agent.findByIdAndDelete(agentId);
        if (!agent) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Agent deleted successfully" });
    } catch (error) {
        console.error("❌ Failed to delete agent:", error);
        return NextResponse.json(
            { error: "Failed to delete agent" },
            { status: 500 }
        );
    }
}