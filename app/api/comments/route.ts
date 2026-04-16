import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { post_slug, author_name, author_email, content } = body;

    if (!post_slug || !author_name || !author_email || !content) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (content.trim().length < 3) {
      return NextResponse.json({ error: "Comment is too short." }, { status: 400 });
    }

    if (content.trim().length > 2000) {
      return NextResponse.json({ error: "Comment is too long (max 2000 characters)." }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(author_email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const { error } = await supabase.from("comments").insert([{
      post_slug: String(post_slug).slice(0, 200),
      author_name: String(author_name).slice(0, 100),
      author_email: String(author_email).slice(0, 200),
      content: String(content).trim().slice(0, 2000),
      status: "pending",
    }]);

    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Comment submission error:", err);
    return NextResponse.json({ error: "Failed to submit comment." }, { status: 500 });
  }
}
