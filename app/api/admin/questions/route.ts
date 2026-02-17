import { NextRequest, NextResponse } from "next/server";
import connect from "@/core/db/connect-mongo";
import { Question } from "@/core/db/models/question";

export async function GET() {
    try {
        await connect();

        const questions = await Question.find().sort({ phase: 1, order: 1 });

        return NextResponse.json({ questions });
    } catch (error) {
        console.error("❌ Failed to fetch questions:", error);
        return NextResponse.json(
            { error: "Failed to fetch questions" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        await connect();

        const question = await Question.create(body);

        return NextResponse.json({ question }, { status: 201 });
    } catch (error) {
        console.error("❌ Failed to create question:", error);
        return NextResponse.json(
            { error: "Failed to create question" },
            { status: 500 }
        );
    }
}
