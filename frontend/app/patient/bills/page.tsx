"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton, SkeletonList } from "@/components/ui/Skeleton";
import { usePatientBills, useRequestPayment } from "@/hooks/use-patient";

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

export default function BillsPage() {
  const { data: bills = [], isLoading, error } = usePatientBills();
  const requestPayment = useRequestPayment();
  const [message, setMessage] = useState("");
  const [processingBillId, setProcessingBillId] = useState<string | null>(null);

  const handlePay = async (billId: string) => {
    setProcessingBillId(billId);
    try {
      await requestPayment.mutateAsync({ billId, paymentMethod: "front_desk_manual" });
      setMessage("Payment submitted. It will remain pending until the admin verifies it.");
    } catch (err: any) {
      // Error is handled by the hook's onError
    } finally {
      setProcessingBillId(null);
    }
  };

  const totalPending = bills
    .filter((bill) => bill.payment_state !== "paid")
    .reduce((sum, bill) => sum + Number(bill.amount), 0);

  const totalPaid = bills
    .filter((bill) => bill.payment_state === "paid")
    .reduce((sum, bill) => sum + Number(bill.amount), 0);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 rounded-2xl bg-border animate-pulse" />
          <div className="h-24 rounded-2xl bg-border animate-pulse" />
        </div>
        <SkeletonList count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-status-danger">{error.message || "Failed to fetch bills"}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bills & Payments</h1>
        <p className="text-text-muted mt-1">
          Submit manual payments and track whether the admin has verified them.
        </p>
      </div>

      {message ? <p className="text-sm text-status-success">{message}</p> : null}
      {error ? <p className="text-sm text-status-danger">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-status-warning/10 rounded-lg">
                <Clock className="w-5 h-5 text-status-warning" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Pending Amount</p>
                <p className="text-2xl font-bold">${totalPending.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-status-success/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-status-success" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Paid Amount</p>
                <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {bills.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-text-muted mb-4" />
            <p className="text-text-muted">No bills found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bills.map((bill) => {
            const isPaid = bill.payment_state === "paid";
            const isPendingVerification = bill.payment_state === "pending_verification";

            return (
              <motion.div key={bill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card hover>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border">
                        {isPaid ? (
                          <CheckCircle2 className="text-status-success" />
                        ) : isPendingVerification ? (
                          <Clock className="text-status-warning" />
                        ) : (
                          <AlertTriangle className="text-status-warning" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold">${Number(bill.amount).toFixed(2)}</p>
                        <p className="text-xs text-text-muted">
                          {bill.appointment?.service?.name || "Service"} | {new Date(bill.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs mt-2 text-text-muted">{bill.payment_message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          isPaid
                            ? "bg-status-success/10 text-status-success"
                            : isPendingVerification
                              ? "bg-status-warning/10 text-status-warning"
                              : "bg-border text-text-muted"
                        }`}
                      >
                        {bill.payment_state.replace("_", " ")}
                      </span>
                      {!isPaid ? (
                        <Button
                          size="sm"
                          disabled={isPendingVerification}
                          isLoading={processingBillId === bill.id}
                          onClick={() => handlePay(bill.id)}
                        >
                          {isPendingVerification ? "Awaiting Admin" : "Pay"}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
