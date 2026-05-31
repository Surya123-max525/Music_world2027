"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PYQ {
  id: number;
  subject: string;
  question: string;
  marks: number;
  importance: string;
  year_asked: string;
}

export default function PYQBank() {
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMarks, setSelectedMarks] = useState<number | null>(null);
  const [branch, setBranch] = useState("CSE");

  useEffect(() => {
    const fetchPYQs = async () => {
      const { data, error } = await supabase
        .from('pyqs')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error("Error loading PYQs:", error);
      } else {
        setPyqs(data || []);
      }
      setLoading(false);
    };

    fetchPYQs();
  }, []);

  const filtered = pyqs.filter(p => 
    (!selectedMarks || p.marks === selectedMarks) &&
    (p.question.toLowerCase().includes(search.toLowerCase()) || 
     p.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">PYQ Bank</h1>
        <p className="text-[#94A3B8] mt-1">Anna University &amp; MKU • Real previous year questions</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-4 w-4 h-4 text-[#64748B]" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions or subjects..." 
            className="w-full bg-[#111F36] border border-white/10 rounded-2xl pl-12 py-3.5" 
          />
        </div>
        <select value={branch} onChange={e => setBranch(e.target.value)} className="bg-[#111F36] border border-white/10 rounded-2xl px-5 py-3 text-sm w-full md:w-44">
          <option>CSE</option>
          <option>ECE</option>
          <option>EEE</option>
        </select>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[2,5,10].map(m => (
          <button key={m} onClick={() => setSelectedMarks(selectedMarks === m ? null : m)}
            className={`filter-chip ${selectedMarks === m ? "active" : ""}`}>
            {m} Mark Questions
          </button>
        ))}
        {selectedMarks && <button onClick={() => setSelectedMarks(null)} className="text-xs underline text-[#94A3B8]">Clear</button>}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#94A3B8]">Loading questions...</div>
      ) : (
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((pyq) => (
              <div key={pyq.id} className="card p-6 rounded-3xl flex gap-6 items-start hover:border-[#3B82F6]/60 transition">
                <div>
                  <div className="text-xs font-mono px-3 py-1 bg-white/5 inline-block rounded-full mb-3">{pyq.year_asked}</div>
                  <div className="font-semibold text-lg leading-tight pr-4">{pyq.question}</div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-[#10B981]">{pyq.subject}</span>
                    <span className="text-[#FF9933] font-medium">• {pyq.marks} Marks</span>
                    {pyq.importance === "high" && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-px rounded">HIGH FREQ</span>}
                  </div>
                </div>
                <button className="ml-auto text-xs shrink-0 px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/5">View Solution</button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#94A3B8]">No questions found.</div>
          )}
        </div>
      )}
    </div>
  );
}
