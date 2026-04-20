"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Crown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface NavbarProps {
  variant?: "dark" | "light";
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  pathname: string;
  textColor: string;
  hoverColor: string;
}

// Move NavLink outside of Navbar component
const NavLink = ({ href, children, pathname, textColor, hoverColor }: NavLinkProps) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`${textColor} font-medium ${hoverColor} transition-colors relative pb-1`}
    >
      {children}
      {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />}
    </Link>
  );
};

export default function Navbar({ variant = "dark" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userTier, setUserTier] = useState<"free" | "pro">("free");
  const menuRef = useRef<HTMLDivElement>(null);

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
  const textColor = isDark ? "text-white" : "text-gray-900";
  const hoverColor = isDark ? "hover:text-brand" : "hover:text-brand-dark";
  const logoColor = isDark ? "text-white" : "text-gray-900";

  const scrollNav = (id: string) => {
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <header className={`flex items-center justify-between px-8 md:px-16 lg:px-24 py-6 ${isDark ? "" : "bg-white shadow-sm"}`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/asset/logo-web.svg"
          alt="PackGlow"
          className={`w-8 h-8 ${!isDark ? "brightness-0" : ""}`}
        />
        <span className={`text-2xl font-bold ${logoColor}`}>PackGlow</span>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <button onClick={() => scrollNav("hero")} className={`${textColor} font-medium ${hoverColor} transition-colors`}>Home</button>
        <button onClick={() => scrollNav("destinations")} className={`${textColor} font-medium ${hoverColor} transition-colors`}>Destinations</button>
        <Link href="/packing" className={`${textColor} font-medium ${hoverColor} transition-colors`}>Packing</Link>
        <Link href="/outfits" className={`${textColor} font-medium ${hoverColor} transition-colors`}>Outfits</Link>
        <button onClick={() => scrollNav("pricing")} className={`${textColor} font-medium ${hoverColor} transition-colors`}>Pricing</button>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
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
                      {userTier === "pro" ? (
                        <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); router.push("/"); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    ออกจากบัญชี
                  </button>
                </div>
              )}
            </div>
        ) : (
          <>
            <Link
              href="/login"
              className={`${textColor} font-medium ${hoverColor} transition-colors relative pb-1`}
            >
              Login
              {pathname === "/login" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />}
            </Link>
            <Link href="/signup" className="relative">
              <Button className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-md font-medium">
                Sign Up
              </Button>
              {pathname === "/signup" && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand" />}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
