import { NextRequest, NextResponse } from "next/server";
import connect from "@/core/db/connect-mongo";
import { Question } from "@/core/db/models/question";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ questionId: string }> }
) {
    try {
        const { questionId } = await params;

        await connect();

        const question = await Question.findById(questionId);
        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ question });
    } catch (error) {
        console.error("❌ Failed to fetch question:", error);
        return NextResponse.json(
            { error: "Failed to fetch question" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ questionId: string }> }
) {
    try {
        const { questionId } = await params;
        const body = await request.json();

        await connect();

        const question = await Question.findByIdAndUpdate(
            questionId,
            body,
            { new: true, runValidators: true }
        );

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ question });
    } catch (error) {
        console.error("❌ Failed to update question:", error);
        return NextResponse.json(
            { error: "Failed to update question" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ questionId: string }> }
) {
    try {
        const { questionId } = await params;

        await connect();

        const question = await Question.findByIdAndDelete(questionId);
        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("❌ Failed to delete question:", error);
        return NextResponse.json(
            { error: "Failed to delete question" },
            { status: 500 }
        );
    }
}
