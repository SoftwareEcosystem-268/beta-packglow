"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type PackingItem = {
  id: number;
  name: string;
  description: string;
  checked: boolean;
};

export type PackingItems = Record<string, PackingItem[]>;

const initialItems: PackingItems = {
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

type PackingContextType = {
  items: PackingItems;
  setItems: React.Dispatch<React.SetStateAction<PackingItems>>;
};

const PackingContext = createContext<PackingContextType | null>(null);

export function PackingProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PackingItems>(initialItems);

  return (
    <PackingContext.Provider value={{ items, setItems }}>
      {children}
    </PackingContext.Provider>
  );
}

export function usePacking() {
  const context = useContext(PackingContext);
  if (!context) {
    throw new Error("usePacking must be used within a PackingProvider");
  }
  return context;
}
