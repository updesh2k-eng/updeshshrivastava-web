"use client";

import { useLang } from "./LangContext";

type Locale = "en" | "de";

export function LanguageSwitcher() {
  const { lang } = useLang();

  function switchLang(newLang: Locale) {
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-1 select-none">
      <button
        onClick={() => switchLang("en")}
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold transition-opacity ${lang === "en" ? "opacity-100" : "opacity-35 hover:opacity-70"}`}
        style={{ color: "var(--muted)" }}
        aria-label="Switch to English"
        aria-pressed={lang === "en"}
      >
        <span>🇬🇧</span> EN
      </button>
      <span className="opacity-20 text-xs" style={{ color: "var(--muted)" }}>|</span>
      <button
        onClick={() => switchLang("de")}
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold transition-opacity ${lang === "de" ? "opacity-100" : "opacity-35 hover:opacity-70"}`}
        style={{ color: "var(--muted)" }}
        aria-label="Auf Deutsch wechseln"
        aria-pressed={lang === "de"}
      >
        <span>🇩🇪</span> DE
      </button>
    </div>
  );
}
