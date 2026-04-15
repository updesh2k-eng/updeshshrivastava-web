"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n";

type LangContextValue = {
  lang: Locale;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextValue>({
  lang: "en",
  t: (key) => key,
});

export function LangProvider({
  lang,
  messages,
  children,
}: {
  lang: Locale;
  messages: Record<string, string>;
  children: React.ReactNode;
}) {
  const t = (key: string) => messages[key] ?? key;
  return (
    <LangContext.Provider value={{ lang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
