"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { View } from "./types";
import { LoginScreen } from "./LoginScreen";
import { DashboardScreen } from "./DashboardScreen";
import { PostListScreen } from "./PostListScreen";
import { PostEditorScreen } from "./PostEditorScreen";
import { NavEditorScreen } from "./NavEditorScreen";
import { HomeEditorScreen } from "./HomeEditorScreen";
import { ImagesScreen } from "./ImagesScreen";
import { MemoryScreen } from "./MemoryScreen";
import { CommentsScreen } from "./CommentsScreen";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<View>({ name: "login" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { setAuthed(true); setView({ name: "dashboard" }); }
      setMounted(true);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setAuthed(false); setView({ name: "login" }); }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!mounted) return null;

  async function handleLogout() {
    await supabase.auth.signOut();
    setAuthed(false);
    setView({ name: "login" });
  }

  if (!authed || view.name === "login")
    return <LoginScreen onLogin={() => { setAuthed(true); setView({ name: "dashboard" }); }} />;

  if (view.name === "dashboard")
    return <DashboardScreen onLogout={handleLogout} onNav={(dest) => {
      if (dest === "posts") setView({ name: "posts" });
      else if (dest === "nav") setView({ name: "nav" });
      else if (dest === "home") setView({ name: "home" });
      else if (dest === "images") setView({ name: "images" });
      else if (dest === "memory") setView({ name: "memory" });
      else if (dest === "comments") setView({ name: "comments" });
    }} />;

  if (view.name === "posts")
    return <PostListScreen onLogout={handleLogout}
      onBack={() => setView({ name: "dashboard" })}
      onNew={() => setView({ name: "new" })}
      onEdit={(id) => setView({ name: "edit", id })} />;

  if (view.name === "new")
    return <PostEditorScreen onDone={() => setView({ name: "posts" })} />;

  if (view.name === "edit")
    return <PostEditorScreen id={view.id} onDone={() => setView({ name: "posts" })} />;

  if (view.name === "nav")
    return <NavEditorScreen onDone={() => setView({ name: "dashboard" })} />;

  if (view.name === "home")
    return <HomeEditorScreen onDone={() => setView({ name: "dashboard" })} />;

  if (view.name === "images")
    return <ImagesScreen onDone={() => setView({ name: "dashboard" })} />;

  if (view.name === "memory")
    return <MemoryScreen onBack={() => setView({ name: "dashboard" })} />;

  if (view.name === "comments")
    return <CommentsScreen onBack={() => setView({ name: "dashboard" })} />;
}
