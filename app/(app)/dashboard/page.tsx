"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, TrendingUp, Brain, Clock, Users, Award, 
  ArrowRight, Flame, AlertCircle, BookOpen, FolderOpen, Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase, getUserProfile, UserProfile } from "@/lib/supabase";

interface Doubt {
  id: string;
  question_text: string;
  created_at: string;
}

interface AttendanceRecord {
  present: number;
  total: number;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentDoubts, setRecentDoubts] = useState<Doubt[]>([]);
  const [attendancePercent, setAttendancePercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile
        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);

        // Fetch recent doubts (real data)
        const { data: doubts } = await supabase
          .from('doubts')
          .select('id, question_text, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2);

        if (doubts) setRecentDoubts(doubts);

        // Fetch attendance and calculate average
        const { data: attendanceRecords } = await supabase
          .from('attendance')
          .select('present, total')
          .eq('user_id', user.id);

        if (attendanceRecords && attendanceRecords.length > 0) {
          const totalPresent = attendanceRecords.reduce((sum, r) => sum + r.present, 0);
          const totalClasses = attendanceRecords.reduce((sum, r) => sum + r.total, 0);
          const percent = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : null;
          setAttendancePercent(percent);
        }

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Profile incomplete check
  const isProfileIncomplete = profile && (
    !profile.full_name || 
    (profile.college === "Anna University, Chennai" && profile.branch === "CSE" && profile.year === 2)
  );

  const displayName = profile?.full_name?.split(" ")[0] || "Student";
  const displayBranch = profile?.branch || "CSE";
  const displayYear = profile?.year || 2;

  // Realistic placeholders for things not yet in schema (timetable, CGPA, exams)
  const todayClasses = [
    { time: "09:00", subject: "Operating Systems", room: "CS-204" },
    { time: "11:00", subject: "Computer Networks", room: "Lab-3" },
    { time: "14:00", subject: "DBMS", room: "CS-101" },
  ];

  const cgpa = 8.2; // Placeholder until we add CGPA tracking
  const daysToExam = 19;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Incomplete Banner */}
      {isProfileIncomplete && (
        <div className="bg-[#FF9933]/10 border border-[#FF9933]/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#FF9933] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[#FF9933]">Complete your profile</div>
              <p className="text-sm text-[#94A3B8]">Tell us your college and branch so we can show you the right PYQs, projects, and AI recommendations.</p>
            </div>
          </div>
          <Link 
            href="/profile" 
            className="shrink-0 px-5 py-2 bg-[#FF9933] text-black font-semibold rounded-2xl text-sm hover:bg-[#FF9933]/90 transition"
          >
            Complete Now
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">Good morning, {displayName} 👋</h1>
            <div className="px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-xs font-medium flex items-center gap-1">
              <Flame className="w-3 h-3" /> 7 day streak
            </div>
          </div>
          <p className="text-[#94A3B8] mt-1">{displayBranch} • Year {displayYear} • {profile?.college || "Your University"}</p>
        </div>
        
        {!profile?.is_pro && (
          <Link href="/profile" className="btn-accent hidden sm:flex items-center gap-2 text-sm px-5 py-2 rounded-2xl font-semibold">
            Upgrade to Pro • ₹79/mo
          </Link>
        )}
      </div>

      {/* Quick Stats - Real where possible */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card rounded-3xl p-6">
          <div className="flex items-center gap-3 text-[#10B981]">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">ATTENDANCE</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tighter">
              {attendancePercent !== null ? attendancePercent : "--"}
            </span>
            <span className="text-2xl text-[#94A3B8]">%</span>
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            {attendancePercent !== null ? "+3% from last month" : "No data yet"}
          </div>
        </div>

        <div className="card rounded-3xl p-6">
          <div className="flex items-center gap-3 text-[#3B82F6]">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">CGPA</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-5xl font-semibold tracking-tighter">{cgpa}</span>
          </div>
          <div className="text-xs text-[#64748B] mt-1">Target 8.7 by end of sem</div>
        </div>

        <div className="card rounded-3xl p-6">
          <div className="flex items-center gap-3 text-[#FF9933]">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">EXAMS IN</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tighter">{daysToExam}</span>
            <span className="text-xl text-[#94A3B8]">days</span>
          </div>
          <div className="text-xs text-[#64748B] mt-1">DBMS, CN, OS • Apr 18</div>
        </div>

        <div className="card rounded-3xl p-6 bg-gradient-to-br from-[#3B82F6]/10 to-transparent border-[#3B82F6]/30">
          <div className="flex items-center gap-3 text-[#3B82F6]">
            <Brain className="w-5 h-5" />
            <span className="text-sm font-medium">AI DOUBTS LEFT</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tighter">7</span>
            <span className="text-sm text-[#94A3B8]">/ 10 today</span>
          </div>
          <Link href="/ai" className="text-xs text-[#3B82F6] mt-3 inline-flex items-center gap-1 hover:underline">Solve a doubt →</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Today's Timetable */}
        <div className="lg:col-span-2 card rounded-3xl p-7">
          <div className="flex justify-between items-center mb-6">
            <div className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF9933]" /> TODAY&apos;S CLASSES
            </div>
            <Link href="#" className="text-xs text-[#3B82F6]">Edit timetable →</Link>
          </div>
          <div className="space-y-3">
            {todayClasses.map((cls, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 rounded-2xl px-5 py-3.5 text-sm">
                <div className="font-medium">{cls.subject}</div>
                <div className="text-right text-[#94A3B8]">
                  <div>{cls.time}</div>
                  <div className="text-xs">{cls.room}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent EngiAI - Now Real Data */}
        <div className="lg:col-span-3 card rounded-3xl p-7">
          <div className="flex justify-between items-center mb-6">
            <div className="font-semibold flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#10B981]" /> RECENT DOUBTS
            </div>
            <Link href="/ai" className="text-xs flex items-center gap-1 text-[#3B82F6]">Open EngiAI <ArrowRight className="w-3 h-3" /></Link>
          </div>

          <div className="space-y-3">
            {recentDoubts.length > 0 ? (
              recentDoubts.map((doubt, i) => (
                <Link 
                  key={i} 
                  href="/ai" 
                  className="block bg-white/5 hover:bg-white/10 rounded-2xl px-5 py-3.5 transition text-sm"
                >
                  <div className="font-medium line-clamp-1">{doubt.question_text}</div>
                  <div className="text-xs text-[#64748B] mt-1">
                    {new Date(doubt.created_at).toLocaleDateString('en-IN', { 
                      month: 'short', day: 'numeric' 
                    })}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-sm text-[#94A3B8]">
                No doubts solved yet. <Link href="/ai" className="text-[#3B82F6] hover:underline">Ask your first question →</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="font-semibold mb-3 px-1 text-sm tracking-wider text-[#94A3B8]">QUICK ACTIONS</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { href: "/ai", label: "Snap a Doubt", icon: Brain, color: "text-[#3B82F6]" },
            { href: "/pyqs", label: "Browse PYQs", icon: BookOpen, color: "text-[#10B981]" },
            { href: "/projects", label: "Find Project", icon: FolderOpen, color: "text-[#FF9933]" },
            { href: "/placement", label: "Daily Challenge", icon: Trophy, color: "text-[#8B5CF6]" },
            { href: "/notes", label: "Upload Notes", icon: BookOpen, color: "text-[#3B82F6]" },
          ].map((a, i) => (
            <Link key={i} href={a.href} className="card hover:border-[#3B82F6] transition rounded-2xl p-5 flex items-center gap-3 text-sm font-medium">
              <a.icon className={`w-5 h-5 ${a.color}`} /> {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
