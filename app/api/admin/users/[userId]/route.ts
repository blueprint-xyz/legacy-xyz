import { NextRequest, NextResponse } from "next/server";
import connect from "@/core/db/connect-mongo";
import { User } from "@/core/db/models/user";
import { CallRecord } from "@/core/db/models/call-record";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        await connect();

        // Get user details
        const user = await User.findById(userId, { password: 0 });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get all call records for this user
        const callRecords = await CallRecord.find({ userId })
            .sort({ startedAt: -1 })
            .select({
                _id: 1,
                startedAt: 1,
                endedAt: 1,
                durationSeconds: 1,
                summary: 1,
                fullTranscript: 1,
                recordingUrl: 1,
                status: 1,
            });

        return NextResponse.json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                createdAt: user.createdAt,
            },
            callRecords,
        });
    } catch (error) {
        console.error("❌ Failed to fetch user details:", error);
        return NextResponse.json(
            { error: "Failed to fetch user details" },
            { status: 500 }
        );
    }
}