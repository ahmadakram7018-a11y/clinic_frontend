"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CreditCard,
  RefreshCw,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton, SkeletonCard, SkeletonList } from "@/components/ui/Skeleton";
import { useAdminDashboard, useVerifyPayment } from "@/hooks/use-admin";

export default function AdminDashboard() {
  const { data: dashboard, isLoading, error } = useAdminDashboard();
  const verifyPayment = useVerifyPayment();
  const [message, setMessage] = useState("");

  const handleVerify = async (billId: string) => {
    try {
      await verifyPayment.mutateAsync(billId);
      setMessage("Payment verified successfully");
    } catch (err: any) {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-7xl">
        <div>
          <Skeleton className="h-9 w-80 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-64" />
            <SkeletonList count={3} />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-border animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="space-y-4">
        <p className="text-status-danger">{error?.message || "Failed to load dashboard"}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const money = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const cards = [
    {
      label: "Patients",
      value: dashboard.stats.total_patients.toLocaleString(),
      sub: `${dashboard.stats.new_patients_this_month} registered this month`,
      icon: <Users className="w-5 h-5 text-primary" />,
    },
    {
      label: "Doctors",
      value: dashboard.stats.active_doctors.toLocaleString(),
      sub: `${dashboard.stats.services} billable services live`,
      icon: <UserRound className="w-5 h-5 text-secondary" />,
    },
    {
      label: "Appointments",
      value: dashboard.stats.monthly_appointments.toLocaleString(),
      sub: `${dashboard.stats.today_appointments} scheduled today`,
      icon: <Calendar className="w-5 h-5 text-status-warning" />,
    },
    {
      label: "Verified Revenue",
      value: money(dashboard.stats.monthly_revenue),
      sub: `${money(dashboard.stats.pending_collection_amount)} still uncollected`,
      icon: <TrendingUp className="w-5 h-5 text-status-success" />,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinic Operations Overview</h1>
          <p className="text-text-muted mt-1">
            Real counts from patient, doctor, appointment, billing, and verification records.
          </p>
        </div>
        <Button variant="outline" size="sm" className="bg-white" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            <Card className="border-none shadow-sm h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-lg bg-background p-2">{card.icon}</div>
                <div className="text-2xl font-bold">{card.value}</div>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{card.label}</p>
              <p className="mt-2 text-sm text-text-muted">{card.sub}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Manual Payment Verification Queue</CardTitle>
            <span className="text-xs font-bold uppercase tracking-widest text-status-warning">
              {dashboard.stats.pending_verifications} waiting
            </span>
          </CardHeader>
          <CardContent>
            {dashboard.pending_payment_verifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-text-muted">
                No patient payments are waiting for admin verification.
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard.pending_payment_verifications.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold">{bill.patient?.full_name || bill.patient?.email}</p>
                      <p className="text-xs text-text-muted">
                        {bill.appointment?.service?.name || "Service"} | {money(bill.amount)}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Submitted{" "}
                        {bill.payment_requested_at
                          ? new Date(bill.payment_requested_at).toLocaleString()
                          : "recently"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      isLoading={verifyPayment.status === "pending"}
                      onClick={() => handleVerify(bill.id)}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Verify Payment
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Operational Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-background p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
                Total Appointments
              </p>
              <p className="text-xl font-bold">{dashboard.stats.total_appointments.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-background p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
                Allowments
              </p>
              <p className="text-xl font-bold">{dashboard.stats.allowments.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-background p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
                Pending Collection
              </p>
              <p className="text-xl font-bold">{money(dashboard.stats.pending_collection_amount)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Patient Registrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.recent_patients.map((patient) => (
              <div key={patient.id} className="rounded-xl bg-background p-4">
                <p className="text-sm font-bold">{patient.patient_profile?.full_name || patient.email}</p>
                <p className="text-xs text-text-muted">
                  {patient.patient_profile?.phone || "Phone not recorded"} |{" "}
                  {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : "New"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Doctor Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.recent_doctors.map((doctor) => (
              <div key={doctor.id} className="rounded-xl bg-background p-4">
                <p className="text-sm font-bold">{doctor.doctor_profile?.name || doctor.email}</p>
                <p className="text-xs text-text-muted">
                  {doctor.doctor_profile?.specialization || "Specialization pending"} |{" "}
                  {doctor.doctor_profile?.experience_years || 0} years experience
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
