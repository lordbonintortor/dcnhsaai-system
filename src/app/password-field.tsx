"use client";

import { useState } from "react";

export default function PasswordField({ id, label, value, onChange, autoComplete = "new-password", minLength = 8 }: {
  id: string; label: string; value: string; onChange: (value: string) => void;
  autoComplete?: "new-password" | "current-password"; minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-control">
        <input id={id} name={id} type={visible ? "text" : "password"} autoComplete={autoComplete} minLength={minLength} value={value} onChange={event => onChange(event.target.value)} required />
        <button type="button" onClick={() => setVisible(!visible)} aria-label={`${visible ? "Hide" : "Show"} ${label.replace(" *", "").toLowerCase()}`} aria-pressed={visible}>{visible ? "Hide" : "Show"}</button>
      </div>
    </div>
  );
}
