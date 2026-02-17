import { generateText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { CallRecord } from "@/core/db/models/call-record";
import { Question, QuestionDocument } from "@/core/db/models/question";

/**
 * Analyzes a call transcript to determine which questions from the batch
 * were actually answered by the user. Updates the CallRecord with the results.
 */
export async function analyzeAnsweredQuestions(
    callControlId: string,
    transcript: string
): Promise<void> {
    // Find the call record and its associated questions
    const callRecord = await CallRecord.findOne({ callControlId });
    if (!callRecord || callRecord.questionsAsked.length === 0) {
        console.log("📋 No questions to analyze for this call");
        return;
    }

    // Load the actual question documents
    const questions: QuestionDocument[] = await Question.find({
        _id: { $in: callRecord.questionsAsked },
    });

    if (questions.length === 0) {
        console.log("📋 No matching questions found in database");
        return;
    }

    // Build the question list for the prompt
    const questionList = questions
        .map((q) => `- ID: ${q._id} | Question: "${q.text}"`)
        .join("\n");

    const { output } = await generateText({
        model: anthropic("claude-haiku-4-5"),
        output: Output.object({
            schema: z.object({
                answeredQuestionIds: z
                    .array(z.string())
                    .describe(
                        "Array of question IDs that were meaningfully answered in the transcript"
                    ),
            }),
        }),
        prompt: `You are analyzing a phone interview transcript to determine which questions were actually answered by the caller.

Below is the list of questions that were intended for this call session:
${questionList}

Here is the full transcript of the call:
---
${transcript}
---

For each question, determine if the caller provided a meaningful answer during the conversation. A question counts as "answered" if:
- The caller directly responded to the question with a substantive answer
- The caller naturally covered the topic even if the exact question wasn't asked verbatim
- The caller provided enough information to consider the question addressed

A question should NOT be marked as answered if:
- It was only briefly mentioned without a real response
- The caller deflected or said they'd answer it later
- The topic was never touched upon

Return ONLY the IDs of questions that were meaningfully answered.`,
    });

    if (!output) {
        console.error("❌ AI analysis returned no output");
        return;
    }

    const answeredIds = output.answeredQuestionIds.filter((id) =>
        questions.some((q) => q._id.toString() === id)
    );

    // Update the call record with answered question IDs
    await CallRecord.findOneAndUpdate(
        { callControlId },
        { questionsAnswered: answeredIds }
    );

    console.log(
        `📋 AI analysis: ${answeredIds.length}/${questions.length} questions answered`
    );
}
