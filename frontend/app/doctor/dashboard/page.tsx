"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";

interface Appointment {
  id: string;
  appointment_time: string;
  status: "pending" | "confirmed" | "cancelled";
  patient?: { email: string };
  service?: { name: string };
}

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await apiClient.get("/doctor/dashboard");
        if (response.data?.data) {
          setAppointments(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointment_time);
    const today = new Date();
    return (
      aptDate.toDateString() === today.toDateString() && apt.status !== "cancelled"
    );
  });

  const weekAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointment_time);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return aptDate >= now && aptDate <= weekFromNow && apt.status !== "cancelled";
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-border rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-border rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
        <p className="text-text-muted mt-1">
          Overview of your appointments and schedule
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Today</p>
              <p className="text-2xl font-bold">{todayAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-text-muted">This Week</p>
              <p className="text-2xl font-bold">{weekAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-status-success/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-status-success" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Total</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-text-muted mb-4" />
              <p className="text-text-muted">No appointments today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((apt) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-border">
                        <Users className="text-text-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          {apt.patient?.email || "Patient"}
                        </p>
                        <p className="text-xs text-text-muted">
                          {apt.service?.name || "Service"} &bull;{" "}
                          {new Date(apt.appointment_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        apt.status === "confirmed"
                          ? "bg-status-success/10 text-status-success"
                          : "bg-status-warning/10 text-status-warning"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
