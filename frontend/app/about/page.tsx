"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Award, Heart, CheckCircle2, Building2, Users } from "lucide-react";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const VALUES = [
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Safety First",
    desc: "All procedures follow strict clinical safety protocols and international medical standards.",
  },
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "Clinical Excellence",
    desc: "Our physicians are board-certified with decades of combined experience in aesthetic medicine.",
  },
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "Patient-Centered Care",
    desc: "Every treatment plan is personalized to achieve natural, beautiful results for each patient.",
  },
];

const STATS = [
  { icon: <Users className="w-6 h-6" />, value: "1200+", label: "Procedures Done" },
  { icon: <Building2 className="w-6 h-6" />, value: "15+", label: "Years Experience" },
  { icon: <Award className="w-6 h-6" />, value: "50+", label: "Medical Specialists" },
  { icon: <CheckCircle2 className="w-6 h-6" />, value: "100%", label: "Patient Satisfaction" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MainNavbar />
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h1 className="mb-4">About Elite Aesthetic Clinic</h1>
          <p className="text-text-muted max-w-3xl mx-auto text-lg">
            We are a premier medical facility dedicated to providing the highest
            quality aesthetic treatments in a safe, clinical environment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {VALUES.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card hover className="h-full">
                <CardHeader>
                  <div className="mb-4 p-3 bg-primary-light rounded-xl w-fit">
                    {value.icon}
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-muted">{value.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-white border border-border rounded-2xl p-12 mb-20">
          <h2 className="text-2xl font-bold text-center mb-12">
            Our Track Record
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-3 bg-primary-light rounded-xl mb-3 text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-primary text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Committed to Your Safety & Satisfaction
          </h2>
          <p className="text-primary-light max-w-2xl mx-auto mb-8">
            Our clinic adheres to the highest international medical standards.
            Every procedure is performed with precision, care, and the latest
            clinical technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">
              ISO Certified
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">
              Board-Certified Physicians
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">
              FDA-Approved Equipment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
