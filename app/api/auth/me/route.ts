import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/core/auth/jwt";
import connect from "@/core/db/connect-mongo";
import User from "@/core/db/models/user";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        await connect();
        const user = await User.findById(payload.userId).select("-password");

        if (!user) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                onboardingCompleted: user.onboardingCompleted,
                isAdmin: user.isAdmin || false,
            },
        });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { authenticated: false },
            { status: 500 }
        );
    }
}