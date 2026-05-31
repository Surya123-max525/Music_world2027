"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Brain, BookOpen, FolderOpen, 
  Trophy, User, LogOut, Menu, X 
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/supabase";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ai", label: "EngiAI", icon: Brain },
  { href: "/pyqs", label: "PYQ Bank", icon: BookOpen },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/placement", label: "Placement", icon: Trophy },
  { href: "/notes", label: "Notes", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (e) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#0A1628] p-5">
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] via-[#FF9933] to-[#10B981] flex items-center justify-center">
            <span className="font-bold text-xl">EH</span>
          </div>
          <div>
            <div className="font-semibold text-xl tracking-tight">EngiHub</div>
            <div className="text-[10px] -mt-1 text-[#64748B]">TAMIL NADU • AI</div>
          </div>
        </div>

        <nav className="space-y-1 flex-1 mt-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  active 
                    ? "bg-white/10 text-white" 
                    : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 mt-auto text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-2xl"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between border-b border-white/10 px-4 h-16 bg-[#0A1628]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] via-[#FF9933] to-[#10B981]" />
          <span className="font-semibold text-xl">EngiHub</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0A1628] p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-[#94A3B8] hover:bg-white/5"
              >
                <Icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
          <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm text-red-400 flex items-center gap-3">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 p-5 md:p-8 overflow-auto custom-scrollbar">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden bottom-nav fixed bottom-0 left-0 right-0 z-50 px-2 py-2 flex justify-around">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] ${active ? "text-white" : "text-[#64748B]"}`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
