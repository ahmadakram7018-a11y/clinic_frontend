"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { patientKeys, adminKeys } from "@/hooks/use-patient";

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  prefetchData?: () => void;
  className?: string;
}

export function PrefetchLink({ href, children, prefetchData, className }: PrefetchLinkProps) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    // Prefetch data when hovering over the link
    if (prefetchData) {
      prefetchData();
    }
  };

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
    >
      {children}
    </Link>
  );
}

// Helper functions to prefetch common queries
export function prefetchPatientData(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.prefetchQuery({
    queryKey: patientKeys.dashboard(),
    queryFn: async () => {
      const { apiClient } = await import("@/lib/api-client");
      const response = await apiClient.get("/patient/dashboard");
      return response.data.data;
    },
  });
}

export function prefetchAdminData(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.prefetchQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: async () => {
      const { apiClient } = await import("@/lib/api-client");
      const response = await apiClient.get("/admin/dashboard");
      return response.data.data;
    },
  });
}
