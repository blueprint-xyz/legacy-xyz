import mongoose, { Schema, Model } from "mongoose";

interface UserDocument {
    email: string;
    password: string;
    phone?: string;
}

const UserSchema: Schema = new Schema<UserDocument>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, unique: true, sparse: true },
    },
    { collection: "users" }
);

export const User: Model<UserDocument> =
    mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
