"use client";

import { useEffect, useState } from "react";
import type { AlumniProfile } from "./alumni-profile";
import { ACCOUNT_CHANGE_EVENT, api } from "./account-api";

export function useResource<T>(path: string) {
  const [result, setResult] = useState<{ path: string; data?: T; ready: boolean; error: string }>({ path, ready: false, error: "" });
  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    async function refresh() {
      controller?.abort();
      controller = new AbortController();
      try {
        const data = await api<T>(path, "GET", undefined, controller.signal);
        if (active) setResult({ path, data, ready: true, error: "" });
      } catch (cause) {
        if (active && !(cause instanceof DOMException && cause.name === "AbortError")) setResult({ path, ready: true, error: cause instanceof Error ? cause.message : "Unable to load this page." });
      }
    }
    const onChange = () => { void refresh(); };
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
  const { data, ready, error } = useResource<{ profile: AlumniProfile | null; officer: { name: string } | null }>("/api/account/session");
  return { profile: data?.profile ?? null, officer: data?.officer ?? null, ready, error };
}

export function useApplications() {
  const { data, ready, error } = useResource<{ applications: AlumniProfile[] }>("/api/applications");
  return { applications: data?.applications ?? [], ready, error };
}
