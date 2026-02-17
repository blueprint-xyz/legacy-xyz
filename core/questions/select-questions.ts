import { CallRecord } from "@/core/db/models/call-record";
import { Question, QuestionDocument } from "@/core/db/models/question";
import { Types } from "mongoose";

const QUESTIONS_PER_CALL = 8;

export async function getUnansweredQuestions(
    userId: Types.ObjectId,
    limit: number = QUESTIONS_PER_CALL
): Promise<{ questions: QuestionDocument[]; allExhausted: boolean }> {
    // Aggregate all question IDs already sent across all calls for this user
    const askedResult = await CallRecord.aggregate([
        { $match: { userId } },
        { $unwind: "$questionsAsked" },
        { $group: { _id: null, askedIds: { $addToSet: "$questionsAsked" } } },
    ]);

    const askedIds: Types.ObjectId[] =
        askedResult.length > 0 ? askedResult[0].askedIds : [];

    // Fetch active questions NOT in the asked set, ordered by phase then order
    const questions = await Question.find({
        _id: { $nin: askedIds },
        isActive: true,
    })
        .sort({ phase: 1, order: 1 })
        .limit(limit);

    if (questions.length === 0) {
        return { questions: [], allExhausted: true };
    }

    return { questions, allExhausted: false };
}

export function formatQuestionsForPrompt(
    questions: QuestionDocument[],
    allExhausted: boolean
): string {
    if (allExhausted || questions.length === 0) {
        return "";
    }

    const questionList = questions
        .map((q, i) => `${i + 1}. [${q.phaseName}] ${q.text}`)
        .join("\n");

    return (
        `\n\nQUESTIONS FOR THIS CALL SESSION:\n` +
        `Ask these questions naturally during the conversation. ` +
        `Weave them in conversationally — don't read them like a list. ` +
        `Follow up on interesting answers before moving to the next question. ` +
        `Try to cover as many as possible within the call duration:\n${questionList}`
    );
}
