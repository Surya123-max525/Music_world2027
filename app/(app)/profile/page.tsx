"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase, getUserProfile, UserProfile } from "@/lib/supabase";
import { BRANCHES, COLLEGES } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPro, setShowPro] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const isOnboarding = searchParams.get("onboarding") === "true";

  // Form state
  const [form, setForm] = useState({
    full_name: "",
    college: "",
    branch: "CSE",
    year: 2,
    semester: 3,
  });

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/signin");
          return;
        }

        const userProfile = await getUserProfile(user.id);

        if (userProfile) {
          setProfile(userProfile);
          setForm({
            full_name: userProfile.full_name || "",
            college: userProfile.college || COLLEGES[0],
            branch: userProfile.branch || "CSE",
            year: userProfile.year || 2,
            semester: userProfile.semester || 3,
          });
        } else {
          // Fallback if profile not found
          setForm({
            full_name: user.user_metadata?.full_name || "",
            college: COLLEGES[0],
            branch: "CSE",
            year: 2,
            semester: 3,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: form.full_name,
          college: form.college,
          branch: form.branch,
          year: form.year,
          semester: form.semester,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success(isOnboarding ? "Profile completed! Welcome to EngiHub." : "Profile updated successfully");

      // If this was onboarding, redirect to dashboard
      if (isOnboarding) {
        router.push("/dashboard");
      } else {
        // Refresh profile data
        const updated = await getUserProfile(profile.id);
        if (updated) setProfile(updated);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Onboarding Header */}
      {isOnboarding && (
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#3B82F6]/10 to-[#FF9933]/10 border border-[#3B82F6]/20">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Welcome to EngiHub! 🎉</h2>
          <p className="text-[#94A3B8]">
            Just a quick step — complete your profile so we can personalize your experience (PYQs, projects, and AI recommendations).
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">
          {isOnboarding ? "Complete Your Profile" : "Profile & Settings"}
        </h1>
        {!isOnboarding && (
          <button 
            onClick={() => setShowPro(true)} 
            className="btn-accent px-5 py-2 rounded-2xl text-sm font-semibold hidden sm:block"
          >
            Upgrade to Pro
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="card rounded-3xl p-8 mb-6">
        <div className="flex gap-6 items-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF9933] to-[#3B82F6] flex items-center justify-center text-4xl font-bold text-white">
            {form.full_name?.[0] || "U"}
          </div>
          <div>
            <div className="text-2xl font-semibold">{form.full_name || "Student"}</div>
            <div className="text-[#94A3B8]">{profile?.email}</div>
            {profile && (
              <div className="text-xs mt-1 text-[#10B981]">
                {profile.is_pro ? "Pro Member" : "Free Account"} • Joined {new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </div>
            )}
          </div>
        </div>

        {/* Editable Form */}
        <div className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1.5 block">Full Name</label>
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
              placeholder="Your College / University"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1.5 block">Branch</label>
              <select
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-sm"
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
                className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-sm"
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
                className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Sem {s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full btn-primary py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : isOnboarding ? (
              "Complete Profile & Continue"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Pro Section (hidden during onboarding) */}
      {!isOnboarding && (
        <div className="card rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">EngiHub Pro</div>
              <div className="text-sm text-[#94A3B8]">Unlimited AI solves, priority features & more</div>
            </div>
            <button 
              onClick={() => setShowPro(true)} 
              className="btn-accent px-6 py-2 rounded-2xl text-sm font-semibold"
            >
              Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Pro Modal */}
      {showPro && (
        <div className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50" onClick={() => setShowPro(false)}>
          <div onClick={e => e.stopPropagation()} className="glass w-full max-w-md rounded-t-3xl md:rounded-3xl p-8">
            <div className="font-semibold text-2xl mb-1">EngiHub Pro</div>
            <div className="text-[#FF9933] text-xl font-semibold mb-6">₹79 / month or ₹599 / year</div>
            
            <ul className="space-y-3 mb-8 text-sm">
              {["Unlimited EngiAI solves", "Priority access to new features", "Ad-free experience", "Downloadable project reports & code bundles", "Early access to voice features"].map((b, i) => (
                <li key={i}>✓ {b}</li>
              ))}
            </ul>

            <button className="btn-primary w-full py-4 rounded-2xl font-semibold">Subscribe with Razorpay (Coming Soon)</button>
            <div className="text-center text-xs mt-3 text-[#64748B]">Colleges get bulk discounts. Contact us for institutional plans.</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#3B82F6]" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
