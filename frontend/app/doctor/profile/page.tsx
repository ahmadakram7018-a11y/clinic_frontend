"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, Save, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";

export default function DoctorProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    specialization: "",
    experience_years: "",
    phone: "",
    profile_image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/doctor/profile");
        const profile = response.data?.data?.profile;
        if (profile) {
          setFormData({
            name: profile.name || "",
            qualification: profile.qualification || "",
            specialization: profile.specialization || "",
            experience_years: profile.experience_years ? String(profile.experience_years) : "",
            phone: profile.phone || "",
            profile_image: profile.profile_image || "",
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        profile_image: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError("");

    try {
      const payload: Record<string, any> = {
        name: formData.name || null,
        qualification: formData.qualification || null,
        specialization: formData.specialization || null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years, 10) : null,
        phone: formData.phone || null,
        profile_image: formData.profile_image || null,
      };

      await apiClient.put("/doctor/profile", payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="h-64 rounded-2xl bg-border animate-pulse" />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-text-muted mt-1">Create and maintain your professional doctor profile.</p>
      </div>

      {success ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-status-success/10 border border-status-success/20 text-status-success text-sm font-medium flex items-center"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Profile updated successfully
        </motion.div>
      ) : null}

      {error ? <p className="text-sm text-status-danger">{error}</p> : null}

      <Card>
        <form onSubmit={handleSave}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border bg-white">
                {formData.profile_image ? (
                  <img
                    src={formData.profile_image}
                    alt="Doctor profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-text-muted">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-flex cursor-pointer items-center rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary transition-all hover:border-primary/40">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <p className="text-xs text-text-muted">Optional. Stored with your doctor profile.</p>
              </div>
            </div>
            <Input label="Full Name" name="name" placeholder="Dr. John Doe" value={formData.name} onChange={handleChange} />
            <Input label="Qualifications" name="qualification" placeholder="MBBS, FCPS, MD" value={formData.qualification} onChange={handleChange} />
            <Input label="Specialization" name="specialization" placeholder="Dermatology" value={formData.specialization} onChange={handleChange} />
            <Input label="Years of Experience" name="experience_years" type="number" placeholder="10" value={formData.experience_years} onChange={handleChange} />
            <Input label="Phone" name="phone" placeholder="+1234567890" value={formData.phone} onChange={handleChange} />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
