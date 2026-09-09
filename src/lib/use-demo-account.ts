"use client";

import { useMemo, useSyncExternalStore } from "react";
import { type AlumniProfile } from "./alumni-profile";
import { currentDemoProfile, DEMO_CHANGE_EVENT } from "./demo-account";

export function subscribeToDemoChanges(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DEMO_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DEMO_CHANGE_EVENT, callback);
  };
}

function snapshot(): string | null {
  try {
    const profile = currentDemoProfile();
    return profile ? JSON.stringify(profile) : null;
  } catch { return null; }
}

const serverSnapshot = () => undefined;

export function useDemoAccount() {
  const value = useSyncExternalStore<string | null | undefined>(subscribeToDemoChanges, snapshot, serverSnapshot);
  const profile = useMemo(() => value ? JSON.parse(value) as AlumniProfile : null, [value]);
  return { profile, ready: value !== undefined };
}
