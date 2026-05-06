"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("กรุณายอมรับข้อกำหนดการใช้งาน");
      return;
    }
    const err = await signup(name, email, password);
    if (err) {
      setError(err);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Full-page Background Image */}
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/asset/signup-bg.jpg`}
        alt="Travel scenic"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Logo top-left */}
      <Link href="/" className="absolute top-6 left-8 z-20 flex items-center gap-2">
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/asset/logo-web.svg`} alt="PackGlow" className="w-8 h-8" />
        <span className="text-2xl font-bold text-white">PackGlow</span>
      </Link>

      {/* Centered Form Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white mb-6 w-fit transition-colors">
          <span>← กลับหน้าหลัก</span>
        </Link>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">สร้างบัญชีใหม่ ✨</h1>
          <p className="text-gray-500 mb-6">เริ่มต้นจัดการการเดินทางของคุณได้ฟรี</p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
              <input
                type="text"
                placeholder="ชื่อของคุณ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C97D4E] focus:ring-2 focus:ring-[#C97D4E]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#C97D4E] focus:ring-2 focus:ring-[#C97D4E]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              <p className="text-xs text-gray-400 mt-2">รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร</p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#C97D4E] focus:ring-[#C97D4E] mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                ฉันยอมรับ{" "}
                <Link href="/terms" className="text-[#C97D4E] hover:underline">
                  ข้อกำหนดการใช้งาน
                </Link>{" "}
                และ{" "}
                <Link href="/privacy" className="text-[#C97D4E] hover:underline">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-[#C97D4E] text-white font-semibold hover:bg-[#A66B3F] transition-colors shadow-md"
            >
              สมัครสมาชิก
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-400 text-sm">หรือ</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <button className="w-full py-3 px-6 rounded-xl border border-gray-300 bg-white flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 font-medium">สมัครด้วย Google</span>
          </button>

          <p className="text-center text-gray-500 mt-6">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-[#C97D4E] font-medium hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}