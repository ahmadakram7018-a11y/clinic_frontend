"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Trash2, UserPlus, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";

interface Doctor {
  id: string;
  email: string;
  created_at?: string;
  doctor_profile?: {
    name?: string;
    qualification?: string;
    specialization?: string;
    experience_years?: number;
    phone?: string;
  };
}

const initialForm = {
  email: "",
  password: "",
  name: "",
  qualification: "",
  specialization: "",
  experience_years: "",
  phone: "",
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get("/admin/doctors");
      setDoctors(response.data.data || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to fetch doctors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(
    () =>
      doctors.filter((doctor) => {
        const haystack = [
          doctor.email,
          doctor.doctor_profile?.name,
          doctor.doctor_profile?.specialization,
          doctor.doctor_profile?.qualification,
          doctor.doctor_profile?.phone,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search.toLowerCase());
      }),
    [doctors, search]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await apiClient.post("/admin/doctors", {
        ...formData,
        experience_years: formData.experience_years
          ? Number(formData.experience_years)
          : null,
      });
      setDoctors((current) => [response.data.data, ...current]);
      setFormData(initialForm);
      setShowForm(false);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to create doctor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (doctorId: string) => {
    try {
      await apiClient.delete(`/admin/doctors/${doctorId}`);
      setDoctors((current) => current.filter((doctor) => doctor.id !== doctorId));
    } catch (err: any) {
      setError(err.message || "Failed to delete doctor");
    }
  };

  if (isLoading) {
    return <div className="h-64 rounded-2xl bg-border animate-pulse" />;
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <UserRound className="w-6 h-6 text-secondary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Doctors</h1>
            <p className="text-text-muted mt-1">
              Create realistic clinician profiles and manage current staff records.
            </p>
          </div>
        </div>
        <Button onClick={() => setShowForm((current) => !current)}>
          <UserPlus className="w-4 h-4 mr-2" />
          {showForm ? "Close Form" : "Add Doctor"}
        </Button>
      </div>

      {error ? <p className="text-sm text-status-danger">{error}</p> : null}

      {showForm ? (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Create Doctor Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input label="Doctor Name" name="name" value={formData.name} onChange={handleChange} required />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              <Input label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} required />
              <Input label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} />
              <Input label="Experience (Years)" name="experience_years" type="number" value={formData.experience_years} onChange={handleChange} />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <div className="md:col-span-2">
                <Button type="submit" isLoading={isSubmitting}>
                  Create Doctor
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      ) : null}

      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search doctors..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Doctor</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Specialization</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Qualification</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Phone</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Experience</th>
                <th className="text-right px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-background/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{doctor.doctor_profile?.name || doctor.email}</p>
                    <p className="text-xs text-text-muted">{doctor.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {doctor.doctor_profile?.specialization || "Not set"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {doctor.doctor_profile?.qualification || "Not set"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {doctor.doctor_profile?.phone || "Not set"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {doctor.doctor_profile?.experience_years || 0} years
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-status-danger"
                      onClick={() => handleDelete(doctor.id)}
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
