import { NextRequest, NextResponse } from "next/server";

// Root domain configuration
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "blueprint-xyz.com";

/**
 * Extract subdomain from the request hostname
 * Handles:
 * - Production: admin.blueprint-xyz.com
 * - Development: admin.localhost:3000
 * - Vercel preview: admin---branch.vercel.app
 */
function getSubdomain(req: NextRequest): string | null {
  const host = req.headers.get("host") || "";

  // Remove port if present
  const hostname = host.split(":")[0];

  // Handle localhost development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return null; // Root domain in development
  }

  // Handle subdomain.localhost (e.g., admin.localhost:3000)
  if (hostname.endsWith(".localhost")) {
    const subdomain = hostname.replace(".localhost", "");
    return subdomain || null;
  }

  // Handle Vercel preview deployments (tenant---branch.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const subdomain = hostname.split("---")[0];
    return subdomain || null;
  }

  // Handle production subdomains
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, "");
    return subdomain || null;
  }

  // No subdomain found (root domain)
  return null;
}

export function proxy(req: NextRequest) {
  const subdomain = getSubdomain(req);
  const pathname = req.nextUrl.pathname;

  // If we're on the admin subdomain, rewrite to /admin routes
  if (subdomain === "admin") {
    // Rewrite the URL to the admin section
    // admin.blueprint-xyz.com/ -> /admin
    // admin.blueprint-xyz.com/dashboard -> /admin/dashboard
    const adminPath = pathname === "/" ? "/admin" : `/admin${pathname}`;

    return NextResponse.rewrite(new URL(adminPath, req.url));
  }

  // For root domain or unknown subdomains, continue normally
  return NextResponse.next();
}

export const config = {
  // Match all paths except static files, api routes, and Next.js internals
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};