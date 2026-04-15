import { GH_API, REPO, POSTS_PATH } from "./constants";
import type { GHFile, GHContent } from "./types";

export async function ghFetch(path: string, pat: string, init?: RequestInit) {
  return fetch(`${GH_API}${path}`, {
    ...init,
    headers: {
      Authorization: `token ${pat}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
}

export function ghWriteError(msg: string): Error {
  if (/not accessible by personal access token/i.test(msg) || /resource not accessible/i.test(msg)) {
    return new Error(
      "Token lacks write access. Sign out, then create a new Classic token at github.com/settings/tokens/new — tick the 'repo' checkbox."
    );
  }
  return new Error(msg);
}

export async function listPosts(pat: string): Promise<GHFile[]> {
  const res = await ghFetch(`/repos/${REPO}/contents/${POSTS_PATH}`, pat);
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return (Array.isArray(data) ? data : []).filter((f: GHFile) => f.name.endsWith(".mdx"));
}

export async function readPost(pat: string, slug: string): Promise<{ raw: string; sha: string }> {
  const res = await ghFetch(`/repos/${REPO}/contents/${POSTS_PATH}/${slug}.mdx`, pat);
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  const data: GHContent = await res.json();
  const raw = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ""))));
  return { raw, sha: data.sha };
}

export async function writePost(pat: string, slug: string, raw: string, sha?: string) {
  const content = btoa(unescape(encodeURIComponent(raw)));
  const body: Record<string, string> = {
    message: sha ? `feat: update post "${slug}"` : `feat: add post "${slug}"`,
    content,
  };
  if (sha) body.sha = sha;
  const res = await ghFetch(`/repos/${REPO}/contents/${POSTS_PATH}/${slug}.mdx`, pat, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw ghWriteError((err as { message?: string }).message || `GitHub ${res.status}: ${res.statusText}`);
  }
}

export async function deletePost(pat: string, slug: string, sha: string) {
  const res = await ghFetch(`/repos/${REPO}/contents/${POSTS_PATH}/${slug}.mdx`, pat, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: `chore: remove post "${slug}"`, sha }),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
}
