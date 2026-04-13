"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Banknote, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";

interface Service {
  id: string;
  name: string;
  fee: number;
  duration: number;
  description: string;
}

export default function PatientServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiClient.get("/patient/services");
        if (response.data?.data) {
          setServices(response.data.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = async (serviceId: string) => {
    if (!appointmentTime) {
      setError("Select an appointment date and time first.");
      return;
    }

    try {
      setIsBooking(true);
      setError("");
      setMessage("");
      await apiClient.post("/patient/appointments", {
        service_id: serviceId,
        appointment_time: new Date(appointmentTime).toISOString(),
      });
      setSelectedServiceId(serviceId);
      setMessage("Appointment booked. Your bill has been generated and payment can be submitted from Billing.");
      setAppointmentTime("");
    } catch (err: any) {
      setError(err.message || "Failed to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-border rounded-lg w-48 animate-pulse" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-border rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book a Service</h1>
        <p className="text-text-muted mt-1">
          Choose a service, select a date and time, and create the appointment directly.
        </p>
      </div>

      {message ? <p className="text-sm text-status-success">{message}</p> : null}
      {error ? <p className="text-sm text-status-danger">{error}</p> : null}

      <div className="rounded-2xl border border-border bg-white p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input
            type="datetime-local"
            label="Appointment Date & Time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            min={new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16)}
          />
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-muted">No services found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card hover className="h-full flex flex-col">
                <CardHeader className="flex-grow">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-text-muted line-clamp-3">{service.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center text-text-muted text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" />
                      {service.duration} min
                    </div>
                    <div className="flex items-center text-text-primary font-bold">
                      <Banknote className="w-4 h-4 mr-1.5 text-status-success" />
                      ${service.fee}
                    </div>
                  </div>
                  <Button
                    className="w-full justify-between group"
                    isLoading={isBooking && selectedServiceId === service.id}
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      void handleBook(service.id);
                    }}
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
