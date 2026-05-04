"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Tag, Hourglass, Luggage, XCircle } from "lucide-react";
import { useTrips } from "@/components/TripContext";
import { useAuth } from "@/components/AuthContext";
import { type UIStatus, BOOKING_STATUS, bookingFilters, destTypeLabels, computeBookingStatus, fmtDate, fmtDateRange, daysUntil } from "@/lib/data/booking";
import CancelBookingModal from "@/components/modals/CancelBookingModal";

interface BookingsSectionProps {
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function BookingsSection({ showToast }: BookingsSectionProps) {
  const { trips, cancelTrip } = useTrips();
  const { user } = useAuth();
  const [bookingFilter, setBookingFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState<{ id: string; title: string } | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelTrip(cancelTarget.id);
      setCancelTarget(null);
      showToast("ยกเลิกการจองสำเร็จ", "success");
    } catch {
      showToast("ไม่สามารถยกเลิกการจองได้", "error");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <section id="bookings" className="bg-white py-10 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 mb-6 md:mb-8">
          <div>
            <div className="inline-block mb-1">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-1.5">Bookings</h2>
              <div className="w-full h-px bg-brand" />
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-2">ติดตามและจัดการการจองทริปทั้งหมดของคุณ</p>
          </div>
          {trips.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Luggage className="w-4 h-4" />
              <span>{trips.length} การจอง</span>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        {user && trips.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {(["pending", "ongoing", "completed", "cancelled"] as UIStatus[]).map((s) => {
              const cfg = BOOKING_STATUS[s];
              const Icon = cfg.icon;
              const count = trips.filter(t => computeBookingStatus(t) === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setBookingFilter(bookingFilter === s ? "all" : s)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    bookingFilter === s ? `${cfg.bg} ${cfg.border} shadow-sm` : "bg-[#F5F3EF] border-transparent hover:border-gray-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${cfg.text}`} />
                  </div>
                  <div className="text-left">
                    <p className={`text-2xl font-bold ${cfg.text}`}>{count}</p>
                    <p className="text-xs text-gray-500">{cfg.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {bookingFilters.map((tab) => {
            const count = tab.id === "all"
              ? trips.length
              : trips.filter(t => computeBookingStatus(t) === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setBookingFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  bookingFilter === tab.id
                    ? "bg-brand text-white shadow-sm"
                    : "bg-[#F5F3EF] text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs ${bookingFilter === tab.id ? "text-white/70" : "text-gray-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Booking List */}
        {!user ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F3EF] flex items-center justify-center mx-auto mb-4">
              <Luggage className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-700 font-semibold mb-1">กรุณาเข้าสู่ระบบ</p>
            <p className="text-gray-400 text-sm">เข้าสู่ระบบเพื่อดูการจองของคุณ</p>
          </div>
        ) : (() => {
          const filtered = bookingFilter === "all"
            ? trips
            : trips.filter(t => computeBookingStatus(t) === bookingFilter);
          if (filtered.length === 0) return (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#F5F3EF] flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-700 font-semibold mb-1">
                {trips.length === 0 ? "ยังไม่มีการจอง" : "ไม่พบการจองในหมวดนี้"}
              </p>
              <p className="text-gray-400 text-sm">
                {trips.length === 0 ? "จองทริปได้จากด้านบน" : "ลองเลือกหมวดอื่น"}
              </p>
            </div>
          );
          return (
            <div className="space-y-4">
              {filtered.map((trip) => {
                const status = computeBookingStatus(trip);
                const cfg = BOOKING_STATUS[status];
                const Icon = cfg.icon;
                const canCancel = status === "pending" || status === "ongoing";
                const dUntil = daysUntil(trip.start_date);
                return (
                  <div key={trip.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-5 md:p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{trip.title}</h3>
                            {trip.destination && (
                              <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5"><MapPin className="w-3.5 h-3.5" /><span className="truncate">{trip.destination}</span></div>
                            )}
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-sm text-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-brand" />{fmtDateRange(trip.start_date, trip.end_date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-sm text-gray-700">
                          <Clock className="w-3.5 h-3.5 text-brand" />{trip.duration_days} วัน
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-sm text-gray-700">
                          <Tag className="w-3.5 h-3.5 text-brand" />{destTypeLabels[trip.destination_type] || trip.destination_type}
                        </span>
                        {dUntil !== null && status === "pending" && dUntil > 0 && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50/60 text-sm text-amber-800 font-medium">
                            <Hourglass className="w-3.5 h-3.5" />อีก {dUntil} วัน
                          </span>
                        )}
                      </div>
                      {canCancel ? (
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <p className="text-xs text-gray-400">สร้างเมื่อ {fmtDate(trip.created_at)}</p>
                          <button onClick={() => setCancelTarget({ id: trip.id, title: trip.title })} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <XCircle className="w-4 h-4" />ยกเลิกการจอง
                          </button>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-400">สร้างเมื่อ {fmtDate(trip.created_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      <CancelBookingModal
        target={cancelTarget}
        cancelling={cancelling}
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelTarget(null)}
      />
    </section>
  );
}
