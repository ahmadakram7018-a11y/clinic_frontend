"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Trash2, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";

interface Patient {
  id: string;
  email: string;
  created_at?: string;
  patient_profile?: {
    full_name?: string;
    phone?: string;
    gender?: string;
    date_of_birth?: string;
  };
}

const initialForm = {
  email: "",
  password: "",
  full_name: "",
  phone: "",
  date_of_birth: "",
  gender: "",
};

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get("/admin/patients");
      setPatients(response.data.data || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to fetch patients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(
    () =>
      patients.filter((patient) => {
        const haystack = [
          patient.email,
          patient.patient_profile?.full_name,
          patient.patient_profile?.phone,
          patient.patient_profile?.gender,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search.toLowerCase());
      }),
    [patients, search]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await apiClient.post("/admin/patients", {
        ...formData,
        gender: formData.gender || null,
        date_of_birth: formData.date_of_birth || null,
      });
      setPatients((current) => [response.data.data, ...current]);
      setFormData(initialForm);
      setShowForm(false);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to create patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (patientId: string) => {
    try {
      await apiClient.delete(`/admin/patients/${patientId}`);
      setPatients((current) => current.filter((patient) => patient.id !== patientId));
    } catch (err: any) {
      setError(err.message || "Failed to delete patient");
    }
  };

  if (isLoading) {
    return <div className="h-64 rounded-2xl bg-border animate-pulse" />;
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Patients</h1>
            <p className="text-text-muted mt-1">
              Register patients manually and maintain realistic profile records.
            </p>
          </div>
        </div>
        <Button onClick={() => setShowForm((current) => !current)}>
          <UserPlus className="w-4 h-4 mr-2" />
          {showForm ? "Close Form" : "Add Patient"}
        </Button>
      </div>

      {error ? <p className="text-sm text-status-danger">{error}</p> : null}

      {showForm ? (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Create Patient Record</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
              <div className="w-full space-y-1.5">
                <label className="text-sm font-medium text-text-primary ml-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="flex w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" isLoading={isSubmitting}>
                  Create Patient
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
            placeholder="Search patients..."
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
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Patient</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Phone</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Gender</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Date of Birth</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Registered</th>
                <th className="text-right px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-background/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{patient.patient_profile?.full_name || patient.email}</p>
                    <p className="text-xs text-text-muted">{patient.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {patient.patient_profile?.phone || "Not set"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {patient.patient_profile?.gender || "Not set"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {patient.patient_profile?.date_of_birth
                      ? new Date(patient.patient_profile.date_of_birth).toLocaleDateString()
                      : "Not set"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-status-danger"
                      onClick={() => handleDelete(patient.id)}
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
