import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { slug } = (await req.json()) as { slug?: string };
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 });

    // Try the RPC first (atomic, no race condition)
    const { error: rpcErr } = await supabase.rpc("increment_views", { post_slug: slug });

    if (rpcErr) {
      // RPC not set up yet — fall back to read-modify-write (fine for low traffic)
      const { data } = await supabase
        .from("posts")
        .select("id, views")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (data) {
        await supabase
          .from("posts")
          .update({ views: (data.views ?? 0) + 1 })
          .eq("id", data.id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
