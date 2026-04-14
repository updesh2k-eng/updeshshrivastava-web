"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import type { NavLink } from "@/lib/config";

export function SiteChrome({
  children,
  navLinks,
}: {
  children: React.ReactNode;
  navLinks: NavLink[];
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      <Navbar navLinks={navLinks.filter((l) => l.visible)} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  );
}
