"use client";

import { Upload, FileText } from "lucide-react";

export default function Notes() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">My Notes &amp; Resources</h1>
      <p className="text-[#94A3B8] mb-8">Private + shared with classmates. Stored securely in Supabase.</p>

      <div className="dropzone border-2 border-dashed rounded-3xl p-12 text-center mb-10">
        <Upload className="mx-auto w-10 h-10 text-[#64748B] mb-4" />
        <div className="font-semibold mb-1">Drop files here or click to upload</div>
        <div className="text-sm text-[#94A3B8]">PDF, images, handwritten notes supported</div>
        <input type="file" multiple className="hidden" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {["DBMS - Normalization Notes", "CN - Transport Layer Handwritten", "OS - Process Scheduling Summary"].map((n, i) => (
          <div key={i} className="card p-5 rounded-2xl flex gap-4 items-start">
            <FileText className="w-6 h-6 mt-1 text-[#3B82F6]" />
            <div className="flex-1">
              <div className="font-medium">{n}</div>
              <div className="text-xs text-[#64748B]">Uploaded • 2.4 MB • Shared with 18 classmates</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
