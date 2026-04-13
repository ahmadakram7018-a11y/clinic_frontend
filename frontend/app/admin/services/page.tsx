"use client";

import React, { useEffect, useState } from "react";
import { ClipboardList, Edit, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";

interface Service {
  id: string;
  name: string;
  fee: number;
  duration: number;
  description?: string;
}

const initialForm = { name: "", fee: "", duration: "", description: "" };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await apiClient.get("/admin/services");
      setServices(response.data.data || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to fetch services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId("");
    setShowForm(false);
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      fee: String(service.fee),
      duration: String(service.duration),
      description: service.description || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name,
        fee: parseFloat(formData.fee),
        duration: parseInt(formData.duration, 10),
        description: formData.description,
      };
      if (editingId) {
        const response = await apiClient.put(`/admin/services/${editingId}`, payload);
        setServices((current) =>
          current.map((service) => (service.id === editingId ? response.data.data : service))
        );
      } else {
        const response = await apiClient.post("/admin/services", payload);
        setServices((current) => [...current, response.data.data]);
      }
      resetForm();
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await apiClient.delete(`/admin/services/${serviceId}`);
      setServices((current) => current.filter((service) => service.id !== serviceId));
    } catch (err: any) {
      setError(err.message || "Failed to delete service");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <ClipboardList className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services Editor</h1>
            <p className="text-text-muted mt-1">Manage clinic services, pricing, and treatment durations.</p>
          </div>
        </div>
        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Close Form" : "Add Service"}
        </Button>
      </div>

      {error ? <p className="text-sm text-status-danger">{error}</p> : null}

      {showForm ? (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Service" : "New Service"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Service Name" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="Fee ($)" name="fee" type="number" value={formData.fee} onChange={handleChange} required />
                <Input label="Duration (minutes)" name="duration" type="number" value={formData.duration} onChange={handleChange} required />
              </div>
              <div className="w-full space-y-1.5">
                <label className="text-sm font-medium text-text-primary ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))}
                  className="min-h-[110px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" isLoading={isSubmitting}>
                  {editingId ? "Update Service" : "Create Service"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      ) : null}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Service</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Fee</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Duration</th>
                <th className="text-right px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-background/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-text-muted">{service.description || "No description"}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">${service.fee.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">{service.duration} min</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-status-danger"
                      onClick={() => handleDelete(service.id)}
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
