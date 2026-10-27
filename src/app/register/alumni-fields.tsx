"use client";

import { type ProfileDetails } from "@/lib/alumni-profile";
import ProfessionFields from "./profession-fields";

export default function AlumniFields({ value, onChange }: {
  value: ProfileDetails;
  onChange: (value: ProfileDetails) => void;
}) {
  const change = (key: keyof ProfileDetails, next: string | string[]) => onChange({ ...value, [key]: next });
  return (
    <>
      <fieldset>
        <legend>School information</legend>
        <div className="field-grid three">
          <label>Batch year *<input name="batchYear" type="number" min={1922} max={new Date().getFullYear()} placeholder="e.g. 2008" value={value.batchYear} onChange={e => change("batchYear", e.target.value)} required /></label>
          <label>Section<input name="section" placeholder="e.g. Rizal" value={value.section} onChange={e => change("section", e.target.value)} /></label>
          <label>Class adviser<input name="adviser" placeholder="Full name" value={value.adviser} onChange={e => change("adviser", e.target.value)} /></label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Personal information</legend>
        <div className="field-grid">
          <label>First name *<input name="firstName" autoComplete="given-name" placeholder="First name" value={value.firstName} onChange={e => change("firstName", e.target.value)} required /></label>
          <label>Middle or maiden name<input name="middleName" autoComplete="additional-name" placeholder="Optional" value={value.middleName} onChange={e => change("middleName", e.target.value)} /></label>
          <label>Last name *<input name="lastName" autoComplete="family-name" placeholder="Last name" value={value.lastName} onChange={e => change("lastName", e.target.value)} required /></label>
          <label>Mobile number (optional)<input name="mobile" type="tel" autoComplete="tel" placeholder="+63 9XX XXX XXXX" value={value.mobile} onChange={e => change("mobile", e.target.value)} /></label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Profession / occupation *</legend>
        <p className="field-help">Select at least one. You may select all that apply.</p>
        <ProfessionFields selected={value.professions} other={value.otherProfession} onChange={next => change("professions", next)} onOtherChange={next => change("otherProfession", next)} />
        <label className="full-field">Current and past employers or businesses<textarea name="employers" rows={3} placeholder="Up to three entries" value={value.employers} onChange={e => change("employers", e.target.value)} /></label>
      </fieldset>
    </>
  );
}
