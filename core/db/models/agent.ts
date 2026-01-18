import mongoose, { Schema, Model, Types } from "mongoose";

export interface AgentDocument {
    _id: Types.ObjectId;
    name: string;                    // Agent name for identification
    assistantId: string;             // Telnyx assistant ID
    systemPrompt: string;            // Base AI instructions
    firstTimeGreeting: string;       // Greeting for new callers
    returningGreeting: string;       // Greeting for returning callers
    voice: string;                   // Telnyx voice ID
    summaryLength: "short" | "medium" | "long";
    language: string;                // Transcription/AI language
    isActive: boolean;               // Whether this agent is currently active
    createdAt: Date;
    updatedAt: Date;
}

const AgentSchema: Schema = new Schema<AgentDocument>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        assistantId: {
            type: String,
            required: true,
        },
        systemPrompt: {
            type: String,
            required: true,
        },
        firstTimeGreeting: {
            type: String,
            required: true,
        },
        returningGreeting: {
            type: String,
            required: true,
        },
        voice: {
            type: String,
            required: true,
            default: "Telnyx.KokoroTTS.af_bella",
        },
        summaryLength: {
            type: String,
            enum: ["short", "medium", "long"],
            default: "short",
        },
        language: {
            type: String,
            default: "en",
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: "agents",
        timestamps: true,
    }
);

// Ensure only one agent can be active at a time
AgentSchema.pre("save", async function () {
    if (this.isActive) {
        await mongoose.model("Agent").updateMany(
            { _id: { $ne: this._id } },
            { isActive: false }
        );
    }
});

export const Agent: Model<AgentDocument> =
    mongoose.models.Agent ||
    mongoose.model<AgentDocument>("Agent", AgentSchema);

export default Agent;