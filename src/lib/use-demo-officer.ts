"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { AlumniProfile } from "./alumni-profile";
import { currentDemoOfficer, demoApplications } from "./demo-account";
import { subscribeToDemoChanges } from "./use-demo-account";

function officerSnapshot() {
  try { return currentDemoOfficer()?.name ?? null; }
  catch { return null; }
}

const serverSnapshot = () => undefined;

export function useDemoOfficer() {
  const name = useSyncExternalStore(subscribeToDemoChanges, officerSnapshot, serverSnapshot);
  return { name, ready: name !== undefined };
}

function applicationSnapshot(): string {
  try { return JSON.stringify(demoApplications()); }
  catch { return "unavailable"; }
}

export function useDemoApplications() {
  const value = useSyncExternalStore(subscribeToDemoChanges, applicationSnapshot, serverSnapshot);
  const applications = useMemo<AlumniProfile[]>(() => value && value !== "unavailable" ? JSON.parse(value) : [], [value]);
  return { applications, ready: value !== undefined, error: value === "unavailable" };
}
