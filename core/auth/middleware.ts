import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";

// Public paths that don't require authentication on admin subdomain
const PUBLIC_ADMIN_PATHS = ["/login"];

/**
 * Check if the given pathname is a public route that doesn't require auth
 */
export function isPublicPath(pathname: string): boolean {
    return PUBLIC_ADMIN_PATHS.some((path) => pathname === path);
}

/**
 * Verify the auth token from request cookies
 * Returns the payload if valid, null otherwise
 */
export async function verifyRequestAuth(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return null;
    }

    return verifyToken(token);
}

/**
 * Create a redirect response to the login page
 * Optionally clears the invalid token cookie
 */
export function redirectToLogin(req: NextRequest, clearToken = false): NextResponse {
    const response = NextResponse.redirect(new URL("/login", req.url));

    if (clearToken) {
        response.cookies.delete("token");
    }

    return response;
}