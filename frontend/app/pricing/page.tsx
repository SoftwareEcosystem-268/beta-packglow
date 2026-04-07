"use client";

import Navbar from "@/components/Navbar";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";

const freeFeatures = [
  { name: "Destination Picker", included: true },
  { name: "Basic Packing List", included: true },
  { name: "Custom Checklist", included: false },
  { name: "Outfit Moodboard", included: false },
  { name: "AI Smart Matching", included: false },
];

const proFeatures = [
  { name: "ฟีเจอร์ Free ทั้งหมด", included: true },
  { name: "Custom Checklist ไม่จำกัด", included: true },
  { name: "Outfit Moodboard", included: true },
  { name: "AI Smart Matching", included: true },
  { name: "บันทึกทริปไม่จำกัด", included: true },
  { name: "Priority Support", included: true },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar variant="light" />

      <main className="px-6 md:px-12 lg:px-16 py-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[#C97D4E] text-sm font-medium mb-2">แผนการใช้งาน</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              เลือกแผนที่ใช่สำหรับคุณ ✨
            </h1>
            <p className="text-gray-500">เริ่มต้นฟรี อัปเกรดเมื่อพร้อม</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-[#C97D4E] flex items-center justify-center hover:bg-[#A66B3F] transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Free Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-gray-900">฿0</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">ตลอดชีพ</p>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <ul className="space-y-4">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-[#C97D4E] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                        <X className="w-3 h-3 text-gray-400" />
                      </div>
                    )}
                    <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full py-3 px-6 rounded-xl border-2 border-[#C97D4E] text-[#C97D4E] font-semibold hover:bg-[#C97D4E] hover:text-white transition-colors">
              ใช้งานฟรี
            </button>
          </div>

          {/* Pro Card */}
          <div className="bg-gradient-to-br from-[#FDF0E6] to-[#F5E6D8] rounded-2xl p-8 shadow-lg relative">
            {/* Badge */}
            <div className="absolute -top-3 left-6 bg-[#C97D4E] text-white px-4 py-1 rounded-full text-sm font-medium">
              ⭐ ยอดนิยม
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pro</h2>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-gray-900">฿199</span>
              <span className="text-gray-500">/เดือน</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">&nbsp;</p>

            <div className="border-t border-[#C97D4E]/30 pt-6 mb-6">
              <ul className="space-y-4">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#C97D4E] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full py-3 px-6 rounded-xl bg-[#C97D4E] text-white font-semibold hover:bg-[#A66B3F] transition-colors shadow-md">
              เริ่มทดลองใช้ฟรี 7 วัน
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
