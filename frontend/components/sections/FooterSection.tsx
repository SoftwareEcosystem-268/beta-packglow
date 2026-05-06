"use client";

import Image from "next/image";

interface FooterSectionProps {
  scrollTo: (id: string) => void;
}

export default function FooterSection({ scrollTo }: FooterSectionProps) {
  return (
    <footer className="relative">
      {/* Newsletter */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 -mb-12 md:-mb-16">
        <div className="bg-[#F5F3EF] rounded-2xl shadow-xl p-5 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1">Our Newsletter</h3>
            <p className="text-gray-500 text-xs md:text-sm">รับข่าวสารท่องเที่ยวและส่วนลดพิเศษทางอีเมล</p>
          </div>
          <div className="flex w-full md:w-auto gap-2 md:gap-3">
            <input
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              className="flex-1 md:w-72 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-brand text-gray-900 text-sm"
            />
            <button className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold transition-colors shadow-md whitespace-nowrap text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="bg-[#1E1E2E] pt-20 md:pt-28 pb-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-10 mb-8 md:mb-12">
            {/* Logo & Copyright */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/asset/logo-web.svg`} alt="PackGlow" className="w-7 h-7 brightness-0 invert" />
                <span className="text-xl font-bold text-white">PackGlow</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                จัดการสัมภาระการเดินทางได้อย่างง่ายดาย พร้อม AI ช่วยแนะนำชุดและแผนการเดินทาง
              </p>
            </div>

            {/* เมนู */}
            <div>
              <h4 className="text-white font-semibold mb-4">เมนู</h4>
              <ul className="space-y-2">
                {["Home", "Destinations", "Packing", "Outfits", "Pricing"].map(item => (
                  <li key={item}>
                    <button onClick={() => scrollTo(item.toLowerCase())} className="text-white/50 hover:text-white transition-colors text-sm">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ข้อมูล */}
            <div>
              <h4 className="text-white font-semibold mb-4">ข้อมูล</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">เกี่ยวกับเรา</li>
                <li className="hover:text-white transition-colors cursor-pointer">นโยบายความเป็นส่วนตัว</li>
                <li className="hover:text-white transition-colors cursor-pointer">ข้อกำหนดการใช้งาน</li>
                <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
              </ul>
            </div>

            {/* ติดต่อ */}
            <div>
              <h4 className="text-white font-semibold mb-4">ติดต่อ</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li>support@packglow.com</li>
                <li>+66 2 XXX XXXX</li>
                <li>กรุงเทพมหานคร, ไทย</li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-white font-semibold mb-4">ติดตามเรา</h4>
              <div className="flex gap-3">
                {[
                  { name: "Facebook", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { name: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                  { name: "Twitter", icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
                ].map(s => (
                  <a key={s.name} href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-brand transition-colors" title={s.name}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 text-center text-white/40 text-sm">
            © 2026 PackGlow. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
