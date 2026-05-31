"use client";

import { useState, useRef } from "react";
import { Camera, Send, Loader2, Save, BookOpen, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  image?: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  "circuit": "This is a classic 4-bit ripple carry adder using full adders. The carry ripples from LSB to MSB. Delay = 4 × (2×gate delay of XOR). Anna University frequently asks this as a 10-mark question with timing diagram.",
  "os": "Deadlock prevention uses Banker's algorithm (resource allocation graph). Key conditions: Mutual exclusion, Hold & wait, No preemption, Circular wait. Prevention = break any one condition. Very important for 5 & 10 mark questions.",
  "default": "Great question! This concept appears in Anna University semester exams almost every year. The key insight is understanding the fundamental principle first, then applying it to numericals. Would you like me to show a similar 2-mark or 10-mark PYQ?"
};

export default function EngiAI() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      role: 'ai', 
      content: "Hi! I'm EngiAI. Snap a photo of any circuit, formula, code, or textbook page and I'll explain it step-by-step like your Anna University professor." 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [usesLeft] = useState(7);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgData = event.target?.result as string;
      setSelectedImage(imgData);
      toast.success("Photo attached. Type your question or just press send.");
    };
    reader.readAsDataURL(file);
  };

  const simulateAIResponse = (text: string, hasImage: boolean) => {
    const lower = text.toLowerCase();
    let key = "default";
    if (lower.includes("adder") || lower.includes("circuit") || hasImage) key = "circuit";
    if (lower.includes("deadlock") || lower.includes("os")) key = "os";

    return MOCK_RESPONSES[key];
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: input || "Can you explain this diagram?",
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate realistic API delay
    await new Promise(r => setTimeout(r, 1350));

    const aiReply = simulateAIResponse(input, !!selectedImage);

    const aiMsg: Message = {
      id: Date.now() + 1,
      role: 'ai',
      content: aiReply
    };

    setMessages(prev => [...prev, aiMsg]);
    setSelectedImage(null);
    setLoading(false);

    if (usesLeft <= 1) {
      toast("You have used all free AI solves today. Upgrade to Pro for unlimited.", { 
        action: { label: "Upgrade", onClick: () => window.location.href = "/profile" } 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#FF9933] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-2xl tracking-tight">EngiAI</div>
              <div className="text-xs text-[#10B981]">Online • Powered by Gemini 1.5 Flash</div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{usesLeft} / 10</div>
          <div className="text-[10px] text-[#64748B]">free solves left today</div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass rounded-3xl p-6 overflow-y-auto custom-scrollbar space-y-6 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : ''}`}>
            <div className={`max-w-[82%] ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} px-5 py-4`}>
              {msg.image && (
                <img src={msg.image} alt="Uploaded doubt" className="rounded-xl mb-3 max-h-52 object-contain border border-white/10" />
              )}
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</div>

              {msg.role === 'ai' && (
                <div className="flex gap-2 mt-4">
                  <button className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1">
                    <Save className="w-3 h-3" /> Save to Notes
                  </button>
                  <button className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Related PYQs
                  </button>
                  <button className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1">
                    Explain Deeper
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-[#94A3B8] pl-2">
            <Loader2 className="animate-spin w-4 h-4" /> EngiAI is thinking... (analyzing image + syllabus)
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="glass rounded-3xl p-4">
        {selectedImage && (
          <div className="mb-3 flex items-center gap-3 bg-black/30 rounded-2xl p-2 pr-4 text-sm">
            <img src={selectedImage} className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1 text-[#94A3B8]">Photo attached. Add a question or just send.</div>
            <button onClick={() => setSelectedImage(null)} className="text-xs px-3 py-1 hover:bg-white/10 rounded-full">Remove</button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-2xl hover:bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white"
            title="Take photo or upload"
          >
            <Camera className="w-5 h-5" />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Type your doubt here... (e.g., Explain JK flip-flop with timing diagram)"
            className="flex-1 bg-transparent border border-white/10 rounded-2xl px-5 py-3.5 placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] text-base"
          />

          <button 
            onClick={sendMessage} 
            disabled={loading || (!input.trim() && !selectedImage)}
            className="btn-primary disabled:opacity-50 px-7 py-3.5 rounded-2xl flex items-center gap-2 font-semibold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </button>
        </div>

        <div className="text-[10px] text-center text-[#64748B] mt-3">
          Works best with circuit diagrams, formulas, handwritten notes • Tamil + English
        </div>
      </div>
    </div>
  );
}
