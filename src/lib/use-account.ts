"use client";

import { useEffect, useState } from "react";
import type { AlumniProfile } from "./alumni-profile";
import { ACCOUNT_CHANGE_EVENT, api } from "./account-api";

const resourceCache = new Map<string, unknown>();

export function useResource<T>(path: string) {
  const cached = resourceCache.get(path) as { profile?: AlumniProfile | null } | undefined;
  const hasUsableSession = path !== "/api/account/session" || cached?.profile;
  const [result, setResult] = useState<{ path: string; data?: T; ready: boolean; error: string }>(() => ({
    path,
    data: resourceCache.get(path) as T | undefined,
    ready: resourceCache.has(path) && Boolean(hasUsableSession),
    error: "",
  }));
  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    async function refresh() {
      controller?.abort();
      controller = new AbortController();
      try {
        const data = await api<T>(path, "GET", undefined, controller.signal);
        resourceCache.set(path, data);
        if (active) setResult({ path, data, ready: true, error: "" });
      } catch (cause) {
        if (active && !(cause instanceof DOMException && cause.name === "AbortError")) setResult({ path, ready: true, error: cause instanceof Error ? cause.message : "Unable to load this page." });
      }
    }
    const onChange = () => {
      resourceCache.delete(path);
      setResult({ path, ready: false, error: "" });
      void refresh();
    };
    const onFocus = () => { if (document.visibilityState === "visible") void refresh(); };
    const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(ACCOUNT_CHANGE_EVENT);
    if (channel) channel.onmessage = onChange;
    window.addEventListener(ACCOUNT_CHANGE_EVENT, onChange);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    const timer = window.setInterval(onFocus, 30_000);
    void refresh();
    return () => {
      active = false;
      controller?.abort();
      channel?.close();
      window.clearInterval(timer);
      window.removeEventListener(ACCOUNT_CHANGE_EVENT, onChange);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [path]);
  return result.path === path ? result : { path, ready: false, error: "", data: undefined };
}

export function useAccount() {
  const { data, ready, error } = useResource<{ profile: AlumniProfile | null; officer: { name: string } | null; mustChangePassword: boolean }>("/api/account/session");
  return { profile: data?.profile ?? null, officer: data?.officer ?? null, mustChangePassword: data?.mustChangePassword ?? false, ready, error };
}

export function useApplications() {
  const { data, ready, error } = useResource<{ applications: AlumniProfile[] }>("/api/applications");
  return { applications: data?.applications ?? [], ready, error };
}
