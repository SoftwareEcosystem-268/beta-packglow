"use client";

import Navbar from "@/components/Navbar";
import { usePacking } from "@/components/PackingContext";
import { ChevronLeft, Calendar, User, MapPin, Check } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

const categoryLabels: Record<string, string> = {
  clothes: "เสื้อผ้า",
  personal: "ของใช้ส่วนตัว",
  health: "ยาและสุขภาพ",
  electronics: "อุปกรณ์อิเล็กทรอนิกส์",
  documents: "เอกสาร",
  others: "อื่น ๆ",
};

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { items: packingItems } = usePacking();
  const [confirmed, setConfirmed] = useState(false);
  const destination = searchParams.get("destination") || "";
  const person = searchParams.get("person") || "1";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#F5F3EF]">
        <Navbar variant="light" />
        <main className="flex flex-col items-center justify-center px-6 py-32">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">การจองสำเร็จ!</h1>
          <p className="text-gray-500 mb-8">ขอให้เดินทางอย่างมีความสุข</p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold transition-colors"
          >
            กลับหน้าหลัก
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar variant="light" />

      <main className="px-6 md:px-12 lg:px-16 py-12 max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">กลับ</span>
        </button>

        {/* Header */}
        <h1 className="text-4xl font-light text-black underline decoration-[#C97D4E] underline-offset-12 mb-10">
          Booking
        </h1>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800">สรุปรายละเอียดการจอง</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">จุดหมายปลายทาง</p>
                <p className="text-gray-900 font-medium">{destination || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                <User className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">จำนวนผู้เดินทาง</p>
                <p className="text-gray-900 font-medium">{person} คน</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Check-in</p>
                <p className="text-gray-900 font-medium">{formatDate(checkIn)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Check-out</p>
                <p className="text-gray-900 font-medium">{formatDate(checkOut)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Packing Summary Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">สรุปรายการ Packing</h2>

          <div className="space-y-6">
            {Object.entries(packingItems).map(([key, categoryItems]) => {
              if (!categoryItems || categoryItems.length === 0) return null;
              return (
                <div key={key}>
                  <h3 className="text-sm font-bold text-gray-500 tracking-widest mb-3">{categoryLabels[key] || key}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                          item.checked ? "bg-brand/5" : "bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                            item.checked ? "bg-brand" : "border border-gray-300"
                          }`}
                        >
                          {item.checked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${item.checked ? "text-gray-900" : "text-gray-400 line-through"}`}>
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>
              เตรียมแล้ว{" "}
              <strong className="text-brand">
                {Object.values(packingItems).reduce(
                  (acc, cat) => acc + cat.filter(i => i.checked).length, 0
                )}
              </strong>{" "}
              /{" "}
              {Object.values(packingItems).reduce((acc, cat) => acc + cat.length, 0)} รายการ
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={() => setConfirmed(true)}
          className="w-full py-4 rounded-2xl bg-brand hover:bg-brand-dark transition-colors text-white font-bold text-lg"
        >
          ยืนยันการจอง
        </button>
      </main>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <p className="text-gray-500">กำลังโหลด...</p>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
