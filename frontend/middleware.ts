import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which paths require which roles
const ROLE_PROTECTED_PATHS: Record<string, string[]> = {
  patient: ["/patient"],
  doctor: ["/doctor"],
  admin: ["/admin"],
};

// Public paths that logged-in users should be redirected away from
const AUTH_PATHS = ["/auth/login", "/auth/register"];

/**
 * Middleware to protect routes based on authentication and role.
 * - Redirects unauthenticated users to /auth/login
 * - Redirects users to their appropriate dashboard if they try to access another role's paths
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Check if the path is an auth path
  const isAuthPath = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If no tokens and trying to access auth pages, allow
  if (isAuthPath && !accessToken) {
    return NextResponse.next();
  }

  // If no tokens and trying to access protected route, redirect to login
  const isProtectedPath = Object.values(ROLE_PROTECTED_PATHS).some((paths) =>
    paths.some((path) => pathname.startsWith(path))
  );

  if (!accessToken && isProtectedPath) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode token to get role (if available)
  if (accessToken) {
    try {
      // JWT structure: header.payload.signature
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const role: string = payload.role;
      const exp: number = payload.exp;

      // Check if token is expired
      if (exp * 1000 < Date.now()) {
        // Token expired, clear cookies and redirect to login
        const response = NextResponse.redirect(
          new URL("/auth/login", request.url)
        );
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }

      // If user is trying to access a role-specific path
      for (const [requiredRole, paths] of Object.entries(ROLE_PROTECTED_PATHS)) {
        if (paths.some((path) => pathname.startsWith(path))) {
          // User doesn't have the required role
          if (role !== requiredRole) {
            // Redirect to their own dashboard
            const dashboardUrl = new URL(
              `/${role}/dashboard`,
              request.url
            );
            return NextResponse.redirect(dashboardUrl);
          }
        }
      }

      // If authenticated user tries to access auth pages, redirect to their dashboard
      if (isAuthPath) {
        const dashboardUrl = new URL(`/${role}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    } catch {
      // Invalid token, redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Run middleware on specific paths only
export const config = {
  matcher: [
    "/auth/:path*",
    "/patient/:path*",
    "/doctor/:path*",
    "/admin/:path*",
  ],
};
