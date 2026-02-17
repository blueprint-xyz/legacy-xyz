import mongoose, { Schema, Model, Types } from "mongoose";

export interface QuestionDocument {
    _id: Types.ObjectId;
    phase: number;           // 1-8
    phaseName: string;       // e.g., "Roots & Early Childhood"
    order: number;           // Order within phase
    text: string;            // The question text
    isActive: boolean;       // Admin can toggle off
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema: Schema = new Schema<QuestionDocument>(
    {
        phase: {
            type: Number,
            required: true,
            min: 1,
            max: 8,
            index: true,
        },
        phaseName: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        collection: "questions",
        timestamps: true,
    }
);

// Unique constraint: no duplicate order within a phase
QuestionSchema.index({ phase: 1, order: 1 }, { unique: true });

export const Question: Model<QuestionDocument> =
    mongoose.models.Question ||
    mongoose.model<QuestionDocument>("Question", QuestionSchema);

export default Question;
