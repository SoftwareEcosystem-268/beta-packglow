"use client";

import { X, MapPin, Clock, Loader2, Check, ChevronDown, ChevronUp, Wind, Droplets, Thermometer, Umbrella } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { generatePackingList, getWeather, type PackingAssistantResponse, type WeatherData } from "@/lib/api";

export interface DestinationData {
  id: number | string;
  name: string;
  location: string;
  image: string;
  category: string;
  destinationType: "beach" | "mountain" | "city" | "abroad" | "ceremony" | "";
  suggestedActivities: string[];
  climate: string;
  description: string;
  isCustom?: boolean;
}

interface DestinationPackingModalProps {
  destination: DestinationData;
  onClose: () => void;
}

const ACTIVITY_LABELS: Record<string, string> = {
  photography: "ถ่ายรูป",
  swimming: "ว่ายน้ำ",
  snorkeling: "ดำน้ำตื้น",
  diving: "ดำน้ำลึก",
  hiking: "เดินป่า",
  dinner: "ดินเนอร์",
  shopping: "ช้อปปิ้ง",
  cycling: "ปั่นจักรยาน",
  temple: "วัด/ศาสนสถาน",
  yoga: "โยคะ",
  camping: "แคมป์ปิ้ง",
  skiing: "สกี",
  business: "ธุรกิจ",
};

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  clothes: { label: "เสื้อผ้า", icon: "👕" },
  personal: { label: "ของใช้ส่วนตัว", icon: "🧴" },
  health: { label: "ยาและสุขภาพ", icon: "💊" },
  electronics: { label: "อุปกรณ์อิเล็กทรอนิกส์", icon: "🔌" },
  documents: { label: "เอกสาร", icon: "📄" },
  others: { label: "อื่น ๆ", icon: "🎒" },
};

const DEST_TYPE_OPTIONS = [
  { value: "beach", label: "ชายหาด" },
  { value: "mountain", label: "ภูเขา" },
  { value: "city", label: "เมือง" },
  { value: "abroad", label: "ต่างประเทศ" },
  { value: "ceremony", label: "พิธีการ" },
] as const;

const ALL_ACTIVITIES = Object.keys(ACTIVITY_LABELS);

export default function DestinationPackingModal({ destination, onClose }: DestinationPackingModalProps) {
  const [duration, setDuration] = useState(3);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PackingAssistantResponse | null>(null);
  const [error, setError] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const [customDestType, setCustomDestType] = useState<"beach" | "mountain" | "city" | "abroad" | "ceremony">(
    (destination.destinationType as "beach" | "mountain" | "city" | "abroad" | "ceremony") || "city"
  );

  const isCustom = destination.isCustom || !destination.destinationType;
  const activeDestType: "beach" | "mountain" | "city" | "abroad" | "ceremony" = isCustom ? customDestType : (destination.destinationType as "beach" | "mountain" | "city" | "abroad" | "ceremony");
  const availableActivities = isCustom ? ALL_ACTIVITIES : destination.suggestedActivities;

  const fetchWeather = (city: string) => {
    setWeatherLoading(true);
    getWeather(activeDestType, city || destination.location)
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setWeatherLoading(false));
  };

  useEffect(() => {
    setWeatherLoading(true);
    getWeather(activeDestType, destination.location)
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setWeatherLoading(false));
  }, [activeDestType, destination.location]);

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await generatePackingList({
        destination_type: activeDestType,
        duration_days: duration,
        activities: selectedActivities,
        user_tier: "free",
      });
      setResult(res);
      // Expand all categories by default
      const expanded: Record<string, boolean> = {};
      Object.keys(res.packing_list).forEach((k) => { expanded[k] = true; });
      setExpandedCategories(expanded);
    } catch {
      setError("ไม่สามารถสร้างรายการได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const totalItems = result
    ? Object.values(result.packing_list).reduce((sum, items) => sum + items.length, 0)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with destination image */}
        <div className="relative h-48 flex-shrink-0">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Destination info */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-2xl font-bold text-white mb-1">{destination.name}</h2>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {destination.location}
              </div>
            </div>

            {/* Destination type selector for custom destinations */}
            {isCustom && !result && (
              <div className="mt-3 flex flex-wrap gap-2">
                {DEST_TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setCustomDestType(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      customDestType === opt.value
                        ? "bg-white text-gray-900"
                        : "bg-white/20 text-white/80 hover:bg-white/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            {/* Weather Widget */}
            {weather && !weatherLoading && (
              <div className="mt-2 bg-white/10 backdrop-blur-sm rounded-lg p-2.5 flex items-center gap-4 text-xs text-white/90">
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>{weather.temp_c}°C (รู้สึก {weather.feels_like_c}°C)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>ความชื้น {weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Umbrella className="w-3.5 h-3.5" />
                  <span>โอกาสฝน {weather.rain_chance}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5" />
                  <span>{weather.condition_th}</span>
                </div>
              </div>
            )}
            <p className="text-white/70 text-sm mt-1">{destination.description}</p>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {!result ? (
            /* === FORM STATE === */
            <div className="p-5 space-y-5">
              {/* City search for weather */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                  เมืองที่ต้องการดูสภาพอากาศ
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && customCity.trim()) fetchWeather(customCity.trim()); }}
                    placeholder={destination.location}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                  <button
                    onClick={() => fetchWeather(customCity.trim() || destination.location)}
                    disabled={weatherLoading}
                    className="px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
                  >
                    {weatherLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "ค้นหา"}
                  </button>
                </div>
              </div>

              {/* Weather clothing tips */}
              {weather && weather.clothing_tips.length > 0 && (
                <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-3.5">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4" />
                    คำแนะนำจากสภาพอากาศ ({weather.condition_th}, {weather.temp_c}°C)
                  </h4>
                  <ul className="space-y-1">
                    {weather.clothing_tips.map((tip, i) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">&#8226;</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                  จำนวนวันเดินทาง
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDuration((d) => Math.max(1, d - 1))}
                    className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">{duration}</span>
                  <button
                    onClick={() => setDuration((d) => Math.min(90, d + 1))}
                    className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-bold"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">วัน</span>
                </div>
              </div>

              {/* Activities */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  กิจกรรมที่สนใจ
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableActivities.map((activity) => {
                    const isSelected = selectedActivities.includes(activity);
                    return (
                      <button
                        key={activity}
                        onClick={() => toggleActivity(activity)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-brand text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {ACTIVITY_LABELS[activity] || activity}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-brand text-white font-bold text-base hover:bg-brand-dark transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    กำลังสร้างรายการ...
                  </>
                ) : (
                  "สร้างรายการจัดกระเป๋า"
                )}
              </button>
            </div>
          ) : (
            /* === RESULTS STATE === */
            <div className="p-5 space-y-4">
              {/* Summary */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">รายการจัดกระเป๋า</h3>
                  <p className="text-sm text-gray-500">
                    {destination.name} · {duration} วัน · {totalItems} รายการ
                  </p>
                </div>
                <button
                  onClick={() => { setResult(null); setError(""); }}
                  className="text-sm text-brand font-medium hover:underline"
                >
                  สร้างใหม่
                </button>
              </div>

              {/* Packing categories */}
              <div className="space-y-2">
                {Object.entries(CATEGORY_LABELS).map(([key, { label, icon }]) => {
                  const items = result.packing_list[key as keyof typeof result.packing_list];
                  if (!items || items.length === 0) return null;
                  const isExpanded = expandedCategories[key] !== false;
                  return (
                    <div key={key} className="bg-gray-50 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleCategory(key)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span>{icon}</span>
                          <span className="font-semibold text-gray-800">{label}</span>
                          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                            {items.length}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-3 space-y-1.5">
                          {items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 py-1.5 px-3 bg-white rounded-lg">
                              <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-gray-300" />
                              </div>
                              <span className="text-sm text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Custom suggestions (if any) */}
              {result.custom_suggestions.length > 0 && (
                <div className="bg-brand/5 rounded-xl p-4">
                  <h4 className="font-semibold text-brand mb-2">คำแนะนำเพิ่มเติม</h4>
                  <ul className="space-y-1">
                    {result.custom_suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-brand mt-0.5">&#8226;</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outfit suggestions (if any) */}
              {result.outfits.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">แนะนำชุด</h4>
                  <div className="grid gap-3">
                    {result.outfits.map((outfit, i) => (
                      <div key={i} className="bg-white rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{outfit.name}</h5>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full capitalize">
                            {outfit.style}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {outfit.items.map((item, j) => (
                            <span key={j} className="text-xs bg-brand/10 text-brand px-2.5 py-1 rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{outfit.match_reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
