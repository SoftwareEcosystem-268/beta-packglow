"use client";

import Navbar from "@/components/Navbar";
import { useOutfits } from "@/components/OutfitContext";
import OutfitDetailModal from "@/components/OutfitDetailModal";
import ProUpgradePopup from "@/components/ProUpgradePopup";
import { ChevronLeft, ChevronRight, Star, Sparkles, Heart, Loader2, Crown, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Outfit } from "@/lib/api";

const occasionFilters = [
  { id: "all", label: "ทั้งหมด" },
  { id: "day", label: "กลางวัน" },
  { id: "night", label: "กลางคืน" },
  { id: "formal", label: "ทางการ" },
  { id: "casual", label: "ลำลอง" },
];

const destinationFilters = [
  { id: "all", label: "ทั้งหมด" },
  { id: "beach", label: "ชายหาด" },
  { id: "mountain", label: "ภูเขา" },
  { id: "city", label: "เมือง" },
  { id: "ceremony", label: "พิธีการ" },
  { id: "abroad", label: "ต่างประเทศ" },
];

const partners = [
  { id: 1, name: "Uniqlo", description: "เสื้อผ้าคุณภาพ ใส่ง่าย", logo: "/asset/logo-Uniqlo.svg" },
  { id: 2, name: "H&M", description: "ชุดทันสมัย ราคาย่อมเยา", logo: "/asset/logo-H&M.svg" },
  { id: 3, name: "Airbnb", description: "ที่พักโลคอลใน Tokyo", logo: "/asset/logo-airbnb.svg" },
];

const outfitStyleNameMap: Record<string, string> = {
  casual: "Smart Casual",
  minimal: "Minimal Street",
  elegant: "Modern Elegant",
  formal: "Classic Formal",
  sporty: "Sporty Chic",
  outdoor: "Outdoor Explorer",
  street: "Street Style",
  vintage: "Vintage Classic",
  layering: "Layered Look",
  beach: "Beach Vibes",
  night: "Night Out",
  korean: "Korean Look",
};

function getStyleName(tags: string[]): string {
  if (tags.length === 0) return "Everyday Style";
  return outfitStyleNameMap[tags[0]] || tags[0];
}

export default function OutfitsPage() {
  const { outfits, savedOutfits, loading, toggleSave, isSaved } = useOutfits();
  const [activeOccasion, setActiveOccasion] = useState("all");
  const [activeDestination, setActiveDestination] = useState("all");
  const [userTier, setUserTier] = useState<"free" | "pro">("free");
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [showProPopup, setShowProPopup] = useState(false);

  useEffect(() => {
    const readTier = () => {
      const saved = localStorage.getItem("pg_user_tier");
      if (saved === "pro" || saved === "free") setUserTier(saved);
    };
    readTier();
    const onStorage = () => readTier();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filteredOutfits = outfits.filter((o) => {
    if (activeOccasion !== "all" && o.occasion !== activeOccasion) return false;
    if (activeDestination !== "all" && o.destination_type !== activeDestination) return false;
    return true;
  });

  const handleCardClick = (outfit: Outfit) => {
    if (userTier === "pro") {
      setSelectedOutfit(outfit);
    } else {
      setShowProPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar variant="light" />

      <main className="px-4 md:px-12 lg:px-16 py-6 md:py-8">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-[#6B5B4D] to-[#5A4A3D] rounded-2xl p-5 md:p-8 mb-6 md:mb-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 shadow-lg">
          <div className="flex items-center gap-3 md:gap-4 text-center md:text-left">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#F4A940] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-lg md:text-2xl font-bold mb-1">Outfit Moodboard & AI Smart Matching</h2>
              <p className="text-white/70 text-xs md:text-base">AI จับคู่ชุดกับการเดินทางและสภาพอากาศ — สำหรับสมาชิก Pro</p>
            </div>
          </div>
          <Link href="/pricing" className="flex items-center gap-2 bg-[#F4A940] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full font-semibold hover:bg-[#E09830] transition-colors shadow-md whitespace-nowrap text-sm md:text-base">
            <Star className="w-4 h-4 fill-white" />
            อัปเกรด Pro
          </Link>
        </div>

        {/* Moodboard - Saved Outfits */}
        {savedOutfits.length > 0 && (
          <div className="mb-8 md:mb-10">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Moodboard — ชุดที่บันทึกไว้</h2>
              <span className="text-xs md:text-sm text-gray-400 ml-2">({savedOutfits.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {savedOutfits.map((saved) => (
                <div
                  key={saved.id}
                  className="relative rounded-xl overflow-hidden shadow-md group aspect-[3/4]"
                >
                  <Image
                    src={saved.outfit?.image_url || "/asset/Shibuya Night Out.svg"}
                    alt={saved.outfit?.description || "Saved outfit"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <button
                    onClick={() => toggleSave(saved.outfit_id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-3 text-white">
                    <p className="text-xs line-clamp-1 font-medium">{getStyleName(saved.outfit?.style_tags || [])}</p>
                    <p className="text-[10px] text-white/60 mt-0.5">{saved.outfit?.destination_type} · {saved.outfit?.occasion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Header with Filters */}
        <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl lg:text-5xl text-gray-900">
            Outfits <span className="text-lg md:text-2xl lg:text-3xl font-base text-gray-500 ml-1 md:ml-2">ประจำทริป</span>
          </h1>

          {/* Destination Type Filters */}
          <div className="flex gap-1.5 md:gap-2 flex-wrap items-center">
            {destinationFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveDestination(filter.id)}
                className={`px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-full text-[11px] md:text-xs font-medium transition-all ${
                  activeDestination === filter.id
                    ? "bg-[#5A4A3D] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Occasion Filters */}
          <div className="flex gap-1.5 md:gap-2 flex-wrap items-center">
            <span className="text-[11px] md:text-xs text-gray-500 font-medium mr-0.5 md:mr-1">โอกาส:</span>
            {occasionFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveOccasion(filter.id)}
                className={`px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-full text-[11px] md:text-xs font-medium transition-all ${
                  activeOccasion === filter.id
                    ? "bg-[#C97D4E] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
            <div className="flex gap-1.5 md:gap-2 ml-2 md:ml-4">
              <button className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-brand flex items-center justify-center hover:bg-brand-dark transition-colors">
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Outfit Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        ) : filteredOutfits.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-base md:text-lg">ไม่พบ Outfit ที่ตรงกับตัวกรอง</p>
            <p className="text-xs md:text-sm mt-2">ลองเปลี่ยนตัวกรองดู</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
            {filteredOutfits.map((outfit) => (
              <div
                key={outfit.id}
                onClick={() => handleCardClick(outfit)}
                className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group aspect-[3/4]"
              >
                <Image
                  src={outfit.image_url || "/asset/Shibuya Night Out.svg"}
                  alt={outfit.description || "Outfit"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Free user PRO badge */}
                {userTier !== "pro" && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] md:text-xs px-2 py-0.5 md:px-2.5 md:py-1 rounded-full font-medium">
                    <Crown className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    PRO
                  </div>
                )}

                {/* Free user lock overlay on hover */}
                {userTier !== "pro" && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <Lock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Save button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(outfit.id); }}
                  className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isSaved(outfit.id) ? "text-red-500 fill-red-500" : "text-white"}`} />
                </button>

                {/* Style name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 text-white">
                  <h3 className="text-sm md:text-lg font-bold drop-shadow-lg">{getStyleName(outfit.style_tags)}</h3>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px] md:text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{outfit.destination_type}</span>
                    <span className="text-[10px] md:text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{outfit.occasion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partner Section */}
        <div className="mt-8 md:mt-12">
          <h2 className="text-lg md:text-xl text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
            ช้อปเพิ่มเติมจาก Partner
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#C97B47]" />
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-[#C97D4E] rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-md"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                  {partner.logo ? (
                    <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
                  ) : (
                    <span className="text-xl md:text-2xl font-bold text-white">{partner.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-base md:text-lg">{partner.name}</h3>
                  <p className="text-xs md:text-sm text-white/80 mt-0.5 truncate">{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedOutfit && (
        <OutfitDetailModal
          outfit={selectedOutfit}
          isSaved={isSaved(selectedOutfit.id)}
          onToggleSave={() => toggleSave(selectedOutfit.id)}
          onClose={() => setSelectedOutfit(null)}
        />
      )}
      {showProPopup && (
        <ProUpgradePopup
          onClose={() => setShowProPopup(false)}
          onUpgrade={() => { setShowProPopup(false); window.location.href = (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/pricing"; }}
        />
      )}
    </div>
  );
}
