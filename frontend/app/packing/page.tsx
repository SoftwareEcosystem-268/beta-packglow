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
  } = usePacking();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [addError, setAddError] = useState("");

  // Template UI
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [showLoadDropdown, setShowLoadDropdown] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);

  // Toast
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
    if (!newItemName.trim() || activeCategory === "all") return;
    setAddError("");
    const itemName = newItemName.trim();
    const ok = await addCustomItemToTrip(activeCategory, itemName);
    if (ok) {
      setNewItemName("");
      setShowAddForm(false);
      setAddError("");
      showToast(`เพิ่ม "${itemName}" สำเร็จ`);
    } else {
      setAddError("ไม่สามารถเพิ่มรายการได้");
      showToast("เพิ่มรายการไม่สำเร็จ", "error");
    }
  };

  const hasItems = totalItemCount > 0;

  // No trip selected
  if (!currentTrip) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F3EF" }}>
        <Navbar variant="light" />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-gray-500 text-lg mb-4">กรุณาเลือกทริปก่อนจัดเตรียมสัมภาระ</p>
          <Link href="/" className="text-brand font-medium hover:underline">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "grid", gridTemplateRows: "auto 1fr auto", background: "#F5F3EF" }}>
      {/* Row 1: Navbar */}
      <Navbar variant="light" />

      {/* Row 2: Content (sidebar + main) */}
      <div style={{ display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Sidebar */}
        <aside className="w-72 min-h-0 p-6 border-r border-gray-200 flex flex-col overflow-y-auto">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 mb-6">
            <button className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center hover:bg-brand-dark transition-colors">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Category List */}
          <nav className="space-y-2">
            {categories.map((category) => {
              const stats = getCategoryStats(category.id, items);
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeCategory === category.id
                      ? "bg-brand text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
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

          {/* Template Section in Sidebar */}
          <div className="mt-auto pt-4 border-t border-gray-200 space-y-3">
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">เทมเพลต</p>

            <button
              onClick={() => setShowTemplateModal(true)}
              disabled={!hasItems}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              บันทึกเทมเพลต
            </button>

            <div className="relative">
              <button
                onClick={handleOpenLoad}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#5A4A3D] text-white font-bold hover:bg-[#4A3A2D] transition-colors shadow-md"
              >
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
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">บันทึกอัตโนมัติ</span>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-normal text-black underline decoration-[#C97D4E] underline-offset-12">
                  Packing
                </h1>
                <p className="text-sm text-gray-500 mt-2">{currentTrip.title}</p>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-brand animate-spin" />
              </div>
            ) : (
              <>
                {/* All Categories View */}
                {activeCategory === "all" ? (
                  <div className="space-y-8 max-w-2xl">
                    {categories
                      .filter((c) => c.id !== "all")
                      .map((category) => {
                        const categoryItems = items[category.id] || [];
                        if (categoryItems.length === 0) return null;
                        return (
                          <div key={category.id}>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">{category.label}</h2>
                            <div className="grid gap-3">
                              {categoryItems.map((item) => (
                                <div
                                  key={item.id}
                                  className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                                    item.is_packed ? "bg-white shadow-sm" : "bg-gray-100 hover:bg-gray-200"
                                  }`}
                                >
                                  <div
                                    onClick={() => togglePacked(item.id, item.is_packed)}
                                    className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer ${
                                      item.is_packed ? "bg-brand" : "border-2 border-gray-300"
                                    }`}
                                  >
                                    {item.is_packed && <Check className="w-4 h-4 text-white" />}
                                  </div>
                                  <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => togglePacked(item.id, item.is_packed)}
                                  >
                                    <h3 className={`font-medium ${item.is_packed ? "text-gray-900" : "text-gray-700"}`}>
                                      {item.display_name}
                                    </h3>
                                    {item.quantity > 1 && (
                                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                                    )}
                                    {item.custom_note && (
                                      <p className="text-sm text-gray-500">{item.custom_note}</p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeChecklistItem(item.id)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 mt-0.5"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    {totalItemCount === 0 && (
                      <p className="text-center text-gray-400 py-12">ยังไม่มีรายการ — เลือกหมวดหมู่แล้วกด &quot;เพิ่มรายการ&quot;</p>
                    )}
                  </div>
                ) : (
                  /* Single Category View */
                  <div className="grid gap-3 max-w-2xl">
                    {(items[activeCategory] || []).map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                          item.is_packed ? "bg-white shadow-sm" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <div
                          onClick={() => togglePacked(item.id, item.is_packed)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer ${
                            item.is_packed ? "bg-brand" : "border-2 border-gray-300"
                          }`}
                        >
                          {item.is_packed && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 cursor-pointer" onClick={() => togglePacked(item.id, item.is_packed)}>
                          <h3 className={`font-medium ${item.is_packed ? "text-gray-900" : "text-gray-700"}`}>
                            {item.display_name}
                          </h3>
                          {item.quantity > 1 && <p className="text-sm text-gray-500">x{item.quantity}</p>}
                          {item.custom_note && <p className="text-sm text-gray-500">{item.custom_note}</p>}
                        </div>
                        <button
                          onClick={() => removeChecklistItem(item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 mt-0.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(items[activeCategory] || []).length === 0 && !showAddForm && (
                      <p className="text-center text-gray-400 py-8">ยังไม่มีรายการในหมวดหมู่นี้</p>
                    )}
                    {showAddForm ? (
                      <div className="p-4 rounded-xl border-2 border-brand bg-white space-y-3">
                        <input
                          type="text"
                          placeholder="ชื่อรายการ"
                          value={newItemName}
                          onChange={(e) => { setNewItemName(e.target.value); setAddError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900"
                          autoFocus
                        />
                        {addError && <p className="text-sm text-red-500">{addError}</p>}
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddItem}
                            disabled={!newItemName.trim()}
                            className="px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            เพิ่ม
                          </button>
                          <button
                            onClick={() => { setShowAddForm(false); setAddError(""); setNewItemName(""); }}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand hover:text-brand transition-all"
                      >
                        <div className="w-6 h-6 rounded-md border-2 border-current flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="font-medium">เพิ่มรายการ</span>
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Row 3: Bottom Bar — always visible via CSS Grid */}
      <div
        style={{
          background: "white",
          borderTop: "1px solid #e5e7eb",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
          position: "relative",
          zIndex: 40,
        }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Status */}
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

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveChecklist}
              disabled={!hasItems || saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "💾"}
              บันทึก Checklist
            </button>
            <button
              onClick={() => setShowTemplateModal(true)}
              disabled={!hasItems}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5A4A3D] text-white font-bold hover:bg-[#4A3A2D] transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              📌 บันทึกเป็น Template
            </button>
          </div>
        </div>
      </div>

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
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white font-medium text-sm z-50 transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {toast.type === "success" && <span className="mr-2">✓</span>}
          {toast.type === "error" && <span className="mr-2">✕</span>}
          {toast.message}
        </div>
      )}
    </div>
  );
}
