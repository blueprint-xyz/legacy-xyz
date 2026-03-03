import mongoose, { Schema, Model } from "mongoose";

export interface UserDocument {
    _id: mongoose.Types.ObjectId;
    email: string;
    password?: string;
    phone?: string;
    fullName?: string;
    preferredName?: string;
    agentName?: string;
    dateOfBirth?: Date;
    birthplace?: string;
    lifeChapters?: number[];
    conversationalVibe?: 'reflective' | 'casual' | 'direct';
    preferredTimezone?: string;
    preferredDay?: string;
    preferredTime?: string;
    isGift?: boolean;
    onboardingCompleted: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<UserDocument>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String },
        phone: { type: String },
        fullName: { type: String },
        preferredName: { type: String },
        agentName: { type: String },
        dateOfBirth: { type: Date },
        birthplace: { type: String },
        lifeChapters: { type: [Number] },
        conversationalVibe: { type: String, enum: ['reflective', 'casual', 'direct'] },
        preferredTimezone: { type: String },
        preferredDay: { type: String },
        preferredTime: { type: String },
        isGift: { type: Boolean, default: false },
        onboardingCompleted: { type: Boolean, default: false },
        isAdmin: { type: Boolean, default: false },
    },
    {
        collection: "users",
        timestamps: true,
    }
);

export const User: Model<UserDocument> =
    mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
