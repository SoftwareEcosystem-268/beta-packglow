"use client";

import { X, Heart, Calendar, Palette } from "lucide-react";
import Image from "next/image";
import { Outfit } from "@/lib/api";

const styleNameMap: Record<string, string> = {
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

const seasonMap: Record<string, { label: string; color: string }> = {
  summer: { label: "Summer", color: "bg-amber-100 text-amber-700" },
  winter: { label: "Winter", color: "bg-blue-100 text-blue-700" },
  spring: { label: "Spring", color: "bg-green-100 text-green-700" },
  autumn: { label: "Autumn", color: "bg-orange-100 text-orange-700" },
  all_season: { label: "All Season", color: "bg-gray-100 text-gray-700" },
};

const occasionMap: Record<string, string> = {
  day: "กลางวัน",
  night: "กลางคืน",
  formal: "ทางการ",
  casual: "ลำลอง",
};

const destMap: Record<string, string> = {
  beach: "ชายหาด",
  mountain: "ภูเขา",
  city: "เมือง",
  abroad: "ต่างประเทศ",
  ceremony: "พิธีการ",
};

const moodToneMap: Record<string, { palette: string[]; label: string }> = {
  summer: { palette: ["#F9E4B7", "#F6D7A7", "#87CEEB", "#FFFFFF", "#F0E68C"], label: "สดใส สบายตา" },
  winter: { palette: ["#2C3E50", "#4A4A4A", "#95A5A6", "#BDC3C7", "#ECF0F1"], label: "อบอุ่น เข้มขึ้น" },
  spring: { palette: ["#FFB6C1", "#FFC0CB", "#98FB98", "#F5FFFA", "#E6E6FA"], label: "สดใส อ่อนโยน" },
  autumn: { palette: ["#D2691E", "#CD853F", "#DEB887", "#F5DEB3", "#8B4513"], label: "อบอุ่น มิติดี" },
  all_season: { palette: ["#FFFFFF", "#F5F5F5", "#808080", "#000000", "#C0C0C0"], label: "คลาสสิก ใส่ได้ทุกฤดู" },
};

function getStyleName(tags: string[]): string {
  if (tags.length === 0) return "Everyday Style";
  const primary = styleNameMap[tags[0]] || tags[0];
  if (tags.length >= 2 && tags[0] === "casual") {
    const secondary = styleNameMap[tags[1]];
    if (secondary) return secondary;
  }
  return primary;
}

type Props = {
  outfit: Outfit;
  isSaved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
};

export default function OutfitDetailModal({ outfit, isSaved, onToggleSave, onClose }: Props) {
  const styleName = getStyleName(outfit.style_tags);
  const season = seasonMap[outfit.season] || seasonMap.all_season;
  const mood = moodToneMap[outfit.season] || moodToneMap.all_season;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header Image */}
        <div className="relative h-80 md:h-96 rounded-t-3xl overflow-hidden">
          <Image
            src={outfit.image_url || "/asset/Shibuya Night Out.svg"}
            alt={outfit.description || "Outfit"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <button onClick={onToggleSave} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
            <Heart className={`w-5 h-5 ${isSaved ? "text-red-500 fill-red-500" : "text-white"}`} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl font-bold text-white mb-1">{styleName}</h2>
            <p className="text-white/70 text-sm">{outfit.destination_type} · {outfit.occasion}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {outfit.style_tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium">
                {styleNameMap[tag] || tag}
              </span>
            ))}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${season.color}`}>
              {season.label}
            </span>
            {outfit.weather_condition && (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                {outfit.weather_condition}
              </span>
            )}
          </div>

          {/* Style Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">คำอธิบายสไตล์</h3>
            <p className="text-gray-800 leading-relaxed">{outfit.description}</p>
          </div>

          {/* Mood & Tone */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Mood & Tone
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {mood.palette.map((color, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl border border-gray-200" style={{ backgroundColor: color }} />
                ))}
              </div>
              <span className="text-sm text-gray-600">{mood.label}</span>
            </div>
          </div>

          {/* Occasion */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              โอกาสที่เหมาะสม
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm">
                {occasionMap[outfit.occasion] || outfit.occasion}
              </span>
              <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm">
                {destMap[outfit.destination_type] || outfit.destination_type}
              </span>
              {outfit.gender && (
                <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm">
                  {outfit.gender === "unisex" ? "Unisex" : outfit.gender === "male" ? "ผู้ชาย" : "ผู้หญิง"}
                </span>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={onToggleSave}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
              isSaved
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : "bg-brand text-white hover:bg-brand-dark"
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-red-500" : ""}`} />
            {isSaved ? "นำออกจาก Moodboard" : "บันทึกใส่ Moodboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
