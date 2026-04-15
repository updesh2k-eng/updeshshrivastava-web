"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import type { NavLink } from "@/lib/config";

export function Navbar({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{ borderColor: "var(--border)", background: "rgba(10,10,15,0.7)" }}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo-icon.png"
            alt="Updesh Shrivastava"
            width={36}
            height={36}
            className="rounded-lg"
            priority
          />
          <span className="text-sm font-bold tracking-tight gradient-text hidden sm:inline">
            Updesh Shrivastava
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm font-medium transition-colors duration-200",
                pathname === link.href
                  ? "gradient-text"
                  : "hover:opacity-80"
              )}
              style={pathname !== link.href ? { color: "var(--muted)" } : {}}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border cursor-pointer"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav
          className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{ borderColor: "var(--border)", background: "var(--background)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "text-sm font-medium transition-colors duration-200",
                pathname === link.href ? "gradient-text" : ""
              )}
              style={pathname !== link.href ? { color: "var(--muted)" } : {}}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
