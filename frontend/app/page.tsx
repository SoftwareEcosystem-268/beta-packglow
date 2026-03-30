"use client";

import Navbar from "@/components/Navbar";
import { ChevronDown, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/asset/first-page.png')`,
          backgroundSize: 'cover',
        }}
      />
      {/* Dark Overlay */}
      <div className="fixed inset-0 z-[1] bg-black/50" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        {/* Hero Content */}
        <main className="flex-1 flex flex-col justify-start px-8 md:px-16 lg:px-24 pt-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6 leading-tight">
            Pack your bags.
            <br />
            Get dressed perfectly.
            <br />
            <span className="text-white">Look amazing on every trip.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-xl">
            The best travel for your journey begins now
          </p>

          {/* Booking Bar */}
          <div className="mt-20 -ml-8 md:-ml-16 lg:-ml-24 w-2/3">
            <div className="bg-white rounded-r-2xl shadow-2xl flex items-stretch pl-14">
              {/* Destination */}
              <div className="px-10 py-6 flex flex-col justify-center">
                <label className="text-gray-400 text-[10px] font-semibold tracking-widest mb-2">DESTINATION</label>
                <div className="flex items-center gap-2 border-b border-black pb-1">
                  <span className="text-gray-800 font-medium text-sm">Tokyo</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Person */}
              <div className="px-10 py-6 flex flex-col justify-center">
                <label className="text-gray-400 text-[10px] font-semibold tracking-widest mb-2">PERSON</label>
                <div className="flex items-center gap-2 border-b border-black pb-1">
                  <span className="text-gray-800 font-medium text-sm">2</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Check In */}
              <div className="px-10 py-6 flex flex-col justify-center">
                <label className="text-gray-400 text-[10px] font-semibold tracking-widest mb-2">CHECK-IN</label>
                <div className="flex items-center gap-2 border-b border-black pb-1">
                  <span className="text-gray-800 font-medium text-sm">Sun, 13th Sep 2020</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Check Out */}
              <div className="px-10 py-6 flex flex-col justify-center">
                <label className="text-gray-400 text-[10px] font-semibold tracking-widest mb-2">CHECK OUT</label>
                <div className="flex items-center gap-2 border-b border-black pb-1">
                  <span className="text-gray-800 font-medium text-sm">Tue, 27th Oct 2020</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Book Now Button */}
              <button className="ml-auto px-6 py-3 bg-brand hover:bg-brand-dark transition-colors rounded-r-2xl flex items-center justify-center gap-3 text-white font-bold">
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-lg">Book</span>
                  <span className="text-lg">Now</span>
                </div>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
