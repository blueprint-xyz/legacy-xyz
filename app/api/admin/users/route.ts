import { NextResponse } from "next/server";
import connect from "@/core/db/connect-mongo";
import { User } from "@/core/db/models/user";
import { CallRecord } from "@/core/db/models/call-record";

export async function GET() {
    try {
        await connect();

        // Get all users with basic info
        const users = await User.find(
            { onboardingCompleted: true },
            { password: 0 } // Exclude password
        ).sort({ createdAt: -1 });

        // Get call counts for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const callCount = await CallRecord.countDocuments({ userId: user._id });
                const lastCall = await CallRecord.findOne(
                    { userId: user._id },
                    { startedAt: 1 }
                ).sort({ startedAt: -1 });

                return {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    createdAt: user.createdAt,
                    callCount,
                    lastCallAt: lastCall?.startedAt || null,
                };
            })
        );

        return NextResponse.json({ users: usersWithStats });
    } catch (error) {
        console.error("❌ Failed to fetch users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}