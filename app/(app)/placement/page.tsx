"use client";

import { useState } from "react";
import { Trophy, Calendar } from "lucide-react";

const CHALLENGES = [
  { q: "A train 150m long passes a pole in 15 sec. What is its speed?", a: "36 km/h", company: "TCS" },
  { q: "Find the output: int x=5; printf(\"%d\", x++ + ++x);", a: "12 (undefined behavior in some compilers)", company: "Infosys" },
  { q: "What is the time complexity of building a heap?", a: "O(n)", company: "Zoho" },
];

export default function Placement() {
  const [completed, setCompleted] = useState<number[]>([]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-9">
        <div className="flex items-center gap-3">
          <Trophy className="text-[#FF9933] w-8 h-8" />
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Placement Arena</h1>
            <p className="text-[#94A3B8]">Daily challenges • Company-specific questions • AI Mock Interviews</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> TODAY&apos;S 5 CHALLENGES</div>
        <div className="space-y-3">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="card p-6 rounded-3xl">
              <div className="flex justify-between">
                <div className="font-medium pr-8">{c.q}</div>
                <div className="text-xs px-3 h-fit py-1 rounded bg-[#FF9933]/10 text-[#FF9933] whitespace-nowrap">{c.company}</div>
              </div>
              <button 
                onClick={() => setCompleted([...completed, i])}
                disabled={completed.includes(i)}
                className="mt-4 text-sm px-6 py-2 rounded-2xl border border-white/10 disabled:bg-white/10 disabled:text-white/40"
              >
                {completed.includes(i) ? "Solved ✓" : "Submit Answer"}
              </button>
              {completed.includes(i) && <div className="text-xs mt-3 text-[#10B981]">Correct: {c.a}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-8 rounded-3xl">
        <div className="font-semibold mb-2">AI Mock Interview (TCS NQT style)</div>
        <p className="text-[#94A3B8] mb-5">Practice voice or text interview. Real-time feedback on communication + technical depth.</p>
        <button className="btn-primary px-8 py-3 rounded-2xl">Start 15-min Mock Interview →</button>
      </div>
    </div>
  );
}
