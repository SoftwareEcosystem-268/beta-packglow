"use client";

import { useState } from "react";
import { Check, X, Plus, Sparkles, Loader2, FolderOpen } from "lucide-react";
import { usePacking } from "@/components/PackingContext";
import { useTrips } from "@/components/TripContext";
import { packingCategories } from "@/lib/data/packing";
import { getCategoryStats } from "@/lib/data/helpers";
import TemplateSaveModal from "@/components/modals/TemplateSaveModal";

interface PackingSectionProps {
  isPro: boolean;
  showToast: (msg: string, type: "success" | "error") => void;
  scrollTo: (id: string) => void;
  showTemplateModal: boolean;
  setShowTemplateModal: (show: boolean) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  templateLoading: boolean;
  showLoadDropdown: boolean;
  setShowLoadDropdown: (show: boolean) => void;
  handleSaveChecklist: () => Promise<void>;
  handleSaveTemplate: () => Promise<void>;
  handleOpenLoad: () => Promise<void>;
  handleLoadTemplate: (tpl: { id: string; name: string; items: unknown[] }) => Promise<void>;
  templates: { id: string; name: string; items: unknown[] }[];
  removeTemplate: (id: string) => void;
}

export default function PackingSection({
  isPro, showToast, scrollTo,
  showTemplateModal, setShowTemplateModal,
  templateName, setTemplateName, templateLoading,
  showLoadDropdown, setShowLoadDropdown,
  handleSaveChecklist, handleSaveTemplate, handleOpenLoad, handleLoadTemplate,
  templates, removeTemplate,
}: PackingSectionProps) {
  const {
    items: packingItems, togglePacked, addCustomItemToTrip, removeChecklistItem,
    isDirty, saving, totalItemCount,
    generatedResult, generating, generateSmartList,
  } = usePacking();
  const { currentTrip } = useTrips();

  const [activePackCat, setActivePackCat] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const addItem = async () => {
    const category = activePackCat === "all" ? "clothes" : activePackCat;
    if (!newItemName.trim()) return;
    setAddError("");
    setAdding(true);
    const ok = await addCustomItemToTrip(category, newItemName.trim());
    setAdding(false);
    if (ok) {
      setNewItemName("");
      setShowAddForm(false);
      showToast(`เพิ่ม "${newItemName.trim()}" สำเร็จ`, "success");
    } else {
      setAddError("ไม่สามารถเพิ่มรายการได้ กรุณาลองใหม่");
    }
  };

  return (
    <>
      <section id="packing" className="bg-white py-10 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  if (!currentTrip) {
                    showToast("กรุณาเลือกสถานที่ก่อนสร้างรายการ", "error");
                    scrollTo("destinations");
                    return;
                  }
                  const result = await generateSmartList();
                  if (result) {
                    setShowTips(true);
                    showToast(`สร้างรายการสำเร็จ — ${Object.values(result.packing_list).flat().length} รายการ`, "success");
                  } else {
                    showToast("ไม่สามารถสร้างรายการอัตโนมัติได้", "error");
                  }
                }}
                disabled={generating}
                className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                {generating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> กำลังสร้าง...</>
                ) : (
                  "✨ สร้างรายการอัตโนมัติ"
                )}
              </button>
            </div>
            <h2 className="text-2xl md:text-4xl font-normal text-black underline decoration-brand underline-offset-8 md:underline-offset-12">Packing</h2>
          </div>

          {/* AI Tips & Suggestions */}
          {showTips && generatedResult && (generatedResult.custom_suggestions.length > 0 || generatedResult.outfits.length > 0) && (
            <div className="mb-6 bg-gradient-to-r from-brand/5 to-amber-50 border border-brand/20 rounded-2xl p-4 md:p-5 relative">
              <button onClick={() => setShowTips(false)} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand" />
                คำแนะนำจาก AI
              </h4>
              {generatedResult.custom_suggestions.length > 0 && (
                <ul className="space-y-1.5 mb-3">
                  {generatedResult.custom_suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-brand mt-0.5">&#8226;</span>{s}
                    </li>
                  ))}
                </ul>
              )}
              {generatedResult.outfits.length > 0 && (
                <button onClick={() => scrollTo("outfits")} className="text-sm text-brand font-medium hover:underline flex items-center gap-1">
                  <span>ดู outfit แนะนำ ({generatedResult.outfits.length} ชุด)</span>
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {/* Mobile: horizontal scrollable tabs */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {packingCategories.map(c => {
                const stats = getCategoryStats(c.id, packingItems);
                return (
                  <button key={c.id} onClick={() => setActivePackCat(c.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${activePackCat === c.id ? "bg-brand text-white" : "bg-gray-50 text-gray-700"}`}>
                    <span>{c.label}</span>
                    <span className={`text-[10px] ${activePackCat === c.id ? "text-white/80" : "text-gray-400"}`}>{stats.completed}/{stats.total}</span>
                  </button>
                );
              })}
            </div>
            {/* Desktop: sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
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
            <div className="flex-1 max-w-2xl min-w-0">
              {activePackCat === "all" ? (
                <div className="space-y-8">
                  {packingCategories.filter(c => c.id !== "all").map(cat => (
                    <div key={cat.id}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">{cat.label}</h3>
                      <div className="grid gap-3">
                        {(packingItems[cat.id] || []).map(item => (
                          <div key={item.id} className={`flex items-start gap-4 p-4 rounded-xl transition-all ${item.is_packed ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                            <div onClick={() => togglePacked(item.id, item.is_packed)} className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer ${item.is_packed ? "bg-brand" : "border-2 border-gray-300"}`}>
                              {item.is_packed && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex-1 cursor-pointer" onClick={() => togglePacked(item.id, item.is_packed)}>
                              <h4 className={`font-medium ${item.is_packed ? "text-gray-900" : "text-gray-700"}`}>{item.display_name}</h4>
                            </div>
                            <button onClick={() => removeChecklistItem(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 mt-0.5">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {totalItemCount === 0 && !showAddForm && currentTrip && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-3">ยังไม่มีรายการ — กด &quot;✨ สร้างรายการอัตโนมัติ&quot; หรือเพิ่มเอง</p>
                      <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-dashed border-brand text-brand hover:bg-brand/5 transition-all">
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">เพิ่มรายการ</span>
                      </button>
                    </div>
                  )}
                  {showAddForm && (
                    <div className="p-4 rounded-xl border-2 border-brand bg-white space-y-3 max-w-md">
                      <div className="flex gap-2">
                        <select defaultValue="clothes" onChange={e => { /* category handled */ }} className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900 bg-white">
                          {packingCategories.filter(c => c.id !== "all").map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                        <input type="text" placeholder="ชื่อรายการ" value={newItemName} onChange={e => { setNewItemName(e.target.value); setAddError(""); }} onKeyDown={e => e.key === "Enter" && addItem()} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900" autoFocus />
                      </div>
                      {addError && <p className="text-sm text-red-500">{addError}</p>}
                      <div className="flex gap-2">
                        <button onClick={addItem} disabled={!newItemName.trim() || adding} className="px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors disabled:opacity-40">
                          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "เพิ่ม"}
                        </button>
                        <button onClick={() => { setShowAddForm(false); setNewItemName(""); setAddError(""); }} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors">ยกเลิก</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  {(packingItems[activePackCat] || []).map(item => (
                    <div key={item.id} className={`flex items-start gap-4 p-4 rounded-xl transition-all ${item.is_packed ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                      <div onClick={() => togglePacked(item.id, item.is_packed)} className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer ${item.is_packed ? "bg-brand" : "border-2 border-gray-300"}`}>
                        {item.is_packed && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 cursor-pointer" onClick={() => togglePacked(item.id, item.is_packed)}>
                        <h4 className={`font-medium ${item.is_packed ? "text-gray-900" : "text-gray-700"}`}>{item.display_name}</h4>
                      </div>
                      <button onClick={() => removeChecklistItem(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 mt-0.5">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {showAddForm ? (
                    <div className="p-4 rounded-xl border-2 border-brand bg-white space-y-3">
                      <input type="text" placeholder="ชื่อรายการ" value={newItemName} onChange={e => { setNewItemName(e.target.value); setAddError(""); }} onKeyDown={e => e.key === "Enter" && addItem()} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900" autoFocus />
                      {addError && <p className="text-sm text-red-500">{addError}</p>}
                      <div className="flex gap-2">
                        <button onClick={addItem} disabled={!newItemName.trim() || adding} className="px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors disabled:opacity-40">
                          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "เพิ่ม"}
                        </button>
                        <button onClick={() => { setShowAddForm(false); setNewItemName(""); setAddError(""); }} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors">ยกเลิก</button>
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
            </div>
          </div>

          {/* Save / Template Bar */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
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

      <TemplateSaveModal
        open={showTemplateModal}
        templateName={templateName}
        onTemplateNameChange={setTemplateName}
        loading={templateLoading}
        onSave={handleSaveTemplate}
        onClose={() => { setShowTemplateModal(false); setTemplateName(""); }}
      />
    </>
  );
}
