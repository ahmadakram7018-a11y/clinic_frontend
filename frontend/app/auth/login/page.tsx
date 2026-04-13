"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { apiClient } from "@/lib/api-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const role = response.data?.role;
      
      if (role === "admin") window.location.assign("/admin/dashboard");
      else if (role === "doctor") window.location.assign("/doctor/dashboard");
      else window.location.assign("/patient/dashboard");
      
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary-light/30 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-secondary-light/20 blur-[120px] -z-10" />

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
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-text-muted mt-2">Secure access to your medical portal</p>
        </div>

        <Card className="shadow-2xl border-none">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
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
              Access Portal
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-primary font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center text-xs text-text-muted mt-8 uppercase tracking-widest font-semibold opacity-50">
          Advanced Clinical Security Applied
        </p>
      </motion.div>
    </div>
  );
}
