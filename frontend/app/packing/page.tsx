"use client";

import Navbar from "@/components/Navbar";
import { usePacking } from "@/components/PackingContext";
import { useTrips } from "@/components/TripContext";
import { ChevronLeft, ChevronRight, Check, Plus, X, Loader2, Save, FolderOpen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const categories = [
  { id: "all", label: "ทั้งหมด" },
  { id: "clothes", label: "เสื้อผ้า" },
  { id: "personal", label: "ของใช้ส่วนตัว" },
  { id: "health", label: "ยาและสุขภาพ" },
  { id: "electronics", label: "อุปกรณ์อิเล็กทรอนิกส์" },
  { id: "documents", label: "เอกสาร" },
  { id: "others", label: "อื่น ๆ" },
];

function getCategoryStats(categoryId: string, items: Record<string, { is_packed: boolean }[]>) {
  if (categoryId === "all") {
    let total = 0;
    let completed = 0;
    Object.values(items).forEach((categoryItems) => {
      total += categoryItems.length;
      completed += categoryItems.filter((item) => item.is_packed).length;
    });
    return { completed, total };
  }
  const categoryItems = items[categoryId] || [];
  return {
    completed: categoryItems.filter((item) => item.is_packed).length,
    total: categoryItems.length,
  };
}

export default function PackingPage() {
  const { currentTrip } = useTrips();
  const {
    items, loading, togglePacked, addCustomItemToTrip, removeChecklistItem,
    isDirty, saving, saveChecklist, totalItemCount,
    templates, refreshTemplates, saveAsTemplate, loadTemplate, removeTemplate,
    generatedResult, generating, generateSmartList,
  } = usePacking();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [addError, setAddError] = useState("");
  const [addCategory, setAddCategory] = useState("clothes");
  const [adding, setAdding] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [showLoadDropdown, setShowLoadDropdown] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

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

  const handleAddItem = async () => {
    const category = activeCategory === "all" ? addCategory : activeCategory;
    if (!newItemName.trim() || category === "all") return;
    setAddError("");
    setAdding(true);
    const itemName = newItemName.trim();
    try {
      const ok = await addCustomItemToTrip(category, itemName);
      if (ok) {
        setNewItemName("");
        setShowAddForm(false);
        setAddError("");
        showToast(`เพิ่ม "${itemName}" สำเร็จ`);
      } else {
        setAddError("ไม่สามารถเพิ่มรายการได้");
        showToast("เพิ่มรายการไม่สำเร็จ", "error");
      }
    } catch {
      setAddError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      showToast("เพิ่มรายการไม่สำเร็จ", "error");
    } finally {
      setAdding(false);
    }
  };

  const hasItems = totalItemCount > 0;

  // No trip selected
  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-[#F5F3EF]">
        <Navbar variant="light" />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <p className="text-gray-500 text-lg mb-4">กรุณาเลือกทริปก่อนจัดเตรียมสัมภาระ</p>
          <Link href="/" className="text-brand font-medium hover:underline">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col">
      <Navbar variant="light" />

      {/* Mobile: horizontal scrollable category tabs */}
      <div className="md:hidden overflow-x-auto border-b border-gray-200 bg-white px-4 py-3 flex gap-2 flex-shrink-0">
        {categories.map((category) => {
          const stats = getCategoryStats(category.id, items);
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category.id ? "bg-brand text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <span>{category.label}</span>
              <span className={`text-xs ${activeCategory === category.id ? "text-white/70" : "text-gray-400"}`}>
                {stats.completed}/{stats.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-72 min-h-0 p-6 border-r border-gray-200 flex-col overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <button className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center hover:bg-brand-dark transition-colors">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          <nav className="space-y-2">
            {categories.map((category) => {
              const stats = getCategoryStats(category.id, items);
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeCategory === category.id ? "bg-brand text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="font-medium">{category.label}</span>
                  <span className={`text-sm ${activeCategory === category.id ? "text-white/80" : "text-gray-400"}`}>
                    {stats.completed}/{stats.total}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-200 space-y-3">
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">เทมเพลต</p>
            <button onClick={() => setShowTemplateModal(true)} disabled={!hasItems} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed">
              <Save className="w-5 h-5" />
              บันทึกเทมเพลต
            </button>
            <div className="relative">
              <button onClick={handleOpenLoad} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#5A4A3D] text-white font-bold hover:bg-[#4A3A2D] transition-colors shadow-md">
                <FolderOpen className="w-5 h-5" />
                ใช้เทมเพลต
              </button>
              {showLoadDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-72 overflow-y-auto">
                  {templates.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400 text-center">ยังไม่มีเทมเพลต</p>
                  ) : (
                    templates.map((tpl) => (
                      <div key={tpl.id} className="flex items-center gap-2 px-4 py-3 hover:bg-brand/5 transition-colors">
                        <button onClick={() => handleLoadTemplate(tpl)} disabled={templateLoading} className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-800">{tpl.name}</p>
                          <p className="text-xs text-gray-400">{tpl.items.length} รายการ</p>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); removeTemplate(tpl.id); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 md:px-4 py-2 rounded-xl">
              <Check className="w-4 h-4" />
              <span className="text-xs md:text-sm font-medium">บันทึกอัตโนมัติ</span>
            </div>
            <div className="text-right">
              <h1 className="text-2xl md:text-4xl font-normal text-black underline decoration-[#C97D4E] underline-offset-8 md:underline-offset-12">Packing</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">{currentTrip.title}</p>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>
          ) : (
            <>
              {/* All Categories View */}
              {activeCategory === "all" ? (
                <div className="space-y-8 max-w-2xl">
                  {categories.filter((c) => c.id !== "all").map((category) => {
                    const categoryItems = items[category.id] || [];
                    if (categoryItems.length === 0) return null;
                    return (
                      <div key={category.id}>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">{category.label}</h2>
                        <div className="grid gap-3">
                          {categoryItems.map((item) => (
                            <div key={item.id} className={`flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl transition-all ${item.is_packed ? "bg-white shadow-sm" : "bg-gray-100 hover:bg-gray-200"}`}>
                              <div onClick={() => togglePacked(item.id, item.is_packed)} className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer ${item.is_packed ? "bg-brand" : "border-2 border-gray-300"}`}>
                                {item.is_packed && <Check className="w-4 h-4 text-white" />}
                              </div>
                              <div className="flex-1 cursor-pointer min-w-0" onClick={() => togglePacked(item.id, item.is_packed)}>
                                <h3 className={`font-medium text-sm md:text-base ${item.is_packed ? "text-gray-900" : "text-gray-700"}`}>{item.display_name}</h3>
                                {item.quantity > 1 && <p className="text-sm text-gray-500">x{item.quantity}</p>}
                                {item.custom_note && <p className="text-sm text-gray-500">{item.custom_note}</p>}
                              </div>
                              <button onClick={() => removeChecklistItem(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 mt-0.5">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {totalItemCount === 0 && !showAddForm && (
                    <div className="text-center py-12 space-y-4">
                      <p className="text-gray-400">ยังไม่มีรายการ</p>
                      <p className="text-gray-400 text-sm">กดปุ่ม &quot;สร้างรายการอัตโนมัติ&quot; ด้านล่าง หรือเพิ่มรายการเอง</p>
                      <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-dashed border-brand text-brand hover:bg-brand/5 transition-all">
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">เพิ่มรายการ</span>
                      </button>
                    </div>
                  )}
                  {showAddForm && (
                    <div className="p-4 rounded-xl border-2 border-brand bg-white space-y-3 max-w-md">
                      <div className="flex gap-2">
                        <select value={addCategory} onChange={(e) => setAddCategory(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900 bg-white">
                          {categories.filter((c) => c.id !== "all").map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                        <input type="text" placeholder="ชื่อรายการ" value={newItemName} onChange={(e) => { setNewItemName(e.target.value); setAddError(""); }} onKeyDown={(e) => e.key === "Enter" && handleAddItem()} className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900" autoFocus />
                      </div>
                      {addError && <p className="text-sm text-red-500">{addError}</p>}
                      <div className="flex gap-2">
                        <button onClick={handleAddItem} disabled={!newItemName.trim() || adding} className="px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "เพิ่ม"}
                        </button>
                        <button onClick={() => { setShowAddForm(false); setAddError(""); setNewItemName(""); }} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors">ยกเลิก</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Single Category View */
                <div className="grid gap-3 max-w-2xl">
                  {(items[activeCategory] || []).map((item) => (
                    <div key={item.id} className={`flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl transition-all ${item.is_packed ? "bg-white shadow-sm" : "bg-gray-100 hover:bg-gray-200"}`}>
                      <div onClick={() => togglePacked(item.id, item.is_packed)} className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer ${item.is_packed ? "bg-brand" : "border-2 border-gray-300"}`}>
                        {item.is_packed && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 cursor-pointer min-w-0" onClick={() => togglePacked(item.id, item.is_packed)}>
                        <h3 className={`font-medium text-sm md:text-base ${item.is_packed ? "text-gray-900" : "text-gray-700"}`}>{item.display_name}</h3>
                        {item.quantity > 1 && <p className="text-sm text-gray-500">x{item.quantity}</p>}
                        {item.custom_note && <p className="text-sm text-gray-500">{item.custom_note}</p>}
                      </div>
                      <button onClick={() => removeChecklistItem(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 mt-0.5">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(items[activeCategory] || []).length === 0 && !showAddForm && (
                    <p className="text-center text-gray-400 py-8">ยังไม่มีรายการในหมวดหมู่นี้</p>
                  )}
                  {showAddForm ? (
                    <div className="p-4 rounded-xl border-2 border-brand bg-white space-y-3">
                      <input type="text" placeholder="ชื่อรายการ" value={newItemName} onChange={(e) => { setNewItemName(e.target.value); setAddError(""); }} onKeyDown={(e) => e.key === "Enter" && handleAddItem()} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900" autoFocus />
                      {addError && <p className="text-sm text-red-500">{addError}</p>}
                      <div className="flex gap-2">
                        <button onClick={handleAddItem} disabled={!newItemName.trim() || adding} className="px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "เพิ่ม"}
                        </button>
                        <button onClick={() => { setShowAddForm(false); setAddError(""); setNewItemName(""); }} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors">ยกเลิก</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddForm(true)} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand hover:text-brand transition-all">
                      <div className="w-6 h-6 rounded-md border-2 border-current flex items-center justify-center"><Plus className="w-4 h-4" /></div>
                      <span className="font-medium">เพิ่มรายการ</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] relative z-40 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 md:px-6 py-3">
          <div className="flex items-center gap-2">
            {isDirty ? (
              <><span className="w-2.5 h-2.5 rounded-full bg-orange-400" /><span className="text-sm text-orange-600 font-medium">มีการเปลี่ยนแปลง</span></>
            ) : (
              <><Check className="w-4 h-4 text-green-600" /><span className="text-sm text-green-600 font-medium">บันทึกแล้ว</span></>
            )}
            <span className="text-xs text-gray-400 ml-2">{totalItemCount} รายการ</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={async () => {
                const result = await generateSmartList();
                if (result) {
                  showToast(`สร้างรายการสำเร็จ — ${Object.values(result.packing_list).flat().length} รายการ`);
                } else {
                  showToast("ไม่สามารถสร้างรายการอัตโนมัติได้", "error");
                }
              }}
              disabled={generating}
              className="flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:from-purple-600 hover:to-indigo-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-sm"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : "🤖"}
              {generating ? "กำลังสร้าง..." : "สร้างรายการอัตโนมัติ"}
            </button>
            <button onClick={handleSaveChecklist} disabled={!hasItems || saving} className="flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] text-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "💾"} บันทึก
            </button>
            <button onClick={() => setShowTemplateModal(true)} disabled={!hasItems} className="flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl bg-[#5A4A3D] text-white font-bold hover:bg-[#4A3A2D] transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] text-sm">
              📌 Template
            </button>
          </div>
        </div>
      </div>

      {/* Template Name Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setShowTemplateModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">📌 บันทึกเป็น Template</h3>
            <input type="text" placeholder="ตั้งชื่อ template..." value={templateName} onChange={(e) => setTemplateName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveTemplate()} className="w-full px-4 py-3 rounded-xl border-2 border-brand/40 focus:outline-none focus:border-brand text-gray-900" autoFocus />
            <div className="flex gap-3 mt-4">
              <button onClick={handleSaveTemplate} disabled={!templateName.trim() || templateLoading} className="flex-1 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-colors disabled:opacity-40">
                {templateLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "บันทึก"}
              </button>
              <button onClick={() => { setShowTemplateModal(false); setTemplateName(""); }} className="px-6 py-3 rounded-xl bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white font-medium text-sm z-50 transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-500"}`}>
          {toast.type === "success" && <span className="mr-2">✓</span>}
          {toast.type === "error" && <span className="mr-2">✕</span>}
          {toast.message}
        </div>
      )}
    </div>
  );
}
