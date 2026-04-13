"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsLoading(false);
    setTimeout(() => {
      setSuccess(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MainNavbar />
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h1 className="mb-4">Get in Touch</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            Have questions about our services? Reach out to our team and we&apos;ll
            get back to you within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-status-success/10 border border-status-success/20 text-status-success text-sm font-medium flex items-center"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Message sent successfully!
                  </motion.div>
                )}
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
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
                  label="Phone Number"
                  name="phone"
                  placeholder="+1 (234) 567-8900"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <div className="w-full space-y-1.5">
                  <label className="text-sm font-medium text-text-primary ml-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="flex w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </form>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Address</p>
                    <p className="text-sm text-text-muted">
                      123 Medical Center Blvd, Suite 456
                      <br />
                      Los Angeles, CA 90012
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Phone</p>
                    <p className="text-sm text-text-muted">+1 (234) 567-8900</p>
                    <p className="text-xs text-status-danger font-medium mt-1">
                      Emergency: +1 (234) 567-8911
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Email</p>
                    <p className="text-sm text-text-muted">
                      info@eliteaestheticclinic.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      Working Hours
                    </p>
                    <p className="text-sm text-text-muted">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="w-full h-64 bg-border rounded-2xl flex items-center justify-center border border-border">
              <p className="text-text-muted text-sm italic">Map Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
