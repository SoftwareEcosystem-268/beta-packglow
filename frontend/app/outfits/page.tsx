"use client";

import Navbar from "@/components/Navbar";
import { ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react";
import { useState } from "react";

const filters = [
  { id: "all", label: "ทั้งหมด" },
  { id: "day", label: "กลางวัน" },
  { id: "night", label: "กลางคืน" },
  { id: "activity", label: "กิจกรรม" },
];

const outfits = [
  {
    id: 1,
    day: "วันที่ 1",
    title: "Shibuya Night Out",
    image: "/asset/Shibuya Night Out.svg",
    category: "night",
  },
  {
    id: 2,
    day: "วันที่ 2",
    title: "Asakusa Temple Visit",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop",
    category: "day",
  },
  {
    id: 3,
    day: "วันที่ 3",
    title: "Shinjuku Garden Picnic",
    image: "/asset/shiuku.png",
    category: "activity",
  },
];

const partners = [
  { id: 1, name: "Uniqlo", description: "เสื้อผ้าคุณภาพ ใส่ง่าย", logo: "/asset/logo-Uniqlo.svg" },
  { id: 2, name: "H&M", description: "ชุดทันสมัย ราคาย่อมเยา", logo: "/asset/logo-H&M.svg" },
  { id: 3, name: "Airbnb", description: "ที่พักโลคอลใน Tokyo", logo: "/asset/logo-airbnb.svg" },
];

export default function OutfitsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredOutfits = activeFilter === "all"
    ? outfits
    : outfits.filter(o => o.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar variant="light" />

      <main className="px-6 md:px-12 lg:px-16 py-8">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-[#6B5B4D] to-[#5A4A3D] rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="flex items-center gap-4 text-center md:text-left">
            {/* Sparkle Icon */}
            <div className="w-14 h-14 bg-[#F4A940] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Outfit Moodboard & AI Smart Matching</h2>
              <p className="text-white/70 text-sm md:text-base">AI จับคู่ชุดกับสถานที่และสภาพอากาศ — สำหรับสมาชิก Pro</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#F4A940] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#E09830] transition-colors shadow-md whitespace-nowrap">
            <Star className="w-4 h-4 fill-white" />
            อัปเกรด Pro
          </button>
        </div>

        {/* Header with Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-5xl font-Playfair Display text-gray-900">
            Outfits <span className="text-3xl font-base text-gray-500 ml-2">ประจำทริป</span>
          </h1>

          {/* Filter Buttons with Arrows */}
          <div className="flex gap-2 flex-wrap items-center">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.id
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group aspect-[4/5]"
            >
              <img
                src={outfit.image}
                alt={outfit.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-sm text-white/80 mb-1">{outfit.day}</p>
                <h3 className="text-lg font-semibold">{outfit.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Section */}
        <div className="mt-12">
          <h2 className="text-xl font-TH Sarabun New text-gray-900 mb-6 flex items-center gap-2">
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
