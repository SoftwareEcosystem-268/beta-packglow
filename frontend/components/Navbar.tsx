"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { User, Crown, Menu, X, UserCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface NavbarProps {
  variant?: "dark" | "light";
}

export default function Navbar({ variant = "dark" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userTier, setUserTier] = useState<"free" | "pro">("free");
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const isDark = variant === "dark";

  useEffect(() => {
    const readTier = () => {
      const saved = localStorage.getItem("pg_user_tier");
      if (saved === "pro" || saved === "free") setUserTier(saved);
    };
    readTier();
    const onStorage = () => readTier();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileNavOpen]);

  const textColor = isDark ? "text-white" : "text-gray-900";
  const hoverColor = isDark ? "hover:text-brand" : "hover:text-brand-dark";
  const logoColor = isDark ? "text-white" : "text-gray-900";

  const scrollNav = (id: string) => {
    setMobileNavOpen(false);
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const navLinks = [
    { id: "hero", label: "Home", type: "scroll" },
    { id: "destinations", label: "Destinations", type: "scroll" },
    { id: "/packing", label: "Packing", type: "link" },
    { id: "/outfits", label: "Outfits", type: "link" },
    { id: "bookings", label: "Bookings", type: "scroll" },
    { id: "pricing", label: "Pricing", type: "scroll" },
  ];

  return (
    <header className={`flex items-center justify-between px-4 md:px-8 lg:px-24 py-4 md:py-6 ${isDark ? "" : "bg-white shadow-sm"}`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 flex-shrink-0">
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/asset/logo-web.svg`}
          alt="PackGlow"
          className={`w-7 h-7 md:w-8 md:h-8 ${!isDark ? "brightness-0" : ""}`}
        />
        <span className={`text-xl md:text-2xl font-bold ${logoColor}`}>PackGlow</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map((link) =>
          link.type === "scroll" ? (
            <button key={link.id} onClick={() => scrollNav(link.id)} className={`${textColor} font-medium ${hoverColor} transition-colors`}>
              {link.label}
            </button>
          ) : (
            <Link key={link.id} href={link.id} className={`${textColor} font-medium ${hoverColor} transition-colors`}>
              {link.label}
            </Link>
          )
        )}
      </nav>

      <div className="flex items-center gap-3">
        {/* Auth */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-9 h-9 rounded-full bg-brand flex items-center justify-center hover:bg-brand-dark transition-colors"
            >
              <User className="w-5 h-5 text-white" />
              {userTier === "pro" ? (
                <Crown className="absolute -top-1.5 -right-1.5 w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
              ) : (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gray-300 border-2 border-white" />
              )}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${userTier === "pro" ? "bg-brand" : "bg-gray-300"}`}>
                    {userTier === "pro" ? <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button onClick={() => { router.push("/profile"); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  โปรไฟล์
                </button>
                <button onClick={() => { logout(); router.push("/"); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  ออกจากบัญชี
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className={`${textColor} font-medium ${hoverColor} transition-colors hidden sm:inline-block`}>
              Login
            </Link>
            <Link href="/signup">
              <Button className="bg-brand hover:bg-brand-dark text-white px-4 sm:px-6 py-2 rounded-md font-medium text-sm">
                Sign Up
              </Button>
            </Link>
          </>
        )}

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className={`md:hidden w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"} transition-colors`}
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 top-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileNavOpen(false)}>
          <div
            ref={mobileNavRef}
            className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-gray-900">PackGlow</span>
              <button onClick={() => setMobileNavOpen(false)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navLinks.map((link) =>
                link.type === "scroll" ? (
                  <button
                    key={link.id}
                    onClick={() => scrollNav(link.id)}
                    className="w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.id}
                    href={link.id}
                    onClick={() => setMobileNavOpen(false)}
                    className="block px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
            {!user && (
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <Link href="/login" onClick={() => setMobileNavOpen(false)} className="block w-full text-center py-3 rounded-xl border-2 border-brand text-brand font-medium hover:bg-brand/5">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMobileNavOpen(false)} className="block w-full text-center py-3 rounded-xl bg-brand text-white font-medium hover:bg-brand-dark">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
