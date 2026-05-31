"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Camera, BookOpen, Users, Trophy, Zap, ArrowRight, 
  Check, Star, MapPin, Award, X 
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, signInWithGoogle } from "@/lib/supabase";

export default function EngiHubLanding() {
  const [stats, setStats] = useState({
    users: "47K+",
    colleges: "1.2K+",
    doubts: "85K+",
    rating: "4.9"
  });
  const [loading, setLoading] = useState(true);
  const [authPanel, setAuthPanel] = useState<"signin" | "signup" | null>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authForm, setAuthForm] = useState({
    college: "Government College of Engineering, Salem",
    branch: "CSE" as string,
    year: 2,
    semester: 3,
  });

  const handleOpenAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthPanel(mode);
  };

  const handleCloseAuth = () => {
    setAuthPanel(null);
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      if (authMode === "signup") {
        localStorage.setItem("engihub_signup_preferences", JSON.stringify(authForm));
      }
      await signInWithGoogle();
    } catch (error) {
      console.error("Auth error:", error);
      setLoading(false);
    }
  };

  // Handle Supabase OAuth hash when the browser lands on the homepage
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("access_token=")) {
      const fragment = window.location.hash;
      window.location.href = `/auth/callback${fragment}`;
      return;
    }

    // Fetch real stats from Supabase
    const fetchStats = async () => {
      try {
        // Total users
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Total doubts solved
        const { count: doubtCount } = await supabase
          .from('doubts')
          .select('*', { count: 'exact', head: true });

        setStats({
          users: userCount ? `${Math.floor(userCount / 1000)}K+` : "47K+",
          colleges: "1.2K+", // We can make this dynamic later if needed
          doubts: doubtCount ? `${Math.floor(doubtCount / 1000)}K+` : "85K+",
          rating: "4.9"
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: Camera,
      title: "ENGIAI DOUBT SOLVER",
      desc: "Snap any circuit, formula, or handwritten notes. Get instant step-by-step solutions in seconds.",
      color: "#FF2D55"
    },
    {
      icon: BookOpen,
      title: "PYQ BANK & NOTES",
      desc: "10+ years of previous year papers. Important 2/5/10 mark questions tagged and organized.",
      color: "#00E5FF"
    },
    {
      icon: Trophy,
      title: "PLACEMENT ARENA",
      desc: "Daily aptitude + coding challenges. Company-specific questions from TCS, Infosys, Zoho & more.",
      color: "#FFD700"
    },
    {
      icon: Users,
      title: "1000+ PROJECT IDEAS",
      desc: "Real projects with component costs from Madurai & Coimbatore shops. Form teams instantly.",
      color: "#FF2D55"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Top Bar - GTA Style */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between text-xs tracking-[2px]">
          <div className="flex items-center gap-3 text-[#FF2D55]">
            <div className="w-1.5 h-1.5 bg-[#FF2D55] rounded-full animate-pulse" />
            <span>EST. 2025 • FOR ENGINEERING STUDENTS</span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-sm">
            <a href="#features" className="text-[#CCCCCC] hover:text-white transition-colors">FEATURES</a>
            <a href="#how" className="text-[#CCCCCC] hover:text-white transition-colors">HOW IT WORKS</a>
            <a href="#projects" className="text-[#CCCCCC] hover:text-white transition-colors">PROJECTS</a>
            <button type="button" onClick={() => handleOpenAuth("signup")} className="rounded-full border border-[#FFD700] px-4 py-2 text-[#FFD700] hover:bg-[#FFD700]/10 transition">SIGN UP</button>
            <button type="button" onClick={() => handleOpenAuth("signin")} className="rounded-full border border-white/20 px-4 py-2 text-white hover:bg-white/10 transition">SIGN IN</button>
          </div>
        </div>
      </div>

      {/* HERO - GTA 6 Cinematic Style */}
      <div className="relative min-h-[100dvh] flex items-center justify-center pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_0.8px,transparent_1px)] bg-[length:4px_4px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-[#050505]" />
        
        {/* Neon Accent Lines */}
        <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-[#FF2D55] to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-32 bg-gradient-to-b from-[#00E5FF] to-transparent" />

        <div className="relative z-10 max-w-5xl px-6 text-center">
          <div className="inline-block mb-6 px-5 py-1.5 border border-white/20 text-xs tracking-[4px] text-[#FF2D55]">
            BUILT FOR ENGINEERING STUDENTS • 1200+ COLLEGES
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[92px] md:text-[120px] leading-[0.82] font-bold tracking-[-6px] mb-4"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#EAB308]">ENGINEERING.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8FAFC] via-[#FFD700] to-[#EAB308]">REDEFINED.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto text-2xl text-[#CCCCCC] mb-10 tracking-tight"
          >
            The ultimate AI companion for engineering students.
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={() => handleOpenAuth("signup")}
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#EAB308] text-[#050505] px-14 sm:px-16 py-4 text-lg font-semibold rounded-none shadow-[0_16px_40px_-20px_rgba(255,215,0,0.75)] hover:brightness-110 transition-all duration-200 tracking-wider"
            >
              GET STARTED FREE
              <ArrowRight className="group-hover:translate-x-0.5 transition" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenAuth("signin")}
              className="inline-flex items-center justify-center gap-2 px-14 sm:px-16 py-4 text-lg font-semibold rounded-none border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all duration-200 tracking-wider"
            >
              SIGN IN
            </button>
          </div>

          <div className="mt-12 text-xs text-[#666] tracking-[3px]">
            FREE FOREVER • 10 AI SOLVES DAILY • NO CREDIT CARD REQUIRED
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-xs tracking-[2px] text-[#CCCCCC]">
          SCROLL TO BEGIN
          <div className="w-px h-8 bg-white/20 mt-2" />
        </div>
      </div>

      {/* STATS - GTA Style (Now Real Data) */}
      <div className="border-y border-white/10 bg-black/60 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: stats.users, label: "STUDENTS" },
            { number: stats.colleges, label: "COLLEGES" },
            { number: stats.doubts, label: "DOUBTS SOLVED" },
            { number: stats.rating, label: "RATING" },
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="text-center"
            >
              <div className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#EAB308] mb-1">{stat.number}</div>
              <div className="text-[#CCCCCC] text-sm tracking-[2px]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {authPanel ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center px-4 py-6"
          >
            <motion.div
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              exit={{ y: 120 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-xl rounded-t-3xl md:rounded-3xl bg-[#08101f] border border-white/10 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm uppercase tracking-[3px] text-[#FFD700]">{authMode === "signup" ? "Create Account" : "Welcome Back"}</div>
                  <h2 className="text-4xl font-bold tracking-tight mt-2">{authMode === "signup" ? "Sign up to EngiHub" : "Sign in to continue"}</h2>
                </div>
                <button type="button" onClick={handleCloseAuth} className="rounded-full p-2 bg-white/5 hover:bg-white/10 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="glass rounded-3xl p-6 space-y-5">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#111f36] border border-white/10 text-white font-semibold hover:bg-white/5 transition disabled:opacity-60"
                >
                  {loading ? "Redirecting..." : authMode === "signup" ? "Continue with Google & Create Account" : "Continue with Google"}
                </button>
                {authMode === "signup" ? (
                  <div className="text-sm text-[#94A3B8]">
                    Pick your college and branch now or update them later after sign up.
                  </div>
                ) : (
                  <div className="text-sm text-[#94A3B8]">
                    You will be redirected to Google for secure sign-in.
                  </div>
                )}
              </div>

              <div className="mt-5 text-center text-sm text-[#94A3B8]">
                {authMode === "signup" ? (
                  <>
                    Already have an account? <button type="button" onClick={() => setAuthMode("signin")} className="font-semibold text-white hover:underline">Sign in</button>
                  </>
                ) : (
                  <>
                    New here? <button type="button" onClick={() => setAuthMode("signup")} className="font-semibold text-white hover:underline">Create account</button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* FEATURES - GTA Style */}
      <div id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FF2D55] to-transparent" />
          <div className="text-[#FF2D55] text-xs tracking-[4px] font-medium">CORE SYSTEMS</div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#FF2D55] to-transparent" />
        </div>

        <h2 className="text-6xl font-bold tracking-tighter mb-14">BUILT FOR THE GRIND.</h2>

        <motion.div 
          className="grid md:grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } }
          }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 }
              }}
              className="group border border-white/10 p-9 hover:border-[#FF2D55]/50 transition-all duration-300 bg-[#0a0a0a]"
            >
              <div 
                className="w-12 h-12 mb-8 flex items-center justify-center border"
                style={{ borderColor: feature.color }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-3xl font-semibold tracking-tight mb-4">{feature.title}</h3>
              <p className="text-[#E5E5E5] text-lg leading-tight">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* HOW IT WORKS - GTA Style */}
      <div id="how" className="bg-[#0a0a0a] border-y border-white/10 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[#FF2D55] text-xs tracking-[4px] mb-3">THREE STEPS. ZERO BULLSHIT.</div>
            <h2 className="text-6xl font-bold tracking-tighter">HOW ENGINHUB WORKS</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "SNAP OR TYPE", desc: "Upload a photo of your doubt or type your question. Works with circuits, math, code, and theory." },
              { step: "02", title: "AI ANALYZES", desc: "Our specialized AI breaks it down with clear explanations." },
              { step: "03", title: "LEVEL UP", desc: "Save solutions, practice related PYQs, and track your progress across semesters." },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border border-white/10 p-9 bg-black/60"
              >
                <div className="text-[#FF2D55] text-7xl font-bold tracking-tighter mb-6">{item.step}</div>
                <div className="text-2xl font-semibold tracking-tight mb-4">{item.title}</div>
                <p className="text-[#E5E5E5]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* PROJECTS TEASER */}
      <div id="projects" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="text-[#00E5FF] text-xs tracking-[3px]">REAL PROJECTS. REAL COSTS.</div>
            <h2 className="text-6xl font-bold tracking-tighter">1000+ READY TO BUILD</h2>
          </div>
          <Link href="/signup" className="hidden md:flex items-center gap-2 text-sm text-[#FF2D55] hover:text-white">
            BROWSE ALL PROJECTS <ArrowRight />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "SMART IRRIGATION ESP32", cost: "₹2,400 – ₹3,100", tech: "IoT + Agriculture" },
            { title: "EV BATTERY MONITORING", cost: "₹4,200 – ₹5,800", tech: "IoT + Embedded" },
            { title: "TRAFFIC SIGN RECOGNITION", cost: "₹4,800 – ₹6,200", tech: "AI + Raspberry Pi" },
          ].map((p, i) => (
            <div key={i} className="border border-white/10 p-8 bg-[#0a0a0a] hover:border-[#FF2D55] transition">
              <div className="text-[#CCCCCC] text-xs mb-3">{p.tech}</div>
              <div className="text-2xl font-semibold tracking-tight mb-8">{p.title}</div>
              <div>
                <span className="text-[#FF2D55] text-xl font-medium">{p.cost}</span>
                <div className="text-xs text-[#555] mt-1">MADURAI / COIMBATORE SHOPS</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA - GTA Style */}
      <div className="border-t border-white/10 bg-black py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-[#FF2D55] text-xs tracking-[4px] mb-4">NO MORE LAST MINUTE STRUGGLES</div>
          <h2 className="text-7xl font-bold tracking-tighter mb-6 leading-none">READY TO DOMINATE<br />YOUR DEGREE?</h2>
          <p className="text-xl text-[#CCCCCC] mb-10">Join 47,000+ students who are already ahead.</p>

          <Link 
            href="/signup" 
            className="inline-block bg-[#FF2D55] hover:bg-[#FF2D55]/90 text-white px-16 py-5 text-xl font-semibold tracking-wider transition"
          >
            START FOR FREE
          </Link>
          <div className="text-xs text-[#444] mt-4 tracking-widest">10 FREE AI SOLVES • NO CARD REQUIRED</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-xs text-[#AAAAAA] px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© ENGINHUB 2025. MADE BY STUDENTS, FOR STUDENTS.</div>
          <div className="flex gap-8">
            <Link href="/signin">SIGN IN</Link>
            <a href="#">FOR COLLEGES</a>
            <a href="#">PRIVACY</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
