"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Users,
  UserRound,
  Settings,
  LogOut,
  Shield,
  Search,
  LayoutDashboard,
  ClipboardList,
  MailCheck
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { adminKeys } from "@/hooks/use-admin";

const SIDEBAR_ITEMS = [
  { name: "Admin Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Manage Patients", href: "/admin/patients", icon: <Users className="w-5 h-5" /> },
  { name: "Manage Doctors", href: "/admin/doctors", icon: <UserRound className="w-5 h-5" /> },
  { name: "Services Editor", href: "/admin/services", icon: <ClipboardList className="w-5 h-5" /> },
  { name: "Role Allowments", href: "/admin/allowments", icon: <MailCheck className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  // Prefetch admin dashboard data on layout mount
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: adminKeys.dashboard(),
      queryFn: async () => {
        const response = await apiClient.get("/admin/dashboard");
        return response.data.data;
      },
    });
  }, [queryClient]);

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border hidden lg:flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-border bg-primary/5">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Elite<span className="text-primary">Admin</span></span>
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
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-text-muted hover:bg-background hover:text-text-primary"
                }`}
                onMouseEnter={() => {
                  queryClient.prefetchQuery({
                    queryKey: adminKeys.dashboard(),
                    queryFn: async () => {
                      const response = await apiClient.get("/admin/dashboard");
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
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-8 z-10">
          <div className="text-xs font-bold uppercase tracking-widest text-text-muted">
             System Management Console v1.0
          </div>

          <div className="flex items-center space-x-4">
             <div className="px-2.5 py-1 bg-status-success/10 text-status-success text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center">
                <div className="w-1.5 h-1.5 bg-status-success rounded-full mr-2 animate-pulse" />
                Live Sync Active
             </div>
             <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm">
                AD
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
