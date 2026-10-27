"use client";

import type { AlumniProfile, ProfileDetails } from "./alumni-profile";
import type { OfficerDecision } from "./application-review";

export const ACCOUNT_CHANGE_EVENT = "dcnhsaai-account-change";

export async function api<T>(path: string, method = "GET", body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, {
    method, credentials: "same-origin", cache: "no-store", signal,
    ...(body !== undefined ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
  });
  let data;
  try { data = await response.json(); }
  catch { throw new Error("The service returned an unexpected response. Please try again."); }
  if (!response.ok) throw new Error(data.error || "The request could not be completed. Please try again.");
  return data as T;
}

function notifyAccountChange() {
  window.dispatchEvent(new Event(ACCOUNT_CHANGE_EVENT));
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(ACCOUNT_CHANGE_EVENT);
    channel.postMessage("changed");
    channel.close();
  }
}

export async function registerAccount(details: ProfileDetails, username: string, password: string, consent: boolean) {
  return api<{ profile: AlumniProfile; warning: string }>("/api/account/register", "POST", { details, username, password, consent });
}

export async function signIn(username: string, password: string, remember = false, officer = false) {
  await api("/api/account/login", "POST", { username, password, remember, officer });
  notifyAccountChange();
}

export async function signOut() {
  await api("/api/account/logout", "POST", {});
  notifyAccountChange();
}

export async function updateProfile(details: ProfileDetails, original: AlumniProfile) {
  const { photoDataUrl, ...fields } = details;
  const result = await api<{ profile: AlumniProfile }>("/api/profile", "PATCH", {
    details: fields, version: original.version,
    ...(photoDataUrl !== original.photoDataUrl ? { photo: photoDataUrl ?? "" } : {}),
  });
  notifyAccountChange();
  return result.profile;
}

export async function reviewApplication(profile: AlumniProfile, status: OfficerDecision, message: string) {
  await api("/api/applications", "POST", { id: profile.id, version: profile.version, status, message });
  notifyAccountChange();
}

export async function resubmitApplication() {
  await api("/api/account/resubmit", "POST", {});
  notifyAccountChange();
}
