import { NextRequest, NextResponse } from "next/server";
import { flattenError } from "zod";
import connect from "@/core/db/connect-mongo";
import { User } from "@/core/db/models/user";
import { personalInfoSchema } from "@/core/validations/onboarding";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validationResult = personalInfoSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: flattenError(validationResult.error).fieldErrors,
                },
                { status: 400 }
            );
        }

        const { fullName, email, phone } = validationResult.data;

        await connect();

        // Create or update user (allow duplicates for now)
        const user = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    phone,
                    fullName,
                    onboardingCompleted: true,
                },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            message: "Onboarding completed successfully",
            data: {
                userId: user._id,
                fullName: user.fullName,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error("❌ Onboarding error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}