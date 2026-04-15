#!/usr/bin/env node
/**
 * translate-ui.mjs
 * Translates new/missing keys from messages/en.json into messages/de.json
 * using the Google Cloud Translation API.
 *
 * Usage:
 *   GOOGLE_TRANSLATE_API_KEY=your_key node scripts/translate-ui.mjs
 *   GOOGLE_TRANSLATE_API_KEY=your_key node scripts/translate-ui.mjs --target fr
 *
 * Options:
 *   --target <lang>  Target language code (default: de)
 *   --force          Re-translate all keys, even ones already present
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
if (!API_KEY) {
  console.error("Error: GOOGLE_TRANSLATE_API_KEY environment variable is not set.");
  process.exit(1);
}

// Parse args
const args = process.argv.slice(2);
const targetIdx = args.indexOf("--target");
const target = targetIdx !== -1 ? args[targetIdx + 1] : "de";
const force = args.includes("--force");

const enPath = join(ROOT, "messages", "en.json");
const targetPath = join(ROOT, "messages", `${target}.json`);

const enMessages = JSON.parse(readFileSync(enPath, "utf-8"));
let targetMessages = {};
try {
  targetMessages = JSON.parse(readFileSync(targetPath, "utf-8"));
} catch {
  console.log(`No existing ${target}.json — will create it from scratch.`);
}

// Find keys that need translation
const keysToTranslate = Object.keys(enMessages).filter(
  (key) => force || !(key in targetMessages)
);

if (keysToTranslate.length === 0) {
  console.log(`All keys already translated in ${target}.json. Use --force to re-translate.`);
  process.exit(0);
}

console.log(`Translating ${keysToTranslate.length} key(s) to "${target}"...`);

// Batch translate via Google API (max 128 strings per request)
const BATCH_SIZE = 128;
async function translateBatch(texts) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: texts, source: "en", target, format: "text" }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Translate API error (${res.status}): ${err}`);
  }
  const json = await res.json();
  return json.data.translations.map((t) => t.translatedText);
}

const allTexts = keysToTranslate.map((k) => enMessages[k]);
const translated = [];
for (let i = 0; i < allTexts.length; i += BATCH_SIZE) {
  const batch = allTexts.slice(i, i + BATCH_SIZE);
  const results = await translateBatch(batch);
  translated.push(...results);
  if (allTexts.length > BATCH_SIZE) {
    console.log(`  Translated ${Math.min(i + BATCH_SIZE, allTexts.length)} / ${allTexts.length}`);
  }
}

// Merge results back, preserving order from en.json
const merged = { ...enMessages }; // start with en keys order
Object.keys(enMessages).forEach((key) => {
  const idx = keysToTranslate.indexOf(key);
  merged[key] = idx !== -1 ? translated[idx] : (targetMessages[key] ?? enMessages[key]);
});

writeFileSync(targetPath, JSON.stringify(merged, null, 2) + "\n", "utf-8");
console.log(`✓ Wrote ${Object.keys(merged).length} keys to messages/${target}.json`);
console.log("  Review the output before committing — machine translations may need tweaks.");
