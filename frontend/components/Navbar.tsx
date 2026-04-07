"use client";

import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  variant?: "dark" | "light";
}

// Move NavLink outside of Navbar component
const NavLink = ({
  href,
  children,
  isActive,
  textColor,
  hoverColor,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  textColor: string;
  hoverColor: string;
}) => (
  <Link
    href={href}
    className={`${textColor} font-medium ${hoverColor} transition-colors relative pb-1`}
  >
    {children}
    {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />}
  </Link>
);

export default function Navbar({ variant = "dark" }: NavbarProps) {
  const pathname = usePathname();

  const isDark = variant === "dark";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const hoverColor = isDark ? "hover:text-brand" : "hover:text-brand-dark";
  const logoColor = isDark ? "text-white" : "text-gray-900";
  const compassColor = isDark ? "text-white" : "text-brand";

  return (
    <header className={`flex items-center justify-between px-8 md:px-16 lg:px-24 py-6 ${isDark ? "" : "bg-white shadow-sm"}`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Compass className={`w-8 h-8 ${compassColor}`} />
        <span className={`text-2xl font-bold ${logoColor}`}>PackGlow</span>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <NavLink href="/" isActive={pathname === "/"} textColor={textColor} hoverColor={hoverColor}>Home</NavLink>
        <NavLink href="/destinations" isActive={pathname === "/destinations"} textColor={textColor} hoverColor={hoverColor}>Destinations</NavLink>
        <NavLink href="/packing" isActive={pathname === "/packing"} textColor={textColor} hoverColor={hoverColor}>Packing</NavLink>
        <NavLink href="/outfits" isActive={pathname === "/outfits"} textColor={textColor} hoverColor={hoverColor}>Outfits</NavLink>
        <NavLink href="/pricing" isActive={pathname === "/pricing"} textColor={textColor} hoverColor={hoverColor}>Pricing</NavLink>
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
