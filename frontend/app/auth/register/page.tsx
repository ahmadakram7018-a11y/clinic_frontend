"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { apiClient } from "@/lib/api-client";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/signup", {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        full_name: formData.full_name,
        phone: formData.phone || undefined
      });
      const role = response.data?.role;
      
      if (role === "admin") window.location.assign("/admin/dashboard");
      else if (role === "doctor") window.location.assign("/doctor/dashboard");
      else window.location.assign("/patient/dashboard");
      
    } catch (err: any) {
      console.error("Signup error details:", err);
      console.error("Error response:", err.response?.data);
      console.error("Validation errors:", err.response?.data?.errors);
      setError(err.response?.data?.errors?.[0]?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-primary-light/30 blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-secondary-light/20 blur-[120px] -z-10" />

      <Link href="/" className="absolute top-8 left-8 text-text-muted hover:text-primary flex items-center transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="bg-primary inline-flex p-3 rounded-2xl mb-4 shadow-lg shadow-primary/20">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
          <p className="text-text-muted mt-2">Join Elite Clinic for premium medical care</p>
        </div>

        <Card className="shadow-2xl border-none">
          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              label="Full Name"
              name="full_name"
              type="text"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              error={error && error.includes("Password") ? error : ""}
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="space-y-2 p-3 bg-background rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Security Requirements</p>
              <div className="flex items-center text-xs text-text-muted">
                <CheckCircle2 className={`w-3 h-3 mr-2 ${formData.password.length >= 8 ? "text-status-success" : "text-border"}`} /> 8+ Characters
              </div>
              <div className="flex items-center text-xs text-text-muted">
                <CheckCircle2 className={`w-3 h-3 mr-2 ${/[A-Z]/.test(formData.password) ? "text-status-success" : "text-border"}`} /> One Uppercase Letter
              </div>
              <div className="flex items-center text-xs text-text-muted">
                <CheckCircle2 className={`w-3 h-3 mr-2 ${/\d/.test(formData.password) ? "text-status-success" : "text-border"}`} /> One Digit
              </div>
            </div>

            {error && !error.includes("Password") && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/20 text-status-danger text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full py-6 text-lg" 
              isLoading={isLoading}
            >
              Start Your Journey
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
