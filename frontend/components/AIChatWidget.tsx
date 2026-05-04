"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useTrips } from "@/components/TripContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

async function chatFetch(path: string, options?: RequestInit) {
  const token = typeof window !== "undefined" ? localStorage.getItem("pg_access_token") : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "สวัสดีครับ! ผมคือ Pack&Glow AI พร้อมช่วยคุณวางแผนท่องเที่ยว — ถามเรื่องสถานที่, การจัดกระเป๋า, อาหาร หรือสภาพอากาศได้เลยครับ ✨" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { currentTrip } = useTrips();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    if (!user) {
      setMessages(prev => [
        ...prev,
        { role: "user", content: text },
        { role: "assistant", content: "กรุณาเข้าสู่ระบบก่อนใช้งาน AI Chat ครับ 🔒" },
      ]);
      setInput("");
      return;
    }

    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const tripCtx = currentTrip
        ? `ทริป${currentTrip.destination || ""} ${currentTrip.duration_days || "?"} วัน`
        : undefined;

      const res = await chatFetch("/chat", {
        method: "POST",
        body: JSON.stringify({
          message: text,
          history: messages.slice(1).slice(-6).map(m => ({ role: m.role, content: m.content })),
          trip_context: tripCtx,
        }),
      });

      setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "ขออภัยครับ ไม่สามารถเชื่อมต่อ AI ได้ในขณะนี้ กรุณาลองใหม่ภายหลัง" },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 w-[calc(100%-2rem)] md:w-96 h-[70vh] md:h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-brand text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-bold">Pack&Glow AI</span>
            </div>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-brand" />
                  </div>
                )}
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-brand" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <Loader2 className="w-4 h-4 text-brand animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={user ? "ถามเรื่องท่องเที่ยว..." : "เข้าสู่ระบบก่อนใช้งาน"}
                disabled={sending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center hover:bg-brand-dark transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-50 hover:scale-105 ${
          open ? "bg-gray-700 hover:bg-gray-800" : "bg-brand hover:bg-brand-dark"
        }`}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </>
  );
}
