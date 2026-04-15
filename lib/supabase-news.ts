import { supabase } from "./supabase";

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  url: string;
  source: string;
  source_url: string | null;
  image_url: string | null;
  published_at: string | null;
  category: string | null;
  relevance_score: number | null;
  created_at: string;
}

/**
 * Fetch the most recent AI news items, newest first.
 * Only items from the past `days` days are returned.
 */
export async function getNewsItems(limit = 100, days = 14): Promise<NewsItem[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("news_items")
    .select("id,title,excerpt,url,source,source_url,image_url,published_at,category,relevance_score,created_at")
    .gte("published_at", since)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as NewsItem[];
}
