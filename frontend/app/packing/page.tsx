"use client";

import Navbar from "@/components/Navbar";
import { usePacking } from "@/components/PackingContext";
import { ChevronLeft, ChevronRight, Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { id: "all", label: "ทั้งหมด" },
  { id: "clothes", label: "เสื้อผ้า" },
  { id: "personal", label: "ของใช้ส่วนตัว" },
  { id: "health", label: "ยาและสุขภาพ" },
  { id: "electronics", label: "อุปกรณ์อิเล็กทรอนิกส์" },
  { id: "documents", label: "เอกสาร" },
  { id: "others", label: "อื่น ๆ" },
];

function getCategoryStats(categoryId: string, items: Record<string, { id: number; name: string; description: string; checked: boolean }[]>): { completed: number; total: number } {
  if (categoryId === "all") {
    let total = 0;
    let completed = 0;
    Object.values(items).forEach(categoryItems => {
      total += categoryItems.length;
      completed += categoryItems.filter(item => item.checked).length;
    });
    return { completed, total };
  }
  const categoryItems = items[categoryId] || [];
  return {
    completed: categoryItems.filter(item => item.checked).length,
    total: categoryItems.length
  };
}

export default function PackingPage() {
  const router = useRouter();
  const { items, setItems } = usePacking();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");

  const addItem = () => {
    if (!newItemName.trim() || activeCategory === "all") return;
    const newId = Date.now();
    setItems(prev => ({
      ...prev,
      [activeCategory]: [...(prev[activeCategory] || []), {
        id: newId,
        name: newItemName.trim(),
        description: newItemDesc.trim(),
        checked: false,
      }]
    }));
    setNewItemName("");
    setNewItemDesc("");
    setShowAddForm(false);
  };

  const toggleItem = (categoryId: string, itemId: number) => {
    setItems(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const deleteItem = (categoryId: string, itemId: number) => {
    setItems(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(item => item.id !== itemId)
    }));
  };

  const renderItems = (categoryId: string) => {
    const categoryItems = items[categoryId] || [];
    return categoryItems.map((item) => (
      <div
        key={item.id}
        className={`flex items-start gap-4 p-4 rounded-xl transition-all group ${
          item.checked
            ? "bg-white shadow-sm"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <div
          onClick={() => toggleItem(categoryId, item.id)}
          className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer ${
            item.checked
              ? "bg-brand"
              : "border-2 border-gray-300"
          }`}
        >
          {item.checked && <Check className="w-4 h-4 text-white" />}
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => toggleItem(categoryId, item.id)}>
          <h3 className={`font-medium ${item.checked ? "text-gray-900" : "text-gray-700"}`}>
            {item.name}
          </h3>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
        <button
          onClick={() => deleteItem(categoryId, item.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 mt-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar variant="light" />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-[calc(100vh-88px)] p-6 border-r border-gray-200">
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-start justify-end mb-8">
            <div className="text-right">
              <h1 className="text-4xl font-normal text-black underline decoration-[#C97D4E] underline-offset-12">Packing</h1>
            </div>
          </div>

          {/* Checklist Cards */}
          {activeCategory === "all" ? (
            // Show all categories with their items
            <div className="space-y-8 max-w-2xl">
              {categories.filter(c => c.id !== "all").map((category) => (
                <div key={category.id}>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">{category.label}</h2>
                  <div className="grid gap-3">
                    {renderItems(category.id)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show single category items
            <div className="grid gap-3 max-w-2xl">
              {renderItems(activeCategory)}
              {showAddForm ? (
                <div className="p-4 rounded-xl border-2 border-brand bg-white space-y-3">
                  <input
                    type="text"
                    placeholder="ชื่อรายการ"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem()}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900"
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="รายละเอียด (ไม่จำเป็น)"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem()}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand text-gray-900"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addItem}
                      disabled={!newItemName.trim()}
                      className="px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      เพิ่ม
                    </button>
                    <button
                      onClick={() => { setShowAddForm(false); setNewItemName(""); setNewItemDesc(""); }}
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

          {/* Confirm Button */}
          <div className="max-w-2xl mt-8">
            <button
              onClick={() => router.back()}
              className="w-full py-4 rounded-2xl bg-brand hover:bg-brand-dark transition-colors text-white font-bold text-lg"
            >
              ยืนยันรายการ Packing
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
