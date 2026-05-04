"use client";

import { useEffect, useState } from "react";
import { useAuth, getToken } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  User,
  Crown,
  Calendar,
  CreditCard,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import ProUpgradePopup from "@/components/ProUpgradePopup";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  tier: string;
  subscription_plan: string | null;
  subscription_expires_at: string | null;
  created_at: string;
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [userTier, setUserTier] = useState<"free" | "pro">("free");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        // sync tier in localStorage
        localStorage.setItem("pg_user_tier", data.tier || "free");
        setUserTier(data.tier || "free");
        if (data.subscription_expires_at) {
          localStorage.setItem("pg_subscription_expires", data.subscription_expires_at);
        } else {
          localStorage.removeItem("pg_subscription_expires");
        }
      }
    } catch {
      // offline fallback from localStorage
      const tier = (localStorage.getItem("pg_user_tier") as "free" | "pro") || "free";
      setUserTier(tier);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPro = async () => {
    if (!confirm("ยกเลิก Pro หรือไม่? คุณจะกลับเป็น Free tier ทันที")) return;
    setCancelling(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/users/me/tier`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tier: "free" }),
      });
      if (res.ok) {
        localStorage.setItem("pg_user_tier", "free");
        localStorage.removeItem("pg_subscription_expires");
        setUserTier("free");
        await fetchProfile();
      }
    } catch {
      localStorage.setItem("pg_user_tier", "free");
      localStorage.removeItem("pg_subscription_expires");
      setUserTier("free");
    } finally {
      setCancelling(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysLeft = (iso: string) => {
    const now = new Date();
    const exp = new Date(iso);
    const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar variant="light" />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      </div>
    );
  }

  const isPro = userTier === "pro";
  const expiresAt = profile?.subscription_expires_at;
  const daysLeft = expiresAt ? getDaysLeft(expiresAt) : null;
  const planLabel =
    profile?.subscription_plan === "monthly"
      ? "รายเดือน"
      : profile?.subscription_plan === "yearly"
      ? "รายปี"
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="light" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">โปรไฟล์ของฉัน</h1>

        {/* Account Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลบัญชี</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPro ? "bg-brand" : "bg-gray-200"}`}>
                {isPro ? (
                  <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                ) : (
                  <User className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{profile?.name || user?.name}</p>
                <p className="text-sm text-gray-500">{profile?.email || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>สมาชิกตั้งแต่ {profile?.created_at ? formatDate(profile.created_at) : "—"}</span>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className={`rounded-2xl shadow-sm border p-6 mb-6 ${isPro ? "bg-gradient-to-br from-brand/5 to-[#D4956A]/5 border-brand/20" : "bg-white border-gray-100"}`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">แพ็กเกจปัจจุบัน</h2>

          {isPro ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center">
                  <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Pro</p>
                  <p className="text-sm text-gray-500">
                    แผน{planLabel || "—"}
                    {profile?.subscription_plan === "yearly" && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        ประหยัด 58%
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Expiry info */}
              {expiresAt && daysLeft !== null && (
                <div className={`rounded-xl p-4 mb-4 ${daysLeft <= 7 ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-2">
                    {daysLeft <= 7 ? (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${daysLeft <= 7 ? "text-red-700" : "text-gray-700"}`}>
                      {daysLeft > 0
                        ? `เหลือเวลา ${daysLeft} วัน (หมดอายุ ${formatDate(expiresAt)})`
                        : "หมดอายุแล้ว"}
                    </span>
                  </div>
                  {daysLeft <= 7 && daysLeft > 0 && (
                    <p className="text-xs text-red-500 mt-1">กำลังจะหมดอายุ! ต่ออายุเลยเพื่อใช้งานต่อ</p>
                  )}
                </div>
              )}

              {/* Pro features */}
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-gray-600">สิทธิประโยชน์ Pro ของคุณ:</p>
                <div className="grid gap-2">
                  {[
                    "Custom packing suggestions — คำแนะนำเฉพาะตัว",
                    "Outfit recommendations — แนะนำชุดที่เหมาะกับทริป",
                    "บันทึก Outfit ลง Moodboard",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-brand flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand to-[#D4956A] text-white font-semibold text-sm hover:shadow-lg transition-all"
                >
                  ต่ออายุ
                </button>
                <button
                  onClick={handleCancelPro}
                  disabled={cancelling}
                  className="flex-1 py-2.5 rounded-xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-all disabled:opacity-50"
                >
                  {cancelling ? "กำลังยกเลิก..." : "ยกเลิก Pro"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Free</p>
                  <p className="text-sm text-gray-500">ใช้งานฟรี — จำกัดฟีเจอร์</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-gray-600">อัปเกรด Pro เพื่อรับ:</p>
                <div className="grid gap-2">
                  {[
                    "Custom packing suggestions — คำแนะนำเฉพาะตัว",
                    "Outfit recommendations — แนะนำชุดที่เหมาะกับทริป",
                    "บันทึก Outfit ลง Moodboard",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <CreditCard className="w-4 h-4 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowUpgrade(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand to-[#D4956A] text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                อัปเกรดเป็น Pro
              </button>
            </>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          ออกจากบัญชี
        </button>
      </div>

      {/* Upgrade Popup */}
      {showUpgrade && (
        <ProUpgradePopup
          onClose={() => setShowUpgrade(false)}
          onUpgrade={() => {
            setUserTier("pro");
            fetchProfile();
            setShowUpgrade(false);
          }}
        />
      )}
    </div>
  );
}
