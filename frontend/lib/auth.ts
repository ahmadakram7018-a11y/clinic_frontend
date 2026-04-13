import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string;
  role: "patient" | "doctor" | "admin";
  type: "access" | "refresh";
  exp: number;
  iat: number;
}

/**
 * Get the decoded access token from the server-side cookie.
 * Returns null if no token or if it's expired.
 */
export async function getServerSession(): Promise<DecodedToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Check expiration
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Check if the user has a specific role.
 */
export async function hasRole(role: DecodedToken["role"]): Promise<boolean> {
  const session = await getServerSession();
  return session?.role === role;
}

/**
 * Check if the user is authenticated (has a valid session).
 */
export async function isAuthenticated(): Promise<boolean> {
  return (await getServerSession()) !== null;
}

/**
 * Role-based redirect helper.
 * If user is not authenticated or doesn't have the required role, redirect to login.
 */
export async function requireRole(
  requiredRole: DecodedToken["role"],
  redirectTo: string = "/auth/login"
): Promise<DecodedToken> {
  const session = await getServerSession();

  if (!session || session.role !== requiredRole) {
    const { redirect } = await import("next/navigation");
    redirect(redirectTo);
  }

  // After the redirect check, session is guaranteed to be non-null
  return session as DecodedToken;
}
