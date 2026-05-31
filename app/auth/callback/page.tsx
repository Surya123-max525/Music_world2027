"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getUserProfile, upsertUserProfile } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Finishing sign in...");

  useEffect(() => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const finishAuth = async () => {
      const initResult = await supabase.auth.initialize();

      if (initResult.error) {
        console.error("Supabase auth callback error:", initResult.error);
        setStatus("Sign-in failed. Please try again.");
        return;
      }

      const session = (await supabase.auth.getSession()).data?.session;
      if (!session) {
        setStatus("No active session found. Please sign in again.");
        return;
      }

      setStatus("Almost there — setting up your dashboard...");

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setStatus("Unable to verify your account. Please sign in again.");
        return;
      }

      const storedPrefs = localStorage.getItem("engihub_signup_preferences");
      if (storedPrefs) {
        try {
          const prefs = JSON.parse(storedPrefs);
          await upsertUserProfile(user.id, {
            full_name: prefs.full_name,
            college: prefs.college,
            branch: prefs.branch,
            year: prefs.year,
            semester: prefs.semester,
          });
        } catch (upsertError) {
          console.error("Failed to save signup preferences:", upsertError instanceof Error ? upsertError.message : JSON.stringify(upsertError));
        }
        localStorage.removeItem("engihub_signup_preferences");
      }

      let profile = await getUserProfile(user.id);
      let attempts = 0;
      while (!profile && attempts < 6) {
        await sleep(500);
        profile = await getUserProfile(user.id);
        attempts += 1;
      }

      if (!profile) {
        console.warn("Profile was not found after sign-in. User should still be authenticated.");
      }

      router.replace("/dashboard");
    };

    finishAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-3xl border border-white/10 bg-[#08101f]/90 p-10 text-center glass">
        <Loader2 className="mx-auto mb-6 h-12 w-12 animate-spin text-[#FFD700]" />
        <h1 className="text-3xl font-bold mb-4">Finishing sign in</h1>
        <p className="text-[#94A3B8] leading-relaxed">{status}</p>
      </div>
    </div>
  );
}
