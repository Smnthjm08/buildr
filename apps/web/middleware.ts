// TODO res.workspace
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // If visiting auth pages while already logged in
  if (
    sessionCookie &&
    ["/", "/login", "/signup", "/forgot-password"].includes(pathname)
  ) {
    try {
      // Validate token or get workspace info via API
      const res = await fetch(`${request.nextUrl.origin}/api/session`, {
        headers: {
          Cookie: `session=${sessionCookie}`,
        },
      });

      if (res.ok) {
        const { workspaceSlug } = await res.json();
        return NextResponse.redirect(
          new URL(`/${workspaceSlug ?? "default"}/projects`, request.url),
        );
      }
    } catch (err) {
      console.error("Session validation failed:", err);
    }
  }

  // Block protected routes if not logged in
  const protectedPaths =
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/settings") ||
    /^\/[^/]+\/(projects|deployments|settings)/.test(pathname);

  if (protectedPaths && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/onboarding",
    "/settings",
    "/:workspaceSlug/projects/:path*",
    "/:workspaceSlug/deployments/:path*",
    "/:workspaceSlug/settings/:path*",
  ],
};
