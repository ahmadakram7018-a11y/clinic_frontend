"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, CreditCard, Clock, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton, SkeletonCard, SkeletonList } from "@/components/ui/Skeleton";
import { usePatientDashboard } from "@/hooks/use-patient";

export default function PatientDashboard() {
  const { data: dashboardData, isLoading, error } = usePatientDashboard();

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-6xl">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-48" />
            <SkeletonList count={3} />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <SkeletonList count={5} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-status-danger">{error?.message || "Failed to load dashboard"}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  const { user, stats, upcoming_appointments, recent_bills } = dashboardData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-status-success/10 text-status-success";
      case "pending":
        return "bg-status-warning/10 text-status-warning";
      case "completed":
        return "bg-status-success/10 text-status-success";
      case "cancelled":
        return "bg-status-danger/10 text-status-danger";
      case "paid":
        return "bg-status-success/10 text-status-success";
      case "pending_verification":
        return "bg-status-warning/10 text-status-warning";
      case "unpaid":
        return "bg-border text-text-muted";
      default:
        return "bg-border text-text-muted";
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.full_name || "Patient"}</h1>
        <p className="text-text-muted mt-1">Here is a summary of your clinic status and upcoming treatments.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Scheduled", value: stats.scheduled_appointments.toString(), icon: <Calendar className="text-primary w-5 h-5" />, sub: stats.scheduled_appointments > 0 ? "Next appointment" : "No upcoming" },
          { label: "Pending Bills", value: formatCurrency(stats.total_pending_amount), icon: <CreditCard className="text-status-warning w-5 h-5" />, sub: stats.pending_bills > 0 ? `${stats.pending_bills} bill(s)` : "All paid" },
          { label: "Total Visits", value: stats.total_visits.toString(), icon: <CheckCircle2 className="text-status-success w-5 h-5" />, sub: "Completed appointments" },
          {
            label: "Member Since",
            value: user.created_at
              ? new Date(user.created_at).getFullYear().toString()
              : "N/A",
            icon: <Clock className="text-secondary w-5 h-5" />,
            sub: "Patient record active",
          },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-none shadow-sm h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-background rounded-lg">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{stat.label}</p>
                <p className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-wider">{stat.sub}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-primary" onClick={() => window.location.href = "/patient/appointments"}>View All</Button>
          </CardHeader>
          <CardContent>
            {upcoming_appointments.length > 0 ? (
              <div className="space-y-4">
                {upcoming_appointments.slice(0, 3).map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border group transition-all hover:border-primary/30">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-border group-hover:bg-primary-light group-hover:border-primary transition-all">
                        <Calendar className="text-text-muted group-hover:text-primary transition-all" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{appt.service?.name || "Service"}</p>
                        <p className="text-xs text-text-muted">
                          {appt.doctor?.name || "Doctor TBD"} &bull; {formatDate(appt.appointment_time)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusColor(appt.status)}`}>
                        {appt.status}
                      </span>
                      <Button variant="ghost" size="sm" className="p-2 h-auto rounded-full hover:bg-white border border-transparent hover:border-border">
                        <ExternalLink className="w-4 h-4 text-text-muted" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No upcoming appointments</p>
                <Button className="mt-4" onClick={() => window.location.href = "/patient/services"}>Book Now</Button>
              </div>
            )}

            <Button className="w-full mt-6 bg-primary/5 text-primary border border-primary/20 hover:bg-primary hover:text-white group" onClick={() => window.location.href = "/patient/services"}>
              Book New Appointment
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Bills */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Recent Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {recent_bills.length > 0 ? (
              <div className="space-y-3">
                {recent_bills.slice(0, 5).map((bill) => (
                  <div key={bill.id} className="flex justify-between items-center p-3 bg-background rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-bold">{formatCurrency(bill.amount)}</p>
                      <p className="text-[10px] text-text-muted uppercase">{formatDate(bill.created_at)}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${getStatusColor(bill.payment_state || bill.status)}`}>
                      {(bill.payment_state || bill.status).replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted">
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No pending bills</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
