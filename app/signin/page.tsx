"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { signInWithGoogle } from "@/lib/supabase";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

function SignInContent() {
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "auth_failed") {
      toast.error("Google authentication failed. Please try again.");
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading("google");
      await signInWithGoogle();
      // Supabase will handle the redirect
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col">
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] via-[#FF9933] to-[#10B981]" />
              <span className="font-semibold text-3xl tracking-tight">EngiHub</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-[#94A3B8] mt-2">Sign in to continue your engineering journey</p>
          </div>

          <div className="glass rounded-3xl p-8 space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-white/20 hover:bg-white/5 disabled:opacity-60 transition font-medium"
            >
              {loading === "google" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.266 9.765A7.2 7.2 0 0 1 12 4.8c1.66 0 3.17.58 4.36 1.54l3.26-3.26A11.95 11.95 0 0 0 12 0C5.38 0 0 5.38 0 12s5.38 12 12 12c6.62 0 12-5.38 12-12 0-.8-.08-1.58-.23-2.34H12v4.51h6.79c-.3 1.58-1.18 2.92-2.47 3.82z"/>
                </svg>
              )}
              Continue with Google
            </button>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative text-center text-xs text-[#64748B]">or</div>
            </div>

            <Link 
              href="/signup" 
              className="block w-full text-center py-3.5 rounded-2xl bg-white text-[#0A1628] font-semibold hover:bg-white/90 transition"
            >
              Create a new account
            </Link>
          </div>

          <p className="text-center text-xs text-[#64748B] mt-8">
            By continuing you agree to our Terms &amp; Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A1628]" />}>
      <SignInContent />
    </Suspense>
  );
}
