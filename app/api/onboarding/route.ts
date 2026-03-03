import { NextRequest, NextResponse } from "next/server";
import { flattenError } from "zod";
import { personalInfoSchema, onboardingSchema } from "@/core/validations/onboarding";
import { getAuthenticatedUser } from "@/core/services/user";

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate input
        const validationResult = onboardingSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: flattenError(validationResult.error).fieldErrors,
                },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Update user with onboarding data
        user.fullName = data.fullName;
        user.preferredName = data.preferredName || data.fullName.split(" ")[0];
        user.phone = data.phone;
        user.agentName = data.agentName;
        user.dateOfBirth = new Date(data.dateOfBirth);
        user.birthplace = data.birthplace;
        user.lifeChapters = data.lifeChapters;
        user.conversationalVibe = data.conversationalVibe;
        user.preferredTimezone = data.preferredTimezone;
        user.preferredDay = data.preferredDay;
        user.preferredTime = data.preferredTime;
        user.isGift = data.isGift;
        user.onboardingCompleted = true;
        await user.save();

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

export async function PUT(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

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

        const { fullName, phone } = validationResult.data;

        // Update user info
        user.fullName = fullName;
        user.phone = phone;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            data: {
                userId: user._id,
                fullName: user.fullName,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error("❌ Profile update error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}