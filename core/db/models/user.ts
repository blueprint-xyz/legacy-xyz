import mongoose, { Schema, Model } from "mongoose";

export interface UserDocument {
    _id: mongoose.Types.ObjectId;
    email: string;
    password?: string;
    phone?: string;
    fullName?: string;
    onboardingCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<UserDocument>(
    {
        email: { type: String, required: true },
        password: { type: String },
        phone: { type: String, sparse: true },
        fullName: { type: String },
        onboardingCompleted: { type: Boolean, default: false },
    },
    {
        collection: "users",
        timestamps: true,
    }
);

export const User: Model<UserDocument> =
    mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
