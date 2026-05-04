"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Sparkles } from "lucide-react";
import { destCategories, destinations } from "@/lib/data/destinations";
import DestinationPackingModal, { type DestinationData } from "@/components/DestinationPackingModal";

export default function DestinationsSection() {
  const [destFilter, setDestFilter] = useState("all");
  const [destSearch, setDestSearch] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<DestinationData | null>(null);
  const [showPackingModal, setShowPackingModal] = useState(false);
  const destScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = destScrollRef.current;
    if (!el) return;
    let animId: number;
    const step = () => {
      el.scrollLeft += 0.5;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      }
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    const stop = () => cancelAnimationFrame(animId);
    const start = () => { animId = requestAnimationFrame(step); };
    el.addEventListener("mouseenter", stop);
    el.addEventListener("mouseleave", start);
    return () => { stop(); el.removeEventListener("mouseenter", stop); el.removeEventListener("mouseleave", start); };
  }, [destFilter]);

  const filteredDest = destinations.filter(d => {
    if (destFilter !== "all" && d.category !== destFilter) return false;
    if (destSearch && !d.name.toLowerCase().includes(destSearch.toLowerCase()) && !d.location.toLowerCase().includes(destSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <section id="destinations" className="px-4 md:px-8 lg:px-24 py-10 md:py-20 max-w-7xl mx-auto">
        <div className="mb-4 md:mb-6">
          <div className="inline-block">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-1.5">Destinations</h2>
            <div className="w-full h-px bg-brand" />
          </div>
          <p className="text-brand text-xs md:text-sm font-light mt-2">เลือกแล้วเราจะช่วยวางแผนทุกอย่างให้คุณ</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap mb-4">
          {destCategories.map(c => (
            <button key={c.id} onClick={() => setDestFilter(c.id)} className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${destFilter === c.id ? "bg-brand text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="mb-6 md:mb-8">
          <input
            type="text"
            placeholder="ค้นหาสถานที่..."
            value={destSearch}
            onChange={(e) => setDestSearch(e.target.value)}
            className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>
        <div ref={destScrollRef} className="flex gap-4 md:gap-6 overflow-hidden">
          {filteredDest.length > 0 ? (
            [...filteredDest, ...filteredDest].map((d, i) => (
              <div key={`${d.id}-${i}`} className="flex-shrink-0 w-56 md:w-72 group cursor-pointer" onClick={() => { setSelectedDestination(d); setShowPackingModal(true); }}>
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${d.image}')`, backgroundColor: "#e5e5e5" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">{d.name}</h3>
                    <div className="flex items-center gap-1 text-white/80"><MapPin className="w-4 h-4" /><span className="text-sm">{d.location}</span></div>
                  </div>
                </div>
              </div>
            ))
          ) : destSearch.trim() ? (
            <div
              className="flex-shrink-0 w-56 md:w-72 group cursor-pointer"
              onClick={() => {
                setSelectedDestination({
                  id: "custom",
                  name: destSearch.trim(),
                  location: destSearch.trim(),
                  image: "",
                  category: "city",
                  destinationType: "" as const,
                  suggestedActivities: [],
                  climate: "",
                  description: "สร้างรายการจัดกระเป๋าสำหรับ " + destSearch.trim(),
                  isCustom: true,
                });
                setShowPackingModal(true);
              }}
            >
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-br from-brand to-brand-dark">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <Sparkles className="w-10 h-10 text-white/80 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">สร้างทริปไป</h3>
                  <p className="text-lg font-semibold text-white/90">{destSearch.trim()}</p>
                  <p className="text-xs text-white/60 mt-3">คลิกเพื่อเลือกประเภทและสร้างรายการ</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {showPackingModal && selectedDestination && (
        <DestinationPackingModal
          destination={selectedDestination}
          onClose={() => { setShowPackingModal(false); setSelectedDestination(null); }}
        />
      )}
    </>
  );
}
