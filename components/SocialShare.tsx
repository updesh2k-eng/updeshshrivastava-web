"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

export function SocialShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const btnCls =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:opacity-70";
  const btnStyle = { borderColor: "var(--border)", color: "var(--muted)", background: "var(--card)" };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider mr-1" style={{ color: "var(--muted)" }}>
        Share
      </span>
      <a href={twitterHref} target="_blank" rel="noopener noreferrer" className={btnCls} style={btnStyle}>
        Twitter / X
      </a>
      <a href={linkedinHref} target="_blank" rel="noopener noreferrer" className={btnCls} style={btnStyle}>
        LinkedIn
      </a>
      <button onClick={copyLink} className={btnCls} style={btnStyle}>
        <Link2 size={12} /> {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
