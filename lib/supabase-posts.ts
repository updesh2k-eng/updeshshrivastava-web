import { supabase } from "./supabase";

export interface SupabasePost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  content_json: object | null;
  tags: string[];
  cover_image: string | null;
  status: "draft" | "published";
  published_at: string | null;
  read_time: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export type PostInput = Omit<SupabasePost, "id" | "views" | "created_at" | "updated_at">;

/** Public: published posts only, no body content (for listings) */
export async function getPublishedPosts(): Promise<SupabasePost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("id,slug,title,excerpt,tags,cover_image,status,published_at,read_time,views,created_at,updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SupabasePost[];
}

/** Public: single published post with full content */
export async function getPublishedPostBySlug(slug: string): Promise<SupabasePost | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) return null;
  return data as SupabasePost;
}

/** Admin: all posts regardless of status */
export async function getAllPostsAdmin(): Promise<SupabasePost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("id,slug,title,excerpt,tags,status,published_at,read_time,views,created_at,updated_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SupabasePost[];
}

/** Admin: single post with full content (any status) */
export async function getPostByIdAdmin(id: string): Promise<SupabasePost | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as SupabasePost;
}

export async function createPost(post: Partial<PostInput>): Promise<SupabasePost> {
  const { data, error } = await supabase
    .from("posts")
    .insert([post])
    .select()
    .single();
  if (error) throw error;
  return data as SupabasePost;
}

export async function updatePost(id: string, updates: Partial<PostInput>): Promise<SupabasePost> {
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as SupabasePost;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

/** Increments views via a Postgres RPC — run this SQL once:
 *  create or replace function increment_views(post_slug text)
 *  returns void language plpgsql security definer as $$
 *  begin update posts set views = views + 1 where slug = post_slug; end;
 *  $$;
 */
export async function incrementViewCount(slug: string): Promise<void> {
  await supabase.rpc("increment_views", { post_slug: slug });
}

export async function submitContact(name: string, email: string, message: string): Promise<void> {
  const { error } = await supabase
    .from("contact_messages")
    .insert([{ name, email, message }]);
  if (error) throw error;
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  const { error } = await supabase
    .from("subscribers")
    .insert([{ email }]);
  if (error) {
    if (error.code === "23505") throw new Error("You're already subscribed.");
    throw error;
  }
}
