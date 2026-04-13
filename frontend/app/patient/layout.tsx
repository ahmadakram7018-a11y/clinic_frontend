"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Shield,
  Search,
  Stethoscope
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { patientKeys } from "@/hooks/use-patient";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", href: "/patient/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "My Appointments", href: "/patient/appointments", icon: <Calendar className="w-5 h-5" /> },
  { name: "Bills & Payments", href: "/patient/bills", icon: <CreditCard className="w-5 h-5" /> },
  { name: "Book Service", href: "/patient/services", icon: <Stethoscope className="w-5 h-5" /> },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      router.push("/auth/login");
    } catch (err) {
      router.push("/auth/login");
    }
  };

  // Prefetch patient data on layout mount
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: patientKeys.dashboard(),
      queryFn: async () => {
        const response = await apiClient.get("/patient/dashboard");
        return response.data.data;
      },
    });
  }, [queryClient]);

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border hidden lg:flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Elite<span className="text-primary">Clinic</span></span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                  ? "bg-primary-light text-primary shadow-sm"
                  : "text-text-muted hover:bg-background hover:text-text-primary"
                }`}
                onMouseEnter={() => {
                  // Prefetch dashboard data when hovering over any nav link
                  queryClient.prefetchQuery({
                    queryKey: patientKeys.dashboard(),
                    queryFn: async () => {
                      const response = await apiClient.get("/patient/dashboard");
                      return response.data.data;
                    },
                  });
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-text-muted hover:bg-status-danger/5 hover:text-status-danger transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 relative">
        {/* Top Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-8 z-10">
          <div className="flex items-center bg-background rounded-full px-4 py-1.5 border border-border w-64">
            <Search className="w-4 h-4 text-text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search appointments..." 
              className="bg-transparent border-none text-xs focus:ring-0 w-full"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">John Doe</p>
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Patient Portal</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-light border-2 border-white shadow-sm flex items-center justify-center text-primary font-bold">
              JD
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
