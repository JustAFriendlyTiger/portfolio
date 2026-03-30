import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function applyRateLimit(req: NextRequest): Promise<NextResponse | null> {
  // Only rate-limit POST requests to the NextAuth credentials endpoint
  if (
    req.method !== "POST" ||
    !req.nextUrl.pathname.startsWith("/api/auth/callback/credentials")
  ) {
    return null;
  }

  // Skip in development (no Redis configured)
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }

  const { loginRatelimit } = await import("@/lib/ratelimit");
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await loginRatelimit.limit(ip);

  if (!success) {
    return new NextResponse(
      JSON.stringify({ error: "Too many login attempts. Try again in a minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  return null;
}

export default auth(async (req) => {
  const rateLimitResponse = await applyRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/auth/callback/credentials"],
};
