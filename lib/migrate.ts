import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { supabase } from "./supabase";

const postsDirectory = path.join(process.cwd(), "content/posts");

export async function migrateMdxToSupabase() {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const slug = filename.replace(/\.mdx$/, "");

    const { error } = await supabase.from("posts").upsert({
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      tags: data.tags || [],
      content: content, // Initially storing raw markdown
      status: "published",
    });

    if (error) console.error(`Failed to migrate ${slug}:`, error.message);
    else console.log(`Migrated: ${slug}`);
  }
}
