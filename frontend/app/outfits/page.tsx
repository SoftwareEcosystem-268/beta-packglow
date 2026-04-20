"use client";

import Navbar from "@/components/Navbar";
import { useOutfits } from "@/components/OutfitContext";
import { ChevronLeft, ChevronRight, Star, Sparkles, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

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

export default function OutfitsPage() {
  const { outfits, savedOutfits, loading, toggleSave, isSaved } = useOutfits();
  const [activeOccasion, setActiveOccasion] = useState("all");
  const [activeDestination, setActiveDestination] = useState("all");

  const filteredOutfits = outfits.filter((o) => {
    if (activeOccasion !== "all" && o.occasion !== activeOccasion) return false;
    if (activeDestination !== "all" && o.destination_type !== activeDestination) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar variant="light" />

      <main className="px-6 md:px-12 lg:px-16 py-8">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-[#6B5B4D] to-[#5A4A3D] rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 bg-[#F4A940] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Outfit Moodboard & AI Smart Matching</h2>
              <p className="text-white/70 text-sm md:text-base">AI จับคู่ชุดกับการเดินทางและสภาพอากาศ — สำหรับสมาชิก Pro</p>
            </div>
          </div>
          <Link href="/pricing" className="flex items-center gap-2 bg-[#F4A940] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#E09830] transition-colors shadow-md whitespace-nowrap">
            <Star className="w-4 h-4 fill-white" />
            อัปเกรด Pro
          </Link>
        </div>

        {/* Moodboard - Saved Outfits */}
        {savedOutfits.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-xl font-bold text-gray-900">Moodboard — ชุดที่บันทึกไว้</h2>
              <span className="text-sm text-gray-400 ml-2">({savedOutfits.length})</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {savedOutfits.map((saved) => (
                <div
                  key={saved.id}
                  className="relative rounded-xl overflow-hidden shadow-md group aspect-[3/4]"
                >
                  <img
                    src={saved.outfit?.image_url || "/asset/Shibuya Night Out.svg"}
                    alt={saved.outfit?.description || "Saved outfit"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <button
                    onClick={() => toggleSave(saved.outfit_id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="text-xs line-clamp-2 font-medium">{saved.outfit?.description || "Outfit"}</p>
                    <p className="text-[10px] text-white/60 mt-1">{saved.outfit?.destination_type} · {saved.outfit?.occasion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Header with Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-2xl md:text-5xl text-gray-900">
            Outfits <span className="text-3xl font-base text-gray-500 ml-2">ประจำทริป</span>
          </h1>

          {/* Destination Type Filters */}
          <div className="flex gap-2 flex-wrap items-center">
            {destinationFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveDestination(filter.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-500 font-medium mr-1">โอกาส:</span>
            {occasionFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveOccasion(filter.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeOccasion === filter.id
                    ? "bg-[#C97D4E] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
            <div className="flex gap-2 ml-4">
              <button className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center hover:bg-brand-dark transition-colors">
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
            <p className="text-lg">ไม่พบ Outfit ที่ตรงกับตัวกรอง</p>
            <p className="text-sm mt-2">ลองเปลี่ยนตัวกรองดู</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredOutfits.map((outfit) => (
              <div
                key={outfit.id}
                className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group aspect-[4/5]"
              >
                <img
                  src={outfit.image_url || "/asset/Shibuya Night Out.svg"}
                  alt={outfit.description || "Outfit"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* Save button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(outfit.id); }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isSaved(outfit.id) ? "text-red-500 fill-red-500" : "text-white"}`} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{outfit.destination_type}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{outfit.occasion}</span>
                    {outfit.weather_condition && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{outfit.weather_condition}</span>}
                  </div>
                  <h3 className="text-lg font-semibold">{outfit.description || `${outfit.destination_type} - ${outfit.occasion}`}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {outfit.gender && <span className="text-xs text-white/50">{outfit.gender}</span>}
                    {outfit.season && <span className="text-xs text-white/50">· {outfit.season}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partner Section */}
        <div className="mt-12">
          <h2 className="text-xl text-gray-900 mb-6 flex items-center gap-2">
            ช้อปเพิ่มเติมจาก Partner
            <ChevronRight className="w-5 h-5 text-[#C97B47]" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-[#C97D4E] rounded-2xl p-6 flex items-center gap-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-md"
              >
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{partner.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">{partner.name}</h3>
                  <p className="text-sm text-white/80 mt-0.5">{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
