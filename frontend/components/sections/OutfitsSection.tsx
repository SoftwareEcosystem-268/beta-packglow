"use client";

import { useState } from "react";
import { Heart, Crown, Loader2, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useOutfits } from "@/components/OutfitContext";
import { outfitFilters, outfitStyleNameMap, outfitDestFilters } from "@/lib/data/outfits";
import { partners } from "@/lib/data/partners";
import OutfitDetailModal from "@/components/OutfitDetailModal";

interface OutfitsSectionProps {
  isPro: boolean;
  setShowProPopup: (show: boolean) => void;
}

export default function OutfitsSection({ isPro, setShowProPopup }: OutfitsSectionProps) {
  const { outfits: apiOutfits, savedOutfits, loading: outfitsLoading, toggleSave: toggleOutfitSave, isSaved: isOutfitSaved } = useOutfits();
  const [outfitFilter, setOutfitFilter] = useState("all");
  const [outfitDestFilter, setOutfitDestFilter] = useState("all");
  const [selectedOutfit, setSelectedOutfit] = useState<typeof apiOutfits[number] | null>(null);

  const filteredOutfits = apiOutfits.filter(o => {
    if (outfitFilter !== "all" && o.occasion !== outfitFilter) return false;
    if (outfitDestFilter !== "all" && o.destination_type !== outfitDestFilter) return false;
    return true;
  });

  return (
    <>
      <section id="outfits" className="px-4 md:px-8 lg:px-24 py-10 md:py-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 mb-3 md:mb-4">
          <h2 className="text-xl md:text-3xl lg:text-5xl text-gray-900">Outfits <span className="text-lg md:text-2xl lg:text-3xl font-base text-gray-500 ml-1 md:ml-2">ประจำทริป</span></h2>
          <div className="flex gap-1.5 md:gap-2 flex-wrap items-center">
            {outfitFilters.map(f => (
              <button key={f.id} onClick={() => setOutfitFilter(f.id)} className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-sm font-medium transition-all ${outfitFilter === f.id ? "bg-brand text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Type Filters */}
        <div className="flex gap-1.5 md:gap-2 flex-wrap items-center mb-6 md:mb-8">
          {outfitDestFilters.map(f => (
            <button key={f.id} onClick={() => setOutfitDestFilter(f.id)} className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[11px] md:text-xs font-medium transition-all ${outfitDestFilter === f.id ? "bg-[#5A4A3D] text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Moodboard - Saved Outfits */}
        {savedOutfits.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h3 className="text-lg font-bold text-gray-900">Moodboard — ชุดที่บันทึกไว้</h3>
              <span className="text-sm text-gray-400 ml-2">({savedOutfits.length})</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {savedOutfits.map((saved) => (
                <div key={saved.id} className="relative rounded-xl overflow-hidden shadow-md group aspect-[3/4]">
                  <Image
                    src={saved.outfit?.image_url || "/asset/Shibuya Night Out.svg"}
                    alt={saved.outfit?.description || "Saved outfit"}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <button
                    onClick={() => toggleOutfitSave(saved.outfit_id)}
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
          {outfitsLoading ? (
            <div className="col-span-full flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>
          ) : filteredOutfits.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              <p>ยังไม่มี Outfit suggestions</p>
            </div>
          ) : (
            filteredOutfits.map(o => {
              const styleName = o.style_tags.length >= 2 && o.style_tags[0] === "casual"
                ? (outfitStyleNameMap[o.style_tags[1]] || outfitStyleNameMap[o.style_tags[0]] || "Everyday Style")
                : (outfitStyleNameMap[o.style_tags[0]] || "Everyday Style");
              return (
                <div
                  key={o.id}
                  onClick={() => { isPro ? setSelectedOutfit(o) : setShowProPopup(true); }}
                  className={`relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group aspect-[3/4] md:aspect-[4/5] ${!isPro ? "ring-1 ring-gray-200" : "hover:ring-2 hover:ring-brand/50"} transition-all duration-300`}
                >
                  <Image src={o.image_url || "/asset/Shibuya Night Out.svg"} alt={o.description || "Outfit"} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {!isPro && (
                    <div className="absolute top-2 md:top-4 left-2 md:left-4 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1 md:gap-1.5 shadow-sm">
                      <Crown className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand" />
                      <span className="text-[10px] md:text-xs font-bold text-gray-700">PRO</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); if (isPro) toggleOutfitSave(o.id); else setShowProPopup(true); }}
                    className={`absolute top-2 md:top-4 right-2 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${isPro ? "bg-white/20 hover:bg-white/40" : "bg-white/10"}`}
                  >
                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isPro && isOutfitSaved(o.id) ? "text-red-500 fill-red-500" : "text-white/80"}`} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-5 text-white">
                    <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">{styleName}</h3>
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className="text-[10px] md:text-xs bg-white/20 px-1.5 md:px-2 py-0.5 rounded-full">{o.occasion}</span>
                      {o.weather_condition && <span className="text-[10px] md:text-xs bg-white/20 px-1.5 md:px-2 py-0.5 rounded-full">{o.weather_condition}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <h3 className="text-base md:text-xl text-gray-900 mb-4 md:mb-6 flex items-center gap-2">ช้อปเพิ่มเติมจาก Partner <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-brand" /></h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
          {partners.map(p => (
            <div key={p.id} className="bg-brand rounded-2xl p-4 md:p-6 flex items-center gap-3 md:gap-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-md">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                {p.logo ? <Image src={p.logo} alt={p.name} fill className="w-full h-full object-contain" /> : <span className="text-2xl font-bold text-white">{p.name.charAt(0)}</span>}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-lg">{p.name}</h4>
                <p className="text-sm text-white/80 mt-0.5">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedOutfit && (
        <OutfitDetailModal
          outfit={selectedOutfit}
          isSaved={isOutfitSaved(selectedOutfit.id)}
          onToggleSave={() => toggleOutfitSave(selectedOutfit.id)}
          onClose={() => setSelectedOutfit(null)}
        />
      )}
    </>
  );
}
