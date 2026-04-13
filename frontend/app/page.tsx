"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MainNavbar } from "@/components/layout/MainNavbar";

const FEATURED_SERVICES = [
  {
    title: "Hair Restoration",
    desc: "Advanced follicular unit extraction with precision clinical mapping.",
    icon: <Shield className="text-primary w-8 h-8" />,
  },
  {
    title: "Dermatology",
    desc: "Targeted skin therapies focusing on cellular regeneration and health.",
    icon: <Star className="text-primary w-8 h-8" />,
  },
  {
    title: "Laser Precision",
    desc: "Hospital-grade laser technology for specialized aesthetic corrections.",
    icon: <Award className="text-primary w-8 h-8" />,
  },
];

const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "12k+", label: "Successful Procedures" },
  { value: "100%", label: "Patient Satisfaction" },
  { value: "50+", label: "Medical Specialists" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <MainNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background abstract shapes */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-primary-light to-transparent opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 -z-10 w-96 h-96 bg-secondary-light rounded-full blur-3xl opacity-30" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-border rounded-full mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Elite Medical Standards
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              World Class <span className="text-primary">Aesthetic</span> Clinical Excellence
            </h1>
            <p className="text-lg lg:text-xl text-text-muted mb-8 max-w-lg">
              Experience the pinnacle of medical care in our state-of-the-art facility, 
              where advanced technology meets personalized surgical precision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="shadow-lg">
                Book Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                View All Services
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
               {/* Placeholder for high-res clinic image */}
               <div className="w-full h-[500px] bg-gray-200 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
            {/* Float Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-soft border border-border max-w-[200px]"
            >
              <div className="flex items-center space-x-2 mb-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-bold uppercase">ISO Certified</span>
              </div>
              <p className="text-xs text-text-muted">Adhering to strict international medical safety protocols.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center min-w-[150px]">
              <div className="text-4xl font-bold text-text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-text-muted font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-background/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4">Specialized Medical Services</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Each procedure is meticulously planned and executed by our team of 
              board-certified specialists using premium clinical grade equipment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURED_SERVICES.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover className="h-full border-none shadow-soft hover:shadow-2xl">
                  <CardHeader>
                    <div className="mb-4 p-3 bg-primary-light rounded-xl w-fit">
                      {service.icon}
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-muted mb-6">{service.desc}</p>
                    <Link href="/services" className="text-primary text-sm font-bold inline-flex items-center hover:underline">
                      Learn More <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="bg-white border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-text-muted text-sm">
          &copy; 2026 Elite Aesthetic Clinic. All Rights Reserved. 
          Built with premium medical excellence.
        </div>
      </footer>
    </div>
  );
}
