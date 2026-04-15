"use client";

import { useRouter } from "next/navigation";
import { useLang } from "./LangContext";

export function LanguageSwitcher() {
  const { lang } = useLang();
  const router = useRouter();

  function switchLang(newLang: Locale) {
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-0.5 text-xs font-semibold select-none">
      <button
        onClick={() => switchLang("en")}
        className={`px-1.5 py-0.5 rounded transition-opacity ${lang === "en" ? "opacity-100" : "opacity-35 hover:opacity-70"}`}
        style={{ color: "var(--muted)" }}
        aria-label="Switch to English"
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <span className="opacity-30" style={{ color: "var(--muted)" }}>|</span>
      <button
        onClick={() => switchLang("de")}
        className={`px-1.5 py-0.5 rounded transition-opacity ${lang === "de" ? "opacity-100" : "opacity-35 hover:opacity-70"}`}
        style={{ color: "var(--muted)" }}
        aria-label="Auf Deutsch wechseln"
        aria-pressed={lang === "de"}
      >
        DE
      </button>
    </div>
  );
}

type Locale = "en" | "de";
