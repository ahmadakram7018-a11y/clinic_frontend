"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// Types
interface AdminDashboardData {
  stats: {
    total_patients: number;
    active_doctors: number;
    monthly_appointments: number;
    today_appointments: number;
    total_appointments: number;
    monthly_revenue: number;
    pending_collection_amount: number;
    pending_verifications: number;
    new_patients_this_month: number;
    allowments: number;
    services: number;
  };
  recent_patients: Array<{
    id: string;
    email: string;
    created_at: string;
    patient_profile?: {
      full_name?: string;
      phone?: string;
    };
  }>;
  recent_doctors: Array<{
    id: string;
    email: string;
    created_at: string;
    doctor_profile?: {
      name?: string;
      specialization?: string;
      experience_years?: number;
    };
  }>;
  pending_payment_verifications: Array<{
    id: string;
    amount: number;
    payment_requested_at?: string;
    patient?: {
      full_name?: string;
      email: string;
    };
    appointment?: {
      service?: {
        name: string;
      };
    };
  }>;
}

// Query keys
export const adminKeys = {
  dashboard: () => ["admin", "dashboard"] as const,
  patients: () => ["admin", "patients"] as const,
  doctors: () => ["admin", "doctors"] as const,
  services: () => ["admin", "services"] as const,
  verifications: () => ["admin", "verifications"] as const,
};

// Hooks
export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: async () => {
      const response = await apiClient.get("/admin/dashboard");
      return response.data.data as AdminDashboardData;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (billId: string) => {
      const response = await apiClient.post(`/admin/payments/${billId}/verify`);
      return response.data;
    },
    onMutate: async (billId) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.dashboard() });
      const previousDashboard = queryClient.getQueryData<AdminDashboardData>(adminKeys.dashboard());

      if (previousDashboard) {
        // Remove the verified payment from pending list
        queryClient.setQueryData(adminKeys.dashboard(), (old: AdminDashboardData | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pending_payment_verifications: old.pending_payment_verifications.filter(
              (p) => p.id !== billId
            ),
            stats: {
              ...old.stats,
              pending_verifications: old.stats.pending_verifications - 1,
            },
          };
        });
      }

      return { previousDashboard };
    },
    onError: (err, variables, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(adminKeys.dashboard(), context.previousDashboard);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}
