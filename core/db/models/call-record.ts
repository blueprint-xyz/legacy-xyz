import mongoose, { Schema, Model, Types } from "mongoose";

export interface TranscriptEntry {
    role: "user" | "assistant";
    text: string;
    timestamp: Date;
}

export interface CallRecordDocument {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    callControlId: string;          // Telnyx call identifier
    phone: string;                   // User's phone number
    startedAt?: Date;                // When call was answered
    endedAt?: Date;                  // When call ended
    durationSeconds?: number;        // Call duration
    transcript: TranscriptEntry[];   // Real-time transcript entries
    summary?: string;                // AI-generated summary
    recordingUrl?: string;           // MP3 recording URL
    status: "initiated" | "in_progress" | "completed" | "failed";
    createdAt: Date;
    updatedAt: Date;
}

const TranscriptEntrySchema = new Schema<TranscriptEntry>(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const CallRecordSchema: Schema = new Schema<CallRecordDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        callControlId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        phone: {
            type: String,
            required: true,
        },
        startedAt: {
            type: Date,
        },
        endedAt: {
            type: Date,
        },
        durationSeconds: {
            type: Number,
        },
        transcript: {
            type: [TranscriptEntrySchema],
            default: [],
        },
        summary: {
            type: String,
        },
        recordingUrl: {
            type: String,
        },
        status: {
            type: String,
            enum: ["initiated", "in_progress", "completed", "failed"],
            default: "initiated",
        },
    },
    {
        collection: "call_records",
        timestamps: true,
    }
);

export const CallRecord: Model<CallRecordDocument> =
    mongoose.models.CallRecord ||
    mongoose.model<CallRecordDocument>("CallRecord", CallRecordSchema);

export default CallRecord;