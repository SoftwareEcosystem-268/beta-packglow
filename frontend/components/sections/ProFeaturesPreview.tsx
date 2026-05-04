"use client";

import { Star } from "lucide-react";

interface ProFeaturesPreviewProps {
  isPro: boolean;
  user: { name: string; email: string } | null;
  onUpgrade: () => void;
  onLoginRequired: () => void;
}

export default function ProFeaturesPreview({ isPro, user, onUpgrade, onLoginRequired }: ProFeaturesPreviewProps) {
  if (isPro) return null;

  return (
    <section className="bg-[#F5F3EF] py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="px-3 py-1 rounded-full bg-gray-400 text-white text-xs font-bold">PRO</span>
          <h2 className="text-2xl font-bold text-gray-900">อัปเกรดเพื่อปลดล็อคฟีเจอร์เพิ่มเติม</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md relative opacity-80">
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Custom Checklist</h3>
            <p className="text-sm text-gray-500">รายการตามกิจกรรมแบบเฉพาะเจาะจง — hiking, swimming, dinner และอื่นๆ</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md relative opacity-80">
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Outfit Moodboard</h3>
            <p className="text-sm text-gray-500">ชุดแต่งตัวแนะนำพร้อม style tags — casual, sporty, elegant</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md relative opacity-80">
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">AI Smart Matching</h3>
            <p className="text-sm text-gray-500">อธิบายว่าทำไมชุดนี้เหมาะกับสถานที่และกิจกรรมของคุณ</p>
          </div>
        </div>
        <button onClick={() => { if (!user) { onLoginRequired(); return; } onUpgrade(); }} className="mt-6 flex items-center gap-2 mx-auto px-8 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-all shadow-md">
          <Star className="w-5 h-5" />อัปเกรด Pro
        </button>
      </div>
    </section>
  );
}
