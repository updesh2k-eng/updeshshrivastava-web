"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

interface Props {
  locale?: "en" | "de";
}

/**
 * LinkedIn official profile badge widget.
 * Uses LinkedIn's badge script (platform.linkedin.com/badges/js/profile.js).
 * The script reads data-* attributes from the div and replaces it with the badge HTML.
 * Dark mode is handled via data-theme="dark".
 */
export function LinkedInBadge({ locale = "en" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // If the LinkedIn script already loaded (e.g. soft navigation), trigger it manually
  useEffect(() => {
    if (typeof window !== "undefined" && (window as { LIRenderAll?: () => void }).LIRenderAll) {
      (window as { LIRenderAll?: () => void }).LIRenderAll?.();
    }
  }, []);

  const heading = locale === "de" ? "LinkedIn-Profil" : "LinkedIn Profile";
  const fallbackLabel = locale === "de" ? "Profil ansehen" : "View Profile";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{heading}</h2>

      {/* LinkedIn badge container */}
      <div ref={containerRef} className="flex flex-col items-start gap-4">
        <div
          className="badge-base LI-profile-badge"
          data-locale={locale === "de" ? "de_DE" : "en_US"}
          data-size="large"
          data-theme="dark"
          data-type="HORIZONTAL"
          data-vanity="updesh-shrivastava-70123814"
          data-version="v1"
        />

        {/* Fallback link — always visible as the badge can be blocked by ad blockers */}
        <a
          href="https://www.linkedin.com/in/updesh-shrivastava-70123814/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-opacity hover:opacity-80"
          style={{ background: "rgba(10,102,194,0.12)", color: "#0a66c2", border: "1px solid rgba(10,102,194,0.3)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          {fallbackLabel}
        </a>
      </div>

      <Script
        src="https://platform.linkedin.com/badges/js/profile.js"
        strategy="lazyOnload"
        onLoad={() => {
          (window as { LIRenderAll?: () => void }).LIRenderAll?.();
        }}
      />
    </div>
  );
}
