"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

interface UserSession {
  role: "patient" | "doctor" | "admin";
}

interface UseAuthReturn {
  user: UserSession | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Client-side hook to manage authentication state.
 * Reads role from a data attribute set by layouts or from a session endpoint.
 */
export function useAuth(expectedRole?: "patient" | "doctor" | "admin"): UseAuthReturn {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      // Try to fetch a protected endpoint to verify the token
      const roleEndpoint = expectedRole
        ? `/${expectedRole}/dashboard`
        : "/auth/refresh"; // Use refresh endpoint as fallback

      // Use a HEAD or GET request with credentials to check if cookies are valid
      const response = await apiClient.get(roleEndpoint, {
        validateStatus: (status) => status < 500, // Don't throw on 401/403
      });

      if (response.status === 200 && response.data?.data) {
        // If we got a successful response, user is authenticated
        // Extract role from the response (this is a simplification)
        setUser({ role: expectedRole || "patient" });
      } else if (response.status === 401 || response.status === 403) {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [expectedRole]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Even if logout fails on server, clear client state
    } finally {
      setUser(null);
      router.push("/auth/login");
    }
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/refresh");
      await checkAuth();
    } catch {
      setUser(null);
      router.push("/auth/login");
    }
  };

  return { user, isLoading, logout, refreshSession };
}
