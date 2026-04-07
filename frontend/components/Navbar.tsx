"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const isDark = variant === "dark";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const hoverColor = isDark ? "hover:text-brand" : "hover:text-brand-dark";
  const logoColor = isDark ? "text-white" : "text-gray-900";

  return (
    <header className={`flex items-center justify-between px-8 md:px-16 lg:px-24 py-6 ${isDark ? "" : "bg-white shadow-sm"}`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <img src="/asset/logo-web.svg" alt="PackGlow" className="w-8 h-8" />
        <span className={`text-2xl font-bold ${logoColor}`}>PackGlow</span>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <NavLink href="/" pathname={pathname} textColor={textColor} hoverColor={hoverColor}>Home</NavLink>
        <NavLink href="/destinations" pathname={pathname} textColor={textColor} hoverColor={hoverColor}>Destinations</NavLink>
        <NavLink href="/packing" pathname={pathname} textColor={textColor} hoverColor={hoverColor}>Packing</NavLink>
        <NavLink href="/outfits" pathname={pathname} textColor={textColor} hoverColor={hoverColor}>Outfits</NavLink>
        <NavLink href="/pricing" pathname={pathname} textColor={textColor} hoverColor={hoverColor}>Pricing</NavLink>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
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
      </div>
    </header>
  );
}
