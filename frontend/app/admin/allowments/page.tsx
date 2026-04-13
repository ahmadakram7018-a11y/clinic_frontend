"use client";

import React, { useEffect, useState } from "react";
import { MailCheck, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";

interface Allowment {
  id: string;
  email: string;
  role: "doctor" | "admin";
}

export default function AdminAllowmentsPage() {
  const [allowments, setAllowments] = useState<Allowment[]>([]);
  const [formData, setFormData] = useState({ email: "", role: "doctor" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAllowments = async () => {
    try {
      const response = await apiClient.get("/admin/allowments");
      setAllowments(response.data.data || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load allowments");
    }
  };

  useEffect(() => {
    fetchAllowments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await apiClient.post("/admin/allowment", formData);
      setAllowments((current) => [...current, response.data.data]);
      setFormData({ email: "", role: "doctor" });
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to add allowment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/admin/allowments/${id}`);
      setAllowments((current) => current.filter((allowment) => allowment.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete allowment");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center space-x-3">
        <MailCheck className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Allowments</h1>
          <p className="text-text-muted mt-1">
            Maintain the pre-approved email list for admin and doctor registrations.
          </p>
        </div>
      </div>

      {error ? <p className="text-sm text-status-danger">{error}</p> : null}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Allowment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="doctor@clinic.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="w-full space-y-1.5">
                <label className="text-sm font-medium text-text-primary ml-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="flex w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <Button type="submit" isLoading={isSubmitting}>
              Add Allowment
            </Button>
          </CardContent>
        </form>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Email</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Role</th>
                <th className="text-right px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allowments.map((allowment) => (
                <tr key={allowment.id} className="hover:bg-background/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{allowment.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        allowment.role === "admin"
                          ? "bg-status-danger/10 text-status-danger"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {allowment.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-status-danger"
                      onClick={() => handleDelete(allowment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
