"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// Types
interface DashboardData {
  user: {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    created_at?: string;
  };
  stats: {
    scheduled_appointments: number;
    pending_bills: number;
    total_pending_amount: number;
    total_visits: number;
  };
  upcoming_appointments: Array<{
    id: string;
    service?: { name: string };
    doctor?: { name?: string; specialization?: string };
    appointment_time: string;
    status: string;
  }>;
  recent_bills: Array<{
    id: string;
    amount: number;
    status: string;
    payment_state: string;
    payment_message: string;
    created_at: string;
  }>;
}

interface Appointment {
  id: string;
  appointment_time: string;
  status: "pending" | "confirmed" | "cancelled";
  payment_status: "unpaid" | "paid";
  service?: { name: string };
  doctor?: { name: string };
}

interface Bill {
  id: string;
  amount: number;
  status: "pending" | "paid";
  payment_state: "unpaid" | "pending_verification" | "paid";
  payment_message: string;
  created_at: string;
  appointment?: {
    service?: { name: string };
    appointment_time?: string;
  };
}

// Query keys
export const patientKeys = {
  dashboard: () => ["patient", "dashboard"] as const,
  appointments: () => ["patient", "appointments"] as const,
  bills: () => ["patient", "bills"] as const,
  appointment: (id: string) => ["patient", "appointment", id] as const,
};

// Hooks
export function usePatientDashboard() {
  return useQuery({
    queryKey: patientKeys.dashboard(),
    queryFn: async () => {
      const response = await apiClient.get("/patient/dashboard");
      return response.data.data as DashboardData;
    },
    staleTime: 1000 * 30, // 30 seconds - dashboard data refreshes frequently
  });
}

export function usePatientAppointments() {
  return useQuery({
    queryKey: patientKeys.appointments(),
    queryFn: async () => {
      const response = await apiClient.get("/patient/dashboard");
      const data = response.data.data as DashboardData;
      return (data.appointments || data.upcoming_appointments || []) as Appointment[];
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

export function usePatientBills() {
  return useQuery({
    queryKey: patientKeys.bills(),
    queryFn: async () => {
      const response = await apiClient.get("/patient/bills");
      return response.data.data as Bill[];
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useRequestPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ billId, paymentMethod }: { billId: string; paymentMethod: string }) => {
      const response = await apiClient.post(`/patient/bills/${billId}/pay`, {
        payment_method: paymentMethod,
      });
      return response.data.data as Bill;
    },
    onMutate: async ({ billId }) => {
      // Optimistic update - immediately mark bill as pending
      await queryClient.cancelQueries({ queryKey: patientKeys.bills() });
      const previousBills = queryClient.getQueryData<Bill[]>(patientKeys.bills());

      if (previousBills) {
        queryClient.setQueryData(patientKeys.bills(), (old) =>
          old?.map((bill) =>
            bill.id === billId
              ? { ...bill, payment_state: "pending_verification" as const, payment_message: "Payment is pending." }
              : bill
          )
        );
      }

      return { previousBills };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousBills) {
        queryClient.setQueryData(patientKeys.bills(), context.previousBills);
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: patientKeys.bills() });
    },
  });
}
