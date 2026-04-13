"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface Service {
  id: string;
  name: string;
  fee: number;
  duration: number;
  description: string;
}

interface AppointmentCreate {
  service_id: string;
  appointment_time: string;
}

// Query keys
export const servicesKeys = {
  all: () => ["services"] as const,
};

// Hooks
export function useServices(skip = 0, limit = 20) {
  return useQuery({
    queryKey: servicesKeys.all(),
    queryFn: async () => {
      const response = await apiClient.get(`/patient/services?skip=${skip}&limit=${limit}`);
      return response.data.data as Service[];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - services don't change often
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AppointmentCreate) => {
      const response = await apiClient.post("/patient/appointments", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate related queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["patient"] });
    },
  });
}
