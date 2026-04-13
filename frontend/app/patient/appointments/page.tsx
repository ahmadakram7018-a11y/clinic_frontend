"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SkeletonList } from "@/components/ui/Skeleton";
import { usePatientAppointments } from "@/hooks/use-patient";

interface Appointment {
  id: string;
  appointment_time: string;
  status: "pending" | "confirmed" | "cancelled";
  payment_status: "unpaid" | "paid";
  service?: { name: string };
  doctor?: { name: string };
}

export default function AppointmentsPage() {
  const { data: appointments = [], isLoading } = usePatientAppointments();
  const [filter, setFilter] = useState<string>("all");

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-status-success/10 text-status-success";
      case "pending":
        return "bg-status-warning/10 text-status-warning";
      case "cancelled":
        return "bg-status-danger/10 text-status-danger";
      default:
        return "bg-border text-text-muted";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div>
          <div className="h-9 w-64 bg-border rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-96 bg-border rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-border rounded-lg animate-pulse" />
          ))}
        </div>
        <SkeletonList count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-text-muted mt-1">
            View and manage your upcoming appointments
          </p>
        </div>
        <Button>Book New Appointment</Button>
      </div>

      <div className="flex gap-2">
        {["all", "confirmed", "pending", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? "bg-primary text-white"
                : "bg-white border border-border text-text-muted hover:border-primary/50"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-text-muted mb-4" />
            <p className="text-text-muted">No appointments found</p>
            <Button className="mt-4">Book Your First Appointment</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border">
                      <Calendar className="text-text-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        {apt.service?.name || "Service"}
                      </p>
                      <p className="text-xs text-text-muted">
                        {new Date(apt.appointment_time).toLocaleString()} &bull;{" "}
                        {apt.doctor?.name || "Doctor TBD"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusColor(
                        apt.status
                      )}`}
                    >
                      {apt.status}
                    </span>
                    <Button variant="ghost" size="sm" className="p-2 h-auto">
                      <ExternalLink className="w-4 h-4 text-text-muted" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
