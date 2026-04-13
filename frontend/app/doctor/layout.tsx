"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, LogOut, Shield, Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    href: "/doctor/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "My Profile",
    href: "/doctor/profile",
    icon: <User className="w-5 h-5" />,
  },
];

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      router.push("/auth/login");
    } catch (err) {
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <aside className="w-64 bg-white border-r border-border hidden lg:flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Elite<span className="text-primary">Clinic</span>
            </span>
          </Link>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium cursor-pointer ${
                    isActive
                      ? "bg-primary-light text-primary shadow-sm"
                      : "text-text-muted hover:bg-background hover:text-text-primary"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </div>
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
      <main className="flex-grow lg:ml-64 relative">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-8 z-10">
          <div className="flex items-center bg-background rounded-full px-4 py-1.5 border border-border w-64">
            <Search className="w-4 h-4 text-text-muted mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none text-xs focus:ring-0 w-full"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">Doctor</p>
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                Doctor Portal
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-light border-2 border-white shadow-sm flex items-center justify-center text-primary font-bold">
              DR
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
