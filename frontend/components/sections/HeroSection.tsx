"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";

function formatDate(dateStr: string) {
  if (!dateStr) return "Select date";
  const d = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const suffix = ['st', 'nd', 'rd'][([1, 2, 3].includes(d.getDate() % 10) && ![11, 12, 13].includes(d.getDate())) ? d.getDate() % 10 - 1 : -1] || 'th';
  return `${days[d.getDay()]}, ${d.getDate()}${suffix} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function HeroSection() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [person, setPerson] = useState("2");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const bookUrl = `/booking?destination=${encodeURIComponent(destination)}&person=${person}&checkIn=${checkIn}&checkOut=${checkOut}`;

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center">
      <Image src="/asset/first-page.png" alt="" fill className="object-cover" unoptimized />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 px-4 md:px-8 lg:px-24 pt-24 md:pt-28">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-4 md:mb-6 leading-tight">
          Pack your bags.<br />Get dressed perfectly.<br /><span className="text-white">Look amazing on every trip.</span>
        </h1>
        <p className="text-base md:text-xl lg:text-2xl text-white/80 max-w-xl">The best travel for your journey begins now</p>
        <div className="mt-8 md:mt-20 w-full md:w-2/3">
          {/* Mobile: stacked cards */}
          <div className="md:hidden bg-white rounded-2xl shadow-2xl p-4 space-y-4">
            <div>
              <label className="text-gray-700 text-[10px] font-bold tracking-widest mb-1.5 block">DESTINATION</label>
              <input type="text" value={destination} onChange={e => setDestination(e.target.value)} className="text-gray-800 font-medium text-sm bg-transparent outline-none w-full border-b border-gray-300 pb-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-700 text-[10px] font-bold tracking-widest mb-1.5 block">CHECK-IN</label>
                <div className="relative">
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <span className="text-gray-800 font-medium text-xs">{formatDate(checkIn)}</span>
                </div>
              </div>
              <div>
                <label className="text-gray-700 text-[10px] font-bold tracking-widest mb-1.5 block">CHECK OUT</label>
                <div className="relative">
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <span className="text-gray-800 font-medium text-xs">{formatDate(checkOut)}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-gray-700 text-[10px] font-bold tracking-widest mb-1.5 block">PERSON</label>
              <input type="number" value={person} onChange={e => setPerson(e.target.value)} className="text-gray-800 font-medium text-sm bg-transparent outline-none w-full border-b border-gray-300 pb-1" min="1" />
            </div>
            <button onClick={() => router.push(bookUrl)} className="w-full py-3 bg-brand hover:bg-brand-dark transition-colors rounded-xl flex items-center justify-center gap-3 text-white font-bold">
              Book Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          {/* Desktop: horizontal bar */}
          <div className="hidden md:flex bg-white rounded-r-2xl shadow-2xl items-stretch pl-8">
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
            <button onClick={() => router.push(bookUrl)} className="ml-auto px-6 py-3 bg-brand hover:bg-brand-dark transition-colors rounded-r-2xl flex items-center justify-center gap-3 text-white font-bold">
              <div className="flex flex-col items-start leading-tight"><span className="text-lg">Book</span><span className="text-lg">Now</span></div>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
