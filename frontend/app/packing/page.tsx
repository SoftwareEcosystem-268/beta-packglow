"use client";

import Navbar from "@/components/Navbar";
import { ChevronLeft, ChevronRight, Check, Plus } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: "all", label: "ทั้งหมด" },
  { id: "clothes", label: "เสื้อผ้า" },
  { id: "personal", label: "ของใช้ส่วนตัว" },
  { id: "health", label: "ยาและสุขภาพ" },
  { id: "electronics", label: "อุปกรณ์อิเล็กทรอนิกส์" },
  { id: "documents", label: "เอกสาร" },
  { id: "others", label: "อื่น ๆ" },
];

const packingItems: Record<string, { id: number; name: string; description: string; checked: boolean }[]> = {
  clothes: [
    { id: 1, name: "เสื้อยืด", description: "สำหรับอากาศ 15–22°C", checked: true },
    { id: 2, name: "เสื้อกันฝน", description: "สำหรับฝนตก", checked: true },
    { id: 3, name: "เสื้อกันหนาว", description: "สำหรับกลางคืนที่โตเกียว <10°C", checked: false },
    { id: 4, name: "กางเกงยีนส์", description: "สำหรับเดินในเมือง", checked: false },
    { id: 5, name: "กางเกงขาสั้น", description: "สำหรับอากาศร้อน", checked: false },
    { id: 6, name: "ถุงเท้า", description: "5 คู่", checked: true },
    { id: 7, name: "ชุดนอน", description: "2 ชุด", checked: false },
    { id: 8, name: "เสื้อฮู้ด", description: "สำหรับอากาศเย็น", checked: true },
  ],
  personal: [
    { id: 9, name: "แปรงสีฟัน", description: "พร้อมยาสีฟัน", checked: true },
    { id: 10, name: "เจลอาบน้ำ", description: "100ml", checked: true },
    { id: 11, name: "แชมพู", description: "100ml", checked: false },
    { id: 12, name: "ผ้าเช็ดตัว", description: "ผ้าเช็ดตัวเดินทาง", checked: false },
    { id: 13, name: "เครื่องสำอาง", description: "พื้นฐาน", checked: true },
    { id: 14, name: "เจลทาผิว", description: "สำหรับผิวแห้ง", checked: false },
  ],
  health: [
    { id: 15, name: "ยาแก้ปวด", description: "พาราเซตามอล", checked: true },
    { id: 16, name: "ยาแก้ท้องเสีย", description: "สำหรับเดินทาง", checked: false },
    { id: 17, name: "ปลาสเตอร์", description: "สำหรับแผล", checked: true },
    { id: 18, name: "ยาหอม", description: "สำหรับเมารถ", checked: false },
    { id: 19, name: "พลาสเตอร์บรรเทาปวด", description: "สำหรับปวดกล้ามเนื้อ", checked: false },
  ],
  electronics: [
    { id: 20, name: "โทรศัพท์มือถือ", description: "พร้อมสายชาร์จ", checked: true },
    { id: 21, name: "แท็บเล็ต", description: "สำหรับดูหนัง", checked: false },
    { id: 22, name: "หูฟัง", description: "หูฟังบลูทูธ", checked: true },
    { id: 23, name: "Power bank", description: "20000mAh", checked: true },
  ],
  documents: [
    { id: 24, name: "หนังสือเดินทาง", description: "พร้อมใบตรวจลงตรา", checked: true },
    { id: 25, name: "บัตรประจำตัวประชาชน", description: "หรือสำเนา", checked: true },
    { id: 26, name: "ตั๋วเครื่องบิน", description: "E-ticket", checked: true },
    { id: 27, name: "ประกันการเดินทาง", description: "สำเนา", checked: true },
  ],
  others: [
    { id: 28, name: "ร่ม", description: "ร่มพกพา", checked: true },
    { id: 29, name: "ถุงพลาสติก", description: "สำหรับแยกเสื้อผ้าเปียก", checked: false },
    { id: 30, name: "แว่นกันแดด", description: "สำหรับกลางวัน", checked: false },
  ],
};

function getCategoryStats(categoryId: string, items: typeof packingItems): { completed: number; total: number } {
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [items, setItems] = useState(packingItems);

  const toggleItem = (categoryId: string, itemId: number) => {
    setItems(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const renderItems = (categoryId: string) => {
    const categoryItems = items[categoryId] || [];
    return categoryItems.map((item) => (
      <div
        key={item.id}
        onClick={() => toggleItem(categoryId, item.id)}
        className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
          item.checked
            ? "bg-white shadow-sm"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
            item.checked
              ? "bg-brand"
              : "border-2 border-gray-300"
          }`}
        >
          {item.checked && <Check className="w-4 h-4 text-white" />}
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${item.checked ? "text-gray-900" : "text-gray-700"}`}>
            {item.name}
          </h3>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
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
              <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand hover:text-brand transition-all">
                <div className="w-6 h-6 rounded-md border-2 border-current flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-medium">เพิ่มรายการ</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
