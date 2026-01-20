import { NextRequest } from "next/server";
import { verifyToken } from "@/core/auth/jwt";
import connect from "@/core/db/connect-mongo";
import { User, UserDocument } from "@/core/db/models/user";

/**
 * Get the authenticated user from request cookies
 * Returns null if not authenticated or token is invalid
 */
export async function getAuthenticatedUser(
    request: NextRequest
): Promise<UserDocument | null> {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    await connect();
    return User.findById(payload.userId);
}