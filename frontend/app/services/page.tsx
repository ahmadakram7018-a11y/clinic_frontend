"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Banknote, ArrowRight } from "lucide-react";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const CATEGORIES = ["All", "Hair", "Skin", "Laser", "Body", "Surgical"];

const SERVICES = [
  { id: 1, name: "FUE Hair Transplant", category: "Hair", fee: 2500, duration: 480, description: "Precision follicular unit extraction for natural density and hairline restoration." },
  { id: 2, name: "PRP Therapy", category: "Hair", fee: 300, duration: 60, description: "Platelet-rich plasma therapy to stimulate dormant hair follicles and improve scalp health." },
  { id: 3, name: "Laser Hair Removal", category: "Laser", fee: 150, duration: 30, description: "Medical-grade laser treatment for permanent hair reduction across all skin types." },
  { id: 4, name: "Chemical Peel", category: "Skin", fee: 200, duration: 45, description: "Advanced clinical exfoliation to treat acne, scarring, and hyperpigmentation." },
  { id: 5, name: "Botox Injections", category: "Skin", fee: 400, duration: 20, description: "Specialized neurotoxin applications for wrinkle reduction and facial contouring." },
  { id: 6, name: "CoolSculpting", category: "Body", fee: 1200, duration: 90, description: "Non-invasive fat freezing technology for targeted body contouring and reshaping." },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredServices = SERVICES.filter(s => 
    (activeCategory === "All" || s.category === activeCategory) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MainNavbar />
      
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="mb-2">Our Specialized Services</h1>
            <p className="text-text-muted">Evidence-based aesthetic treatments performed to hospital standards.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:max-w-md">
            <div className="relative flex-grow">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
               <Input 
                placeholder="Search services..." 
                className="pl-10" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
               />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-white border border-border text-text-muted hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card hover className="h-full flex flex-col group">
                <CardHeader className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-2 py-1 bg-primary-light text-primary text-[10px] font-bold uppercase tracking-widest rounded-md">
                      {service.category}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-text-muted line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                  
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
                  
                  <Button variant="outline" className="w-full justify-between group/btn">
                    Details <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted italic">No services found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
