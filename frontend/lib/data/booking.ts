import { CheckCircle2, PlayCircle, XCircle, Hourglass } from "lucide-react";

export type UIStatus = "pending" | "ongoing" | "completed" | "cancelled";

export const BOOKING_STATUS: Record<UIStatus, {
  label: string;
  icon: typeof CheckCircle2;
  bg: string;
  text: string;
  border: string;
  dot: string;
  bar: string;
}> = {
  pending:   { label: "รอดำเนินการ", icon: Hourglass,     bg: "bg-amber-50/60",   text: "text-amber-800/70",   border: "border-amber-200/50",   dot: "bg-amber-300",   bar: "bg-amber-300/60" },
  ongoing:   { label: "กำลังใช้งาน", icon: PlayCircle,    bg: "bg-teal-50/60",    text: "text-teal-800/70",    border: "border-teal-200/50",    dot: "bg-teal-300",    bar: "bg-teal-300/60" },
  completed: { label: "เสร็จสิ้น",    icon: CheckCircle2,  bg: "bg-stone-50/60",   text: "text-stone-500",      border: "border-stone-200/50",   dot: "bg-stone-300",   bar: "bg-stone-300/60" },
  cancelled: { label: "ยกเลิก",      icon: XCircle,       bg: "bg-rose-50/60",    text: "text-rose-700/60",    border: "border-rose-200/50",    dot: "bg-rose-300",    bar: "bg-rose-300/60" },
};

export const bookingFilters = [
  { id: "all", label: "ทั้งหมด" },
  { id: "pending", label: "รอดำเนินการ" },
  { id: "ongoing", label: "กำลังใช้งาน" },
  { id: "completed", label: "เสร็จสิ้น" },
  { id: "cancelled", label: "ยกเลิก" },
];

export const destTypeLabels: Record<string, string> = {
  beach: "ชายหาด", mountain: "ภูเขา", city: "เมือง", abroad: "ต่างประเทศ", ceremony: "พิธีการ",
};

export function computeBookingStatus(trip: { status: string; start_date: string | null; end_date: string | null }): UIStatus {
  if (trip.status === "cancelled") return "cancelled";
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = trip.start_date ? new Date(trip.start_date) : null;
  const end = trip.end_date ? new Date(trip.end_date) : null;
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(0, 0, 0, 0);
  if (end && now > end) return "completed";
  if (start && end && now >= start && now <= end) return "ongoing";
  return "pending";
}

export function fmtDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDateRange(start: string | null, end: string | null) {
  if (!start && !end) return "ยังไม่กำหนดวัน";
  return `${fmtDate(start)} — ${fmtDate(end)}`;
}

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
