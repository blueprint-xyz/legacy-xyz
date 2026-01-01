// /core/db/connect-mongo.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable.");
}

// Use a global cache to persist connection across hot reloads in dev
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGO_URI, {
                maxPoolSize: 120,
                bufferCommands: false,
                serverSelectionTimeoutMS: 120000,
            })
            .then((mongoose) => {
                console.log("✅ Connected to MongoDB");
                return mongoose;
            })
            .catch((err) => {
                console.error("❌ MongoDB connection error:", err);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connect;
