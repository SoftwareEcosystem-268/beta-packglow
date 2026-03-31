"use client";

import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 w-fit">
          <ChevronLeft className="w-5 h-5" />
          <span>กลับหน้าหลัก</span>
        </Link>

        <div className="max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">ยินดีต้อนรับกลับ 👋</h1>
          <p className="text-gray-500 mb-8">เข้าสู่ระบบเพื่อจัดการแพ็คกิ้งของคุณ</p>

          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C97D4E] focus:ring-2 focus:ring-[#C97D4E]/20 outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C97D4E] focus:ring-2 focus:ring-[#C97D4E]/20 outline-none transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-[#C97D4E] hover:underline">
                ลืมรหัสผ่าน?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-[#C97D4E] text-white font-semibold hover:bg-[#A66B3F] transition-colors shadow-md"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-400 text-sm">หรือ</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full py-3 px-6 rounded-xl border border-gray-300 bg-white flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">เข้าสู่ระบบด้วย Google</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-500 mt-8">
            ยังไม่มีบัญชี?{" "}
            <Link href="/signup" className="text-[#C97D4E] font-medium hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#C97D4E] to-[#A66B3F] items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center mb-8 mx-auto">
            <img src="/asset/logo-web.svg" alt="PackGlow" className="w-40 h-40" />
          </div>
          <h2 className="text-3xl font-bold mb-4">PackGlow</h2>
          <p className="text-white/80 max-w-sm">
            จัดการสัมภาระการเดินทางได้อย่างง่ายดาย พร้อม AI ช่วยแนะนำ
          </p>
        </div>
      </div>
    </div>
  );
}
