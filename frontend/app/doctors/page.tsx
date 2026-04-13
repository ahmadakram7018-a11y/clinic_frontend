"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Award, Clock } from "lucide-react";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const DOCTORS = [
  {
    id: 1,
    name: "Dr. Sarah Smith",
    title: "Chief Dermatologist",
    specialty: "Skin & Laser Therapy",
    badges: ["Hair Transplant Specialist", "15+ Years Experience"],
    rating: 4.9,
    patients: 1200,
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    title: "Plastic Surgeon",
    specialty: "Aesthetic Surgery",
    badges: ["Board Certified", "20+ Years Experience"],
    rating: 4.8,
    patients: 2500,
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    title: "Cosmetic Dermatologist",
    specialty: "Non-Invasive Procedures",
    badges: ["Laser Specialist", "10+ Years Experience"],
    rating: 5.0,
    patients: 800,
  },
];

export default function DoctorsPage() {
  const [search, setSearch] = useState("");

  const filteredDoctors = DOCTORS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MainNavbar />
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-12">
          <h1 className="mb-4">Our Medical Specialists</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            Meet our board-certified physicians with decades of combined
            experience in aesthetic medicine
          </p>
        </div>

        <div className="flex justify-center mb-10 max-w-md mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              placeholder="Search by name or specialty..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor, idx) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card hover className="h-full flex flex-col">
                <div className="w-full h-48 bg-gradient-to-br from-primary-light to-secondary-light rounded-t-xl mb-4 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-primary">
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle>{doctor.name}</CardTitle>
                  <p className="text-sm text-text-muted">{doctor.title}</p>
                  <p className="text-xs text-primary font-medium mt-1">
                    {doctor.specialty}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {doctor.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-2 py-1 bg-background text-[10px] font-bold uppercase tracking-wider text-text-muted rounded-md"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center text-text-muted text-xs">
                      <Star className="w-3.5 h-3.5 mr-1 text-status-warning" />
                      {doctor.rating} ({doctor.patients} patients)
                    </div>
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted italic">
              No doctors found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
