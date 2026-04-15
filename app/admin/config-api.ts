import type { SiteConfig } from "./types";
import { supabase } from "@/lib/supabase";

/**
 * Read site config from Supabase.
 * Returns { config, sha: "" } — sha kept for API compatibility with existing screens.
 */
export async function readConfig(): Promise<{ config: SiteConfig; sha: string }> {
  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "main")
    .single();
  if (error || !data) {
    throw new Error(
      error?.message
        ? `Failed to load config: ${error.message}`
        : "Failed to load config: no data returned"
    );
  }
  return { config: data.value as SiteConfig, sha: "" };
}

/**
 * Write site config to Supabase.
 * Requires an active authenticated session (admin login).
 * The sha parameter is unused — kept for API compatibility.
 */
export async function writeConfig(config: SiteConfig, _sha?: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated — please log in to the admin panel first.");

  const { error } = await supabase
    .from("site_config")
    .upsert({ key: "main", value: config }, { onConflict: "key" });

  if (error) {
    throw new Error(
      error.message ? `Save failed: ${error.message}` : "Save failed"
    );
  }
}
