"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Crown } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";

interface HomeNavbarProps {
  isPro: boolean;
  scrollTo: (id: string) => void;
}

const NAV_LINKS = [
  { id: "hero", label: "Home" },
  { id: "destinations", label: "Destinations" },
  { id: "packing", label: "Packing" },
  { id: "outfits", label: "Outfits" },
  { id: "bookings", label: "Bookings" },
  { id: "pricing", label: "Pricing" },
];

export default function HomeNavbar({ isPro, scrollTo }: HomeNavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-24 py-3 md:py-5 bg-white/80 backdrop-blur-md shadow-sm">
      <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
        <Image src="/asset/logo-web.svg" alt="PackGlow" width={32} height={32} className="w-7 h-7 md:w-8 md:h-8 brightness-0" />
        <span className="text-lg md:text-2xl font-bold text-gray-900">PackGlow</span>
      </button>
      <nav className="hidden lg:flex items-center gap-6">
        {NAV_LINKS.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)} className="text-gray-700 font-medium hover:text-brand transition-colors text-sm">
            {s.label}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-2 md:gap-4">
        {user ? (
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="relative w-8 h-8 md:w-9 md:h-9 rounded-full bg-brand flex items-center justify-center hover:bg-brand-dark transition-colors">
              <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
              {isPro ? (
                <Crown className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
              ) : (
                <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gray-300 border-2 border-white/80" />
              )}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 md:top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isPro ? "bg-brand" : "bg-gray-300"}`}>
                    {isPro ? <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="lg:hidden border-t border-gray-100 py-1">
                  {NAV_LINKS.map(s => (
                    <button key={s.id} onClick={() => { scrollTo(s.id); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button onClick={() => { router.push("/profile"); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    โปรไฟล์
                  </button>
                </div>
                <button onClick={() => { logout(); router.push("/"); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="text-gray-700 font-medium hover:text-brand transition-colors text-sm hidden sm:inline-block">Login</Link>
            <Link href="/signup"><Button className="bg-brand hover:bg-brand-dark text-white px-3 md:px-6 py-1.5 md:py-2 rounded-md font-medium text-sm">Sign Up</Button></Link>
          </>
        )}
      </div>
    </header>
  );
}
