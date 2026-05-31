"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { signInWithGoogle } from "@/lib/supabase";
import { toast } from "sonner";
import { BRANCHES, COLLEGES } from "@/lib/utils";

export default function SignUp() {
  const [loading, setLoading] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    college: COLLEGES[0] as string,
    branch: "CSE" as (typeof BRANCHES)[number],
    year: 2,
    semester: 3,
  });

  const handleGoogleSignUp = async () => {
    if (!form.full_name.trim()) {
      toast.error("Please enter your full name before signing up.");
      return;
    }

    try {
      setLoading("google");

      // Store user preferences temporarily (will be used after profile is auto-created)
      localStorage.setItem("engihub_signup_preferences", JSON.stringify(form));

      await signInWithGoogle();
      // Supabase OAuth will redirect to /auth/callback
    } catch (error) {
      console.error("Google sign-up error:", error);
      toast.error("Failed to create account. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col">
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] via-[#FF9933] to-[#10B981]" />
              <span className="font-semibold text-3xl tracking-tight">EngiHub</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-[#94A3B8] mt-1.5">Join 47,000+ engineering students</p>
          </div>

          <div className="glass rounded-3xl p-8 space-y-6">
            {/* Profile details (will be applied after signup) */}
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1.5 block">Full name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#3B82F6]"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1.5 block">College / University</label>
                <input
                  type="text"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#3B82F6]"
                  placeholder="Enter your college or university"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1.5 block">Branch</label>
                  <select
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value as (typeof BRANCHES)[number] })}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#3B82F6]"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1.5 block">Year</label>
                  <select
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#3B82F6]"
                  >
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1.5 block">Semester</label>
                  <select
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: parseInt(e.target.value) })}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#3B82F6]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              disabled={!!loading}
              className="btn-accent w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold disabled:opacity-70"
            >
              {loading === "google" ? <Loader2 className="animate-spin w-5 h-5" /> : null}
              Continue with Google &amp; Create Account
            </button>

            <div className="text-[11px] text-center text-[#64748B] leading-relaxed">
              Your profile will be created automatically. You can update your college, branch &amp; year after signing in.
            </div>
          </div>

          <p className="text-center text-sm text-[#94A3B8] mt-6">
            Already have an account? <Link href="/signin" className="text-white hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
