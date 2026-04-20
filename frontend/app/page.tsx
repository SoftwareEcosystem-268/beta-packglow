"use client";

import { usePacking } from "@/components/PackingContext";
import { useOutfits } from "@/components/OutfitContext";
import {
  ArrowRight, Calendar, MapPin, ChevronRight,
  Check, X, Plus, Star, Sparkles, User, Heart, Loader2, FolderOpen, Crown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import DestinationPackingModal, { type DestinationData } from "@/components/DestinationPackingModal";

/* ─── Destinations Data ─── */
const destCategories = [
  { id: "all", label: "ทั้งหมด" },
  { id: "beach", label: "ชายหาด" },
  { id: "city", label: "เมือง" },
  { id: "nature", label: "ธรรมชาติ" },
  { id: "culture", label: "วัฒนธรรม" },
];

const destinations: DestinationData[] = [
  { id: 1, name: "Monument of Berlin", location: "Berlin, Germany", image: "/asset/destinations/berlin.jpg", category: "city", destinationType: "city", suggestedActivities: ["photography", "shopping", "dinner", "cycling"], climate: "Continental", description: "เมืองประวัติศาสตร์ที่ผสมผสานสถาปัตยกรรมเก่าแก่กับศิลปะร่วมสมัย" },
  { id: 2, name: "Millennium Bridge", location: "London, UK", image: "/asset/destinations/london.jpg", category: "city", destinationType: "city", suggestedActivities: ["photography", "shopping", "dinner", "business"], climate: "Temperate", description: "เมืองหลวงที่เต็มไปด้วยวัฒนธรรม พิพิธภัณฑ์ และไลฟ์สไตล์ร่วมสมัย" },
  { id: 3, name: "Rialto Bridge", location: "Venice, Italy", image: "/asset/destinations/venice.jpg", category: "city", destinationType: "city", suggestedActivities: ["photography", "dinner", "shopping"], climate: "Mediterranean", description: "เมืองแห่งคลองที่โรแมนติก สถาปัตยกรรมเรเนสซองส์ และอาหารอิตาเลียน" },
  { id: 4, name: "Sea of Orange Roofs", location: "Lisbon, Portugal", image: "/asset/destinations/lisbon.jpg", category: "culture", destinationType: "city", suggestedActivities: ["photography", "hiking", "shopping", "dinner"], climate: "Mediterranean", description: "เมืองบนเนินเขาที่มีหลังคาสีส้ม ถนนหินทรุด และวัฒนธรรม Fado" },
  { id: 5, name: "Santorini Sunset", location: "Santorini, Greece", image: "/asset/destinations/santorini.jpg", category: "beach", destinationType: "beach", suggestedActivities: ["swimming", "photography", "dinner", "snorkeling"], climate: "Mediterranean", description: "เกาะทะเลสีคราม อาคารขาวบนหน้าผา พร้อมพระอาทิตย์ตกที่สวยที่สุดในโลก" },
  { id: 6, name: "Bali Rice Terraces", location: "Bali, Indonesia", image: "/asset/destinations/bali.jpg", category: "nature", destinationType: "mountain", suggestedActivities: ["swimming", "diving", "snorkeling", "temple", "yoga", "hiking"], climate: "Tropical", description: "ธรรมชาติเขตร้อน นาขั้นบันได วัดโบราณ และชีวิตที่เรียบง่าย" },
  { id: 7, name: "Tokyo Tower", location: "Tokyo, Japan", image: "/asset/destinations/tokyo.jpg", category: "city", destinationType: "city", suggestedActivities: ["photography", "shopping", "temple", "dinner"], climate: "Temperate", description: "เมืองที่ผสมผสานวัฒนธรรมดั้งเดิมกับเทคโนโลยีล้ำสมัย" },
  { id: 8, name: "Maldives Beach", location: "Maldives", image: "/asset/destinations/maldives.jpg", category: "beach", destinationType: "beach", suggestedActivities: ["swimming", "diving", "snorkeling", "photography"], climate: "Tropical", description: "น้ำทะเลใสระดับ world-class ชายหาดทรายขาว และวิลล่าริมน้ำ" },
];

/* ─── Packing Data ─── */
const packingCategories = [
  { id: "all", label: "ทั้งหมด" },
  { id: "clothes", label: "เสื้อผ้า" },
  { id: "personal", label: "ของใช้ส่วนตัว" },
  { id: "health", label: "ยาและสุขภาพ" },
  { id: "electronics", label: "อุปกรณ์อิเล็กทรอนิกส์" },
  { id: "documents", label: "เอกสาร" },
  { id: "others", label: "อื่น ๆ" },
];

const outfitFilters = [
  { id: "all", label: "ทั้งหมด" },
  { id: "day", label: "กลางวัน" },
  { id: "night", label: "กลางคืน" },
  { id: "formal", label: "ทางการ" },
  { id: "casual", label: "ลำลอง" },
];

const outfitDestFilters = [
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

/* ─── Pricing Data ─── */
const freeFeatures = [
  { name: "Destination Picker", included: true },
  { name: "Basic Packing List", included: true },
  { name: "Custom Checklist", included: false },
  { name: "Outfit Moodboard", included: false },
  { name: "AI Smart Matching", included: false },
];

const proFeatures = [
  { name: "ฟีเจอร์ Free ทั้งหมด", included: true },
  { name: "Custom Checklist ไม่จำกัด", included: true },
  { name: "Outfit Moodboard", included: true },
  { name: "AI Smart Matching", included: true },
  { name: "บันทึกทริปไม่จำกัด", included: true },
  { name: "Priority Support", included: true },
];

/* ─── Helper ─── */
function getCategoryStats(categoryId: string, items: Record<string, { is_packed: boolean }[]>) {
  if (categoryId === "all") {
    let total = 0, completed = 0;
    Object.values(items).forEach(ci => { total += ci.length; completed += ci.filter(i => i.is_packed).length; });
    return { completed, total };
  }
  const ci = items[categoryId] || [];
  return { completed: ci.filter(i => i.is_packed).length, total: ci.length };
}

/* ─── Main Page ─── */
export default function Home() {
  const router = useRouter();
  const { items: packingItems, togglePacked, addCustomItemToTrip, removeChecklistItem,
    isDirty, saving, saveChecklist, totalItemCount,
    templates, refreshTemplates, saveAsTemplate, loadTemplate, removeTemplate,
    generatedResult, generating, generateSmartList } = usePacking();
  const { outfits: apiOutfits, savedOutfits, loading: outfitsLoading, toggleSave: toggleOutfitSave, isSaved: isOutfitSaved } = useOutfits();
  const { user, logout } = useAuth();
  const [userTier, setUserTier] = useState<"free" | "pro">("free");
  useEffect(() => {
    const saved = (localStorage.getItem("pg_user_tier") as "free" | "pro") || "free";
    if (saved !== "free") setUserTier(saved);
    const onStorage = () => {
      setUserTier((localStorage.getItem("pg_user_tier") as "free" | "pro") || "free");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const isPro = userTier === "pro";  const [destination, setDestination] = useState("Tokyo");
  const [person, setPerson] = useState("2");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [destFilter, setDestFilter] = useState("all");
  const [activePackCat, setActivePackCat] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [outfitFilter, setOutfitFilter] = useState("all");
  const [outfitDestFilter, setOutfitDestFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const destScrollRef = useRef<HTMLDivElement>(null);

  // AI Stylist state
  const [stylistOpen, setStylistOpen] = useState(false);
  const [stylistData, setStylistData] = useState({
    location: "",
    weather: "hot",
    days: "3",
    activities: "",
    style: "casual",
    gender: "unisex",
  });
  const [stylistResult, setStylistResult] = useState<string | null>(null);
  const [stylistImages, setStylistImages] = useState<{day: string; night: string; activity: string} | null>(null);
  const [stylistLoading, setStylistLoading] = useState(false);

  // Save/Template state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateLoading, setTemplateLoading] = useState(false);
  const [showLoadDropdown, setShowLoadDropdown] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<DestinationData | null>(null);
  const [showPackingModal, setShowPackingModal] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ message: msg, type });

  const handleSaveChecklist = async () => {
    const ok = await saveChecklist();
    showToast(ok ? "บันทึก checklist สำเร็จ" : "บันทึกไม่สำเร็จ", ok ? "success" : "error");
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) return;
    setTemplateLoading(true);
    const ok = await saveAsTemplate(templateName.trim());
    setTemplateLoading(false);
    if (ok) {
      showToast(`บันทึกเทมเพลต "${templateName.trim()}" สำเร็จ`);
      setTemplateName("");
      setShowTemplateModal(false);
    } else {
      showToast("ไม่สามารถบันทึกเทมเพลตได้", "error");
    }
  };

  const handleOpenLoad = async () => {
    if (!showLoadDropdown) await refreshTemplates();
    setShowLoadDropdown(!showLoadDropdown);
  };

  const handleLoadTemplate = async (tpl: typeof templates[number]) => {
    setTemplateLoading(true);
    const ok = await loadTemplate(tpl);
    setTemplateLoading(false);
    setShowLoadDropdown(false);
    showToast(ok ? `โหลด "${tpl.name}" สำเร็จ` : "โหลดไม่สำเร็จ", ok ? "success" : "error");
  };

  const generateOutfitRecommendation = () => {
    if (!stylistData.location.trim()) return;
    setStylistLoading(true);
    setStylistResult(null);
    setStylistImages(null);
    setTimeout(() => {
      const weatherText: Record<string, string> = { hot: "ร้อน", cold: "หนาว", rain: "ฝน", variable: "แปรปรวน" };
      const styleText: Record<string, string> = { casual: "ลำลอง", minimal: "มินิมอล", street: "สตรีท", elegant: "หรูหรา", sporty: "สปอร์ต" };
      const genderText: Record<string, string> = { unisex: "", male: "ผู้ชาย", female: "ผู้หญิง" };

      // Set outfit images based on weather and style
      const outfitImages = {
        day: stylistData.weather === "cold"
          ? "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&h=500&fit=crop"
          : stylistData.weather === "rain"
          ? "https://images.unsplash.com/photo-1534309466160-70b22cc6252c?w=400&h=500&fit=crop"
          : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
        night: stylistData.style === "elegant"
          ? "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop"
          : stylistData.style === "street"
          ? "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop"
          : "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop",
        activity: stylistData.activities.toLowerCase().includes("ชายหาด") || stylistData.activities.toLowerCase().includes("beach")
          ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop"
          : stylistData.activities.toLowerCase().includes("เดินป่า") || stylistData.activities.toLowerCase().includes("hiking")
          ? "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop"
          : "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
      };
      setStylistImages(outfitImages);

      const result = `## 🌟 แนะนำชุดสำหรับทริป${stylistData.location} (${stylistData.days} วัน)

**สภาพอากาศ:** ${weatherText[stylistData.weather]} | **สไตล์:** ${styleText[stylistData.style]} ${genderText[stylistData.gender] ? `(${genderText[stylistData.gender]})` : ""}

---

### ☀️ ชุดกลางวัน - เที่ยวชมเมือง

**Look 1: Casual Explorer**
- **เสื้อ:** เสื้อยืดคอกลมสีขาว/เบจ ผ้าฝ้ายนุ่ม ระบายอากาศดี
- **กางเกง:** กางเกงยีนส์ตรงหรือ chinos สีครีม/น้ำเงินเข้ม
- **รองเท้า:** รองเท้าผ้าใบสีขาว สวมใส่ง่าย เดินสบาย
- **แอ็กเซสซอรี่:** แว่นกันแดด + กระเป๋าเป้ขนาดเล็ก

> 💡 **เหตุผล:** เหมาะกับการเดินเที่ยวตลอดวัน ระบายอากาศดี ดูเป็นธรรมชาติแต่ยังดีไซน์อยู่

**Look 2: Breezy Chic**
- **เสื้อ:** เสื้อเชิ้ตลายทางบางๆ หรือเสื้อคาร์ดิแกนเบาๆ
- **กางเกง:** กางเกงขาสั้นทรง A-line หรือขายาวตรง
- **รองเท้า:** รองเท้าแตะสไตล์มินิมอล หรือ loafers
- **แอ็กเซสซอรี่:** หมวกบักเก็ต + ผ้าพันคอเบาๆ

---

### 🌙 ชุดกลางคืน - ดินเนอร์ / บาร์

**Look 1: Evening Elegance**
- **เสื้อ:** เสื้อเชิ้ตสีดำ/เข้ม หรือเดรสแบบ simple
- **กางเกง:** กางเกงตรงสีดำ ทรงพอดีตัว
- **รองเท้า:** รองเท้าทำมือหรือ heels กึ่งทางการ
- **แอ็กเซสซอรี่:** นาฬิกาเรียบหรู + กระเป๋าครอสบอดี้

> 💡 **เหตุผล:** ดูหรูหราแต่ไม่เวอร์ เหมาะกับร้านอาหารและบาร์

---

### 🏖️ ชุดพิเศษ - ${stylistData.activities || "กิจกรรม"}

- **ชุดว่ายน้ำ:** บิกินี่หรือชุดว่ายน้ำสีโทนธรรมชาติ
- **คลุม:** เสื้อคลุมผ้าบาง หรือเสื้อเชิ้ตโอเวอร์ไซส์
- **กางเกง:** กางเกงขาสั้นทรงสูง
- **รองเท้า:** แตะยางสไตล์ retro

---

### 🔄 Mix & Match Tips

1. **เลือกโทนสีเบสิก:** ขาว, ดำ, เบจ, น้ำเงินเข้ม — มิกซ์กันง่าย
2. **เน้นผ้าระบายอากาศ:** ${weatherText[stylistData.weather] === "ร้อน" ? "เลือกผ้าฝ้าย/ลินิน" : weatherText[stylistData.weather] === "หนาว" ? "เพิ่มเสื้อกันหนาวเบาๆ" : "พกเสื้อคลุมกันฝนเบาๆ"}
3. **รองเท้า 2 คู่พอ:** ผ้าใบ + รองเท้าสำรอง (แตะหรือทำมือ)
4. **แอ็กเซสซอรี่มินิมอล:** แว่นกันแดด + นาฬิกา + กระเป๋าเล็ก

---

✨ **PackGlow AI Stylist** หวังว่าคุณจะสนุกกับทริปนี้นะคะ!`;
      setStylistResult(result);
      setStylistLoading(false);
    }, 1500);
  };

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Auto-scroll destinations carousel
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Select date";
    const d = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const suffix = ['st', 'nd', 'rd'][([1, 2, 3].includes(d.getDate() % 10) && ![11, 12, 13].includes(d.getDate())) ? d.getDate() % 10 - 1 : -1] || 'th';
    return `${days[d.getDay()]}, ${d.getDate()}${suffix} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const [addError, setAddError] = useState("");

  const addItem = async () => {
    if (!newItemName.trim() || activePackCat === "all") return;
    setAddError("");
    const ok = await addCustomItemToTrip(activePackCat, newItemName.trim());
    if (ok) {
      setNewItemName(""); setNewItemDesc(""); setShowAddForm(false);
    } else {
      setAddError("ไม่สามารถเพิ่มรายการได้ กรุณาลองใหม่");
    }
  };

  const togglePackItem = (id: string, packed: boolean) => {
    togglePacked(id, packed);
  };

  const deletePackItem = (id: string) => {
    removeChecklistItem(id);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const filteredDest = destFilter === "all" ? destinations : destinations.filter(d => d.category === destFilter);
  const filteredOutfits = apiOutfits.filter(o => {
    if (outfitFilter !== "all" && o.occasion !== outfitFilter) return false;
    if (outfitDestFilter !== "all" && o.destination_type !== outfitDestFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F3EF] overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 lg:px-24 py-5 bg-white/80 backdrop-blur-md shadow-sm">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
          <img src="/asset/logo-web.svg" alt="PackGlow" className="w-8 h-8 brightness-0" />
          <span className="text-2xl font-bold text-gray-900">PackGlow</span>
        </button>
        <nav className="hidden md:flex items-center gap-6">
          {[
            { id: "hero", label: "Home" },
            { id: "destinations", label: "Destinations" },
            { id: "packing", label: "Packing" },
            { id: "outfits", label: "Outfits" },
            { id: "pricing", label: "Pricing" },
          ].map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)} className="text-gray-700 font-medium hover:text-brand transition-colors">
              {s.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)} className="relative w-9 h-9 rounded-full bg-brand flex items-center justify-center hover:bg-brand-dark transition-colors">
                <User className="w-5 h-5 text-white" />
                {isPro ? (
                  <Crown className="absolute -top-1.5 -right-1.5 w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                ) : (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gray-300 border-2 border-white/80" />
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isPro ? "bg-brand" : "bg-gray-300"}`}>
                      {isPro ? <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" /> : <User className="w-4 h-4 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); router.push("/"); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 font-medium hover:text-brand transition-colors">Login</Link>
              <Link href="/signup"><Button className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-md font-medium">Sign Up</Button></Link>
            </>
          )}
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center">
        <div className="absolute inset-0 bg-center bg-no-repeat" style={{ backgroundImage: `url('/asset/first-page.png')`, backgroundSize: 'cover' }} />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-8 md:px-16 lg:px-24 pt-28">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6 leading-tight">
            Pack your bags.<br />Get dressed perfectly.<br /><span className="text-white">Look amazing on every trip.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-xl">The best travel for your journey begins now</p>
          <div className="mt-20 w-full md:w-2/3">
            <div className="bg-white rounded-r-2xl shadow-2xl flex items-stretch pl-8">
              <div className="px-6 py-5 flex flex-col justify-center">
                <label className="text-gray-700 text-xs font-bold tracking-widest mb-2">DESTINATION</label>
                <div className="border-b border-black pb-1">
                  <input type="text" value={destination} onChange={e => setDestination(e.target.value)} className="text-gray-800 font-medium text-sm bg-transparent outline-none w-full" />
                </div>
              </div>
              <div className="px-6 py-5 flex flex-col justify-center">
                <label className="text-gray-700 text-xs font-bold tracking-widest mb-2">PERSON</label>
                <div className="border-b border-black pb-1">
                  <input type="number" value={person} onChange={e => setPerson(e.target.value)} className="text-gray-800 font-medium text-sm bg-transparent outline-none w-full" min="1" />
                </div>
              </div>
              <div className="px-6 py-5 flex flex-col justify-center">
                <label className="text-gray-700 text-xs font-bold tracking-widest mb-2">CHECK-IN</label>
                <div className="flex items-center gap-2 border-b border-black pb-1 relative">
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <span className="text-gray-800 font-medium text-sm min-w-[150px]">{formatDate(checkIn)}</span>
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                </div>
              </div>
              <div className="px-6 py-5 flex flex-col justify-center">
                <label className="text-gray-700 text-xs font-bold tracking-widest mb-2">CHECK OUT</label>
                <div className="flex items-center gap-2 border-b border-black pb-1 relative">
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <span className="text-gray-800 font-medium text-sm min-w-[150px]">{formatDate(checkOut)}</span>
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                </div>
              </div>
              <button onClick={() => router.push(`/booking?destination=${encodeURIComponent(destination)}&person=${person}&checkIn=${checkIn}&checkOut=${checkOut}`)} className="ml-auto px-6 py-3 bg-brand hover:bg-brand-dark transition-colors rounded-r-2xl flex items-center justify-center gap-3 text-white font-bold">
                <div className="flex flex-col items-start leading-tight"><span className="text-lg">Book</span><span className="text-lg">Now</span></div>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DESTINATIONS ─── */}
      <section id="destinations" className="px-6 md:px-16 lg:px-24 py-20 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="inline-block">
            <h2 className="text-4xl font-serif text-gray-900 mb-1.5">Destinations</h2>
            <div className="w-full h-px bg-brand" />
          </div>
          <p className="text-brand text-sm font-light mt-2">เลือกแล้วเราจะช่วยวางแผนทุกอย่างให้คุณ</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap mb-8">
          {destCategories.map(c => (
            <button key={c.id} onClick={() => setDestFilter(c.id)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${destFilter === c.id ? "bg-brand text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>
              {c.label}
            </button>
          ))}
        </div>
        <div ref={destScrollRef} className="flex gap-6 overflow-hidden">
          {[...filteredDest, ...filteredDest].map((d, i) => (
            <div key={`${d.id}-${i}`} className="flex-shrink-0 w-72 group cursor-pointer" onClick={() => { setSelectedDestination(d); setShowPackingModal(true); }}>
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${d.image}')`, backgroundColor: "#e5e5e5" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-white mb-1">{d.name}</h3>
                  <div className="flex items-center gap-1 text-white/80"><MapPin className="w-4 h-4" /><span className="text-sm">{d.location}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PACKING ─── */}
      <section id="packing" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={generateSmartList}
              disabled={generating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> กำลังสร้างรายการ...</>
              ) : (
                "✨ สร้างรายการอัตโนมัติ"
              )}
            </button>
            <h2 className="text-4xl font-normal text-black underline decoration-brand underline-offset-12">Packing</h2>
          </div>
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
              <nav className="space-y-2">
                {packingCategories.map(c => {
                  const stats = getCategoryStats(c.id, packingItems);
                  return (
                    <button key={c.id} onClick={() => setActivePackCat(c.id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activePackCat === c.id ? "bg-brand text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>
                      <span className="font-medium">{c.label}</span>
                      <span className={`text-sm ${activePackCat === c.id ? "text-white/80" : "text-gray-400"}`}>{stats.completed}/{stats.total}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>
            {/* Main */}
            <div className="flex-1 max-w-2xl">
              {activePackCat === "all" ? (
                <div className="space-y-8">
                  {packingCategories.filter(c => c.id !== "all").map(cat => (
                    <div key={cat.id}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">{cat.label}</h3>
                      <div className="grid gap-3">
                        {(packingItems[cat.id] || []).map(item => (
                          <div key={item.id} className={`flex items-start gap-4 p-4 rounded-xl transition-all ${item.is_packed ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                            <div onClick={() => togglePackItem(item.id, item.is_packed)} className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer ${item.is_packed ? "bg-brand" : "border-2 border-gray-300"}`}>
                              {item.is_packed && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex-1 cursor-pointer" onClick={() => togglePackItem(item.id, item.is_packed)}>
                              <h4 className={`font-medium ${item.is_packed ? "text-gray-900" : "text-gray-700"}`}>{item.display_name}</h4>
                            </div>
                            <button onClick={() => deletePackItem(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 mt-0.5">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3">
                  {(packingItems[activePackCat] || []).map(item => (
                    <div key={item.id} className={`flex items-start gap-4 p-4 rounded-xl transition-all ${item.is_packed ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                      <div onClick={() => togglePackItem(item.id, item.is_packed)} className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer ${item.is_packed ? "bg-brand" : "border-2 border-gray-300"}`}>
                        {item.is_packed && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 cursor-pointer" onClick={() => togglePackItem(item.id, item.is_packed)}>
                        <h4 className={`font-medium ${item.is_packed ? "text-gray-900" : "text-gray-700"}`}>{item.display_name}</h4>
                      </div>
                      <button onClick={() => deletePackItem(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 mt-0.5">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {showAddForm ? (
                    <div className="p-4 rounded-xl border-2 border-brand bg-white space-y-3">
                      <input type="text" placeholder="ชื่อรายการ" value={newItemName} onChange={e => { setNewItemName(e.target.value); setAddError(""); }} onKeyDown={e => e.key === "Enter" && addItem()} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900" autoFocus />
                      <input type="text" placeholder="รายละเอียด (ไม่จำเป็น)" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900" />
                      {addError && <p className="text-sm text-red-500">{addError}</p>}
                      <div className="flex gap-2">
                        <button onClick={addItem} disabled={!newItemName.trim()} className="px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors disabled:opacity-40">เพิ่ม</button>
                        <button onClick={() => { setShowAddForm(false); setNewItemName(""); setNewItemDesc(""); }} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors">ยกเลิก</button>
                      </div>
                    </div>
                  ) : isPro ? (
                    <button onClick={() => setShowAddForm(true)} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand hover:text-brand transition-all">
                      <div className="w-6 h-6 rounded-md border-2 border-current flex items-center justify-center"><Plus className="w-4 h-4" /></div>
                      <span className="font-medium">เพิ่มรายการ</span>
                    </button>
                  ) : (
                    <button onClick={() => scrollTo("pricing")} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand hover:text-brand transition-all">
                      <div className="w-6 h-6 rounded-md border-2 border-current flex items-center justify-center"><Plus className="w-4 h-4" /></div>
                      <span className="font-medium">เพิ่มรายการ <span className="text-xs text-brand ml-1">PRO</span></span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Save / Template Bar */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {isDirty ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <span className="text-sm text-orange-600 font-medium">มีการเปลี่ยนแปลง</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">บันทึกแล้ว</span>
                </>
              )}
              <span className="text-xs text-gray-400 ml-2">{totalItemCount} รายการ</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleSaveChecklist}
                disabled={totalItemCount === 0 || saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "💾"}
                บันทึก Checklist
              </button>
              <button
                onClick={() => setShowTemplateModal(true)}
                disabled={totalItemCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5A4A3D] text-white font-bold hover:bg-[#4A3A2D] transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                📌 บันทึกเป็น Template
              </button>
              <div className="relative">
                <button
                  onClick={handleOpenLoad}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-brand text-brand font-bold hover:bg-brand hover:text-white transition-all"
                >
                  <FolderOpen className="w-4 h-4" />
                  ใช้เทมเพลต
                </button>
                {showLoadDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto">
                    {templates.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-gray-400 text-center">ยังไม่มีเทมเพลต</p>
                    ) : (
                      templates.map((tpl) => (
                        <div key={tpl.id} className="flex items-center gap-2 px-4 py-3 hover:bg-brand/5 transition-colors">
                          <button
                            onClick={() => handleLoadTemplate(tpl)}
                            disabled={templateLoading}
                            className="flex-1 text-left"
                          >
                            <p className="text-sm font-medium text-gray-800">{tpl.name}</p>
                            <p className="text-xs text-gray-400">{tpl.items.length} รายการ</p>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeTemplate(tpl.id); }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Name Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowTemplateModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">📌 บันทึกเป็น Template</h3>
            <input
              type="text"
              placeholder="ตั้งชื่อ template..."
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTemplate()}
              className="w-full px-4 py-3 rounded-xl border-2 border-brand/40 focus:outline-none focus:border-brand text-gray-900"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim() || templateLoading}
                className="flex-1 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-colors disabled:opacity-40"
              >
                {templateLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "บันทึก"}
              </button>
              <button
                onClick={() => { setShowTemplateModal(false); setTemplateName(""); }}
                className="px-6 py-3 rounded-xl bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white font-medium text-sm z-50 transition-all ${
          toast.type === "success" ? "bg-green-600" : "bg-red-500"
        }`}>
          {toast.type === "success" && <span className="mr-2">✓</span>}
          {toast.type === "error" && <span className="mr-2">✕</span>}
          {toast.message}
        </div>
      )}

      {/* Free user: show locked PRO features */}
      {!isPro && (
        <section className="bg-[#F5F3EF] py-16">
          <div className="max-w-6xl mx-auto px-6 md:px-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 rounded-full bg-gray-400 text-white text-xs font-bold">PRO</span>
              <h2 className="text-2xl font-bold text-gray-900">อัปเกรดเพื่อปลดล็อคฟีเจอร์เพิ่มเติม</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-md relative opacity-80">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Custom Checklist</h3>
                <p className="text-sm text-gray-500">รายการตามกิจกรรมแบบเฉพาะเจาะจง — hiking, swimming, dinner และอื่นๆ</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md relative opacity-80">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Outfit Moodboard</h3>
                <p className="text-sm text-gray-500">ชุดแต่งตัวแนะนำพร้อม style tags — casual, sporty, elegant</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md relative opacity-80">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">AI Smart Matching</h3>
                <p className="text-sm text-gray-500">อธิบายว่าทำไมชุดนี้เหมาะกับสถานที่และกิจกรรมของคุณ</p>
              </div>
            </div>
            <button onClick={() => { localStorage.setItem("pg_user_tier", "pro"); setUserTier("pro"); showToast("อัปเกรดเป็น Pro สำเร็จ!"); }} className="mt-6 flex items-center gap-2 mx-auto px-8 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-all shadow-md">
              <Star className="w-5 h-5" />อัปเกรด Pro
            </button>
          </div>
        </section>
      )}

      {/* PRO Results: Custom Suggestions & Outfits */}
      {generatedResult && isPro && (generatedResult.custom_suggestions.length > 0 || generatedResult.outfits.length > 0) && (
        <section className="bg-[#F5F3EF] py-16">
          <div className="max-w-6xl mx-auto px-6 md:px-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 rounded-full bg-brand text-white text-xs font-bold">PRO</span>
              <h2 className="text-2xl font-bold text-gray-900">คำแนะนำเพิ่มเติมจาก AI</h2>
            </div>

            {/* Custom Suggestions */}
            {generatedResult.custom_suggestions.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">รายการตามกิจกรรม</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {generatedResult.custom_suggestions.map((suggestion, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm">
                      <div className="w-6 h-6 rounded-md bg-brand flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outfit Moodboard */}
            {generatedResult.outfits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Outfit Moodboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedResult.outfits.map((outfit, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900">{outfit.name}</h4>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand">{outfit.style}</span>
                      </div>
                      <ul className="space-y-1.5 mb-4">
                        {outfit.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-500 italic border-t border-gray-100 pt-3">{outfit.match_reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── OUTFITS ─── */}
      <section id="outfits" className="px-6 md:px-16 lg:px-24 py-20">
        {/* Pro Banner */}
        <div className="bg-gradient-to-r from-[#6B5B4D] to-[#5A4A3D] rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#F4A940] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="text-white text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-1">Outfit Moodboard & AI Smart Matching</h3>
              <p className="text-white/70 text-sm md:text-base">AI จับคู่ชุดกับการเดินทางและสภาพอากาศ — สำหรับสมาชิก Pro</p>
            </div>
          </div>
          <button onClick={() => { localStorage.setItem("pg_user_tier", "pro"); setUserTier("pro"); scrollTo("pricing"); }} className="flex items-center gap-2 bg-[#F4A940] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#E09830] transition-colors shadow-md whitespace-nowrap">
            <Star className="w-4 h-4 fill-white" />อัปเกรด Pro
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl md:text-5xl text-gray-900">Outfits <span className="text-3xl font-base text-gray-500 ml-2">ประจำทริป</span></h2>
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => isPro ? setStylistOpen(!stylistOpen) : null}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md ${isPro ? "bg-gradient-to-r from-[#C97D4E] to-[#A66B3F] text-white hover:opacity-90" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              <Sparkles className="w-4 h-4" />
              AI Stylist
              {!isPro && <span className="text-xs ml-1">PRO</span>}
            </button>
            {outfitFilters.map(f => (
              <button key={f.id} onClick={() => setOutfitFilter(f.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${outfitFilter === f.id ? "bg-brand text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Type Filters */}
        <div className="flex gap-2 flex-wrap items-center mb-8">
          {outfitDestFilters.map(f => (
            <button key={f.id} onClick={() => setOutfitDestFilter(f.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${outfitDestFilter === f.id ? "bg-[#5A4A3D] text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>
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
                  <img
                    src={saved.outfit?.image_url || "/asset/Shibuya Night Out.svg"}
                    alt={saved.outfit?.description || "Saved outfit"}
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

        {/* AI Stylist Form */}
        {stylistOpen && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C97D4E] to-[#A66B3F] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">AI Stylist สไตลิสต์แฟชั่นมืออาชีพ</h3>
                <p className="text-sm text-gray-500">กรอกข้อมูลทริปของคุณ เราจะแนะนำชุดที่เหมาะกับคุณ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">จุดหมายปลายทาง</label>
                <input
                  type="text"
                  placeholder="เช่น โตเกียว, ปารีส, ภูเก็ต"
                  value={stylistData.location}
                  onChange={e => setStylistData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สภาพอากาศ</label>
                <select
                  value={stylistData.weather}
                  onChange={e => setStylistData(prev => ({ ...prev, weather: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm bg-white"
                >
                  <option value="hot">ร้อน</option>
                  <option value="cold">หนาว</option>
                  <option value="rain">ฝน</option>
                  <option value="variable">แปรปรวน</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ระยะเวลา (วัน)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={stylistData.days}
                  onChange={e => setStylistData(prev => ({ ...prev, days: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">กิจกรรม</label>
                <input
                  type="text"
                  placeholder="เช่น เที่ยวชมเมือง, ชายหาด, ดินเนอร์"
                  value={stylistData.activities}
                  onChange={e => setStylistData(prev => ({ ...prev, activities: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สไตล์ที่ชอบ</label>
                <select
                  value={stylistData.style}
                  onChange={e => setStylistData(prev => ({ ...prev, style: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm bg-white"
                >
                  <option value="casual">ลำลอง (Casual)</option>
                  <option value="minimal">มินิมอล (Minimal)</option>
                  <option value="street">สตรีท (Street)</option>
                  <option value="elegant">หรูหรา (Elegant)</option>
                  <option value="sporty">สปอร์ต (Sporty)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เพศ</label>
                <select
                  value={stylistData.gender}
                  onChange={e => setStylistData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm bg-white"
                >
                  <option value="unisex">ไม่ระบุ</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateOutfitRecommendation}
              disabled={!stylistData.location.trim() || stylistLoading}
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {stylistLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  กำลังประมวลผล...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  ขอคำแนะนำชุด
                </>
              )}
            </button>

            {/* Result */}
            {stylistResult && stylistImages && (
              <div className="mt-8 space-y-8">
                {/* Outfit Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Day Outfit */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                    <div className="aspect-[4/5] relative">
                      <img src={stylistImages.day} alt="ชุดกลางวัน" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-xs opacity-80 mb-1">☀️ Day Look</p>
                        <h4 className="font-semibold">ชุดกลางวัน</h4>
                      </div>
                    </div>
                  </div>
                  {/* Night Outfit */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                    <div className="aspect-[4/5] relative">
                      <img src={stylistImages.night} alt="ชุดกลางคืน" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-xs opacity-80 mb-1">🌙 Night Look</p>
                        <h4 className="font-semibold">ชุดกลางคืน</h4>
                      </div>
                    </div>
                  </div>
                  {/* Activity Outfit */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                    <div className="aspect-[4/5] relative">
                      <img src={stylistImages.activity} alt="ชุดกิจกรรม" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-xs opacity-80 mb-1">🎯 Activity Look</p>
                        <h4 className="font-semibold">ชุดกิจกรรมพิเศษ</h4>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Text Details */}
                <div className="p-6 bg-[#F5F3EF] rounded-xl prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">{stylistResult}</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {outfitsLoading ? (
            <div className="col-span-full flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>
          ) : filteredOutfits.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              <p>ยังไม่มี Outfit suggestions</p>
            </div>
          ) : (
            filteredOutfits.map(o => (
              <div key={o.id} className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group aspect-[4/5]">
                <img src={o.image_url || "/asset/Shibuya Night Out.svg"} alt={o.description || "Outfit"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <button onClick={() => isPro ? toggleOutfitSave(o.id) : null} className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${isPro ? "bg-white/20 hover:bg-white/40" : "bg-white/10 cursor-not-allowed"}`}>
                  <Heart className={`w-5 h-5 ${isPro && isOutfitSaved(o.id) ? "text-red-500 fill-red-500" : isPro ? "text-white" : "text-white/40"}`} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{o.occasion}</span>
                    {o.weather_condition && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{o.weather_condition}</span>}
                  </div>
                  <h3 className="text-lg font-semibold">{o.description || `${o.destination_type} - ${o.occasion}`}</h3>
                  <p className="text-sm text-white/70">{o.destination_type}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <h3 className="text-xl text-gray-900 mb-6 flex items-center gap-2">ช้อปเพิ่มเติมจาก Partner <ChevronRight className="w-5 h-5 text-brand" /></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {partners.map(p => (
            <div key={p.id} className="bg-brand rounded-2xl p-6 flex items-center gap-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-md">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {p.logo ? <img src={p.logo} alt={p.name} className="w-full h-full object-contain" /> : <span className="text-2xl font-bold text-white">{p.name.charAt(0)}</span>}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-lg">{p.name}</h4>
                <p className="text-sm text-white/80 mt-0.5">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destination Packing Modal */}
      {showPackingModal && selectedDestination && (
        <DestinationPackingModal
          destination={selectedDestination}
          onClose={() => { setShowPackingModal(false); setSelectedDestination(null); }}
        />
      )}

      {/* ─── PRICING ─── */}
      <section id="pricing" className="bg-white py-20">
        <div className="px-6 md:px-16 lg:px-24 max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-brand text-sm font-medium mb-2">แผนการใช้งาน</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">เลือกแผนที่ใช่สำหรับคุณ ✨</h2>
            <p className="text-gray-500">เริ่มต้นฟรี อัปเกรดเมื่อพร้อม</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Free */}
            <div className="bg-[#F5F3EF] rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-1"><span className="text-4xl font-bold text-gray-900">฿0</span></div>
              <p className="text-gray-500 text-sm mb-6">ตลอดชีพ</p>
              <div className="border-t border-gray-200 pt-6 mb-6">
                <ul className="space-y-4">
                  {freeFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {f.included ? <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div> : <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center"><X className="w-3 h-3 text-gray-400" /></div>}
                      <span className={f.included ? "text-gray-700" : "text-gray-400"}>{f.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => { localStorage.setItem("pg_user_tier", "free"); setUserTier("free"); showToast("ใช้งาน Free tier แล้ว"); }} className="w-full py-3 px-6 rounded-xl border-2 border-brand text-brand font-semibold hover:bg-brand hover:text-white transition-colors">ใช้งานฟรี</button>
            </div>
            {/* Pro */}
            <div className="bg-gradient-to-br from-[#FDF0E6] to-[#F5E6D8] rounded-2xl p-8 shadow-lg relative">
              <div className="absolute -top-3 left-6 bg-brand text-white px-4 py-1 rounded-full text-sm font-medium">⭐ ยอดนิยม</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-1"><span className="text-4xl font-bold text-gray-900">฿199</span><span className="text-gray-500">/เดือน</span></div>
              <p className="text-gray-500 text-sm mb-6">&nbsp;</p>
              <div className="border-t border-brand/30 pt-6 mb-6">
                <ul className="space-y-4">
                  {proFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                      <span className="text-gray-700">{f.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => { localStorage.setItem("pg_user_tier", "pro"); setUserTier("pro"); showToast("อัปเกรดเป็น Pro สำเร็จ! ลองกด ✨ สร้างรายการอัตโนมัติ ที่ Packing"); }} className="w-full py-3 px-6 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors shadow-md">เริ่มทดลองใช้ฟรี 7 วัน</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative">
        {/* Newsletter */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 -mb-16">
          <div className="bg-[#F5F3EF] rounded-2xl shadow-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Our Newsletter</h3>
              <p className="text-gray-500 text-sm">รับข่าวสารท่องเที่ยวและส่วนลดพิเศษทางอีเมล</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                className="flex-1 md:w-72 px-5 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-brand text-gray-900 text-sm"
              />
              <button className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold transition-colors shadow-md whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="bg-[#1E1E2E] pt-28 pb-8">
          <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
              {/* Logo & Copyright */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <img src="/asset/logo-web.svg" alt="PackGlow" className="w-7 h-7 brightness-0 invert" />
                  <span className="text-xl font-bold text-white">PackGlow</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  จัดการสัมภาระการเดินทางได้อย่างง่ายดาย พร้อม AI ช่วยแนะนำชุดและแผนการเดินทาง
                </p>
              </div>

              {/* เมนู */}
              <div>
                <h4 className="text-white font-semibold mb-4">เมนู</h4>
                <ul className="space-y-2">
                  {["Home", "Destinations", "Packing", "Outfits", "Pricing"].map(item => (
                    <li key={item}>
                      <button onClick={() => scrollTo(item.toLowerCase())} className="text-white/50 hover:text-white transition-colors text-sm">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ข้อมูล */}
              <div>
                <h4 className="text-white font-semibold mb-4">ข้อมูล</h4>
                <ul className="space-y-2 text-white/50 text-sm">
                  <li className="hover:text-white transition-colors cursor-pointer">เกี่ยวกับเรา</li>
                  <li className="hover:text-white transition-colors cursor-pointer">นโยบายความเป็นส่วนตัว</li>
                  <li className="hover:text-white transition-colors cursor-pointer">ข้อกำหนดการใช้งาน</li>
                  <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
                </ul>
              </div>

              {/* ติดต่อ */}
              <div>
                <h4 className="text-white font-semibold mb-4">ติดต่อ</h4>
                <ul className="space-y-2 text-white/50 text-sm">
                  <li>support@packglow.com</li>
                  <li>+66 2 XXX XXXX</li>
                  <li>กรุงเทพมหานคร, ไทย</li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-white font-semibold mb-4">ติดตามเรา</h4>
                <div className="flex gap-3">
                  {[
                    { name: "Facebook", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                    { name: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                    { name: "Twitter", icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
                  ].map(s => (
                    <a key={s.name} href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-brand transition-colors" title={s.name}>
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 pt-6 text-center text-white/40 text-sm">
              © 2026 PackGlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
