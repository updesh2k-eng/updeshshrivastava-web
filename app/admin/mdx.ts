import type { PostFields } from "./types";

export function buildMdx(f: PostFields): string {
  const tagList = f.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const tagsYaml = `[${tagList.map((t) => `"${t}"`).join(", ")}]`;
  return [
    "---",
    `title: "${f.title.replace(/"/g, '\\"')}"`,
    `date: "${f.date}"`,
    `excerpt: "${f.excerpt.replace(/"/g, '\\"')}"`,
    `tags: ${tagsYaml}`,
    `readTime: "${f.readTime}"`,
    "---",
    "",
    f.content,
  ].join("\n");
}

export function parseMdx(raw: string): PostFields {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) return { title: "", date: "", excerpt: "", tags: "", readTime: "", content: raw };

  const yaml = fmMatch[1];
  const content = fmMatch[2].trimStart();

  const str = (key: string) => {
    const m = yaml.match(new RegExp(`^${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "m"));
    return m ? m[1].replace(/\\"/g, '"') : "";
  };
  const tagStr = () => {
    const m = yaml.match(/^tags:\s*\[([^\]]*)\]/m);
    if (!m) return "";
    return m[1].split(",").map((t) => t.trim().replace(/^"|"$/g, "")).join(", ");
  };

  return {
    title: str("title"),
    date: str("date"),
    excerpt: str("excerpt"),
    tags: tagStr(),
    readTime: str("readTime"),
    content,
  };
}

export function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
