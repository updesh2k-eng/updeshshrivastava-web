"use client";

import { useState, useEffect } from "react";
import { PAT_KEY } from "./constants";
import type { View } from "./types";
import { LoginScreen } from "./LoginScreen";
import { DashboardScreen } from "./DashboardScreen";
import { PostListScreen } from "./PostListScreen";
import { PostEditorScreen } from "./PostEditorScreen";
import { NavEditorScreen } from "./NavEditorScreen";
import { HomeEditorScreen } from "./HomeEditorScreen";
import { ImagesScreen } from "./ImagesScreen";

export default function AdminPage() {
  const [pat, setPat] = useState<string | null>(null);
  const [view, setView] = useState<View>({ name: "login" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PAT_KEY);
    if (stored) { setPat(stored); setView({ name: "dashboard" }); }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function handleLogin(token: string) { setPat(token); setView({ name: "dashboard" }); }
  function handleLogout() { localStorage.removeItem(PAT_KEY); setPat(null); setView({ name: "login" }); }

  if (!pat || view.name === "login") return <LoginScreen onLogin={handleLogin} />;

  if (view.name === "dashboard") return (
    <DashboardScreen pat={pat} onLogout={handleLogout}
      onNav={(dest) => {
        if (dest === "posts") setView({ name: "posts" });
        else if (dest === "nav") setView({ name: "nav" });
        else if (dest === "home") setView({ name: "home" });
        else if (dest === "images") setView({ name: "images" });
      }} />
  );

  if (view.name === "posts") return (
    <PostListScreen pat={pat} onLogout={handleLogout}
      onBack={() => setView({ name: "dashboard" })}
      onNew={() => setView({ name: "new" })}
      onEdit={(id) => setView({ name: "edit", id })} />
  );

  if (view.name === "new") return (
    <PostEditorScreen pat={pat} onDone={() => setView({ name: "posts" })} />
  );

  if (view.name === "edit") return (
    <PostEditorScreen pat={pat} id={view.id} onDone={() => setView({ name: "posts" })} />
  );

  if (view.name === "nav") return (
    <NavEditorScreen pat={pat} onDone={() => setView({ name: "dashboard" })} />
  );

  if (view.name === "home") return (
    <HomeEditorScreen pat={pat} onDone={() => setView({ name: "dashboard" })} />
  );

  if (view.name === "images") return (
    <ImagesScreen pat={pat} onDone={() => setView({ name: "dashboard" })} />
  );
}
