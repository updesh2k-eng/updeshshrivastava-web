import { cookies } from "next/headers";
import enMessages from "../messages/en.json";
import deMessages from "../messages/de.json";

export type Locale = "en" | "de";

const messages: Record<Locale, Record<string, string>> = {
  en: enMessages,
  de: deMessages,
};

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return cookieStore.get("lang")?.value === "de" ? "de" : "en";
}

/** Server-side t() — call in async server components */
export async function getT(): Promise<(key: string) => string> {
  const locale = await getLocale();
  const msgs = messages[locale];
  return (key: string) =>
    msgs[key as keyof typeof msgs] ??
    enMessages[key as keyof typeof enMessages] ??
    key;
}
