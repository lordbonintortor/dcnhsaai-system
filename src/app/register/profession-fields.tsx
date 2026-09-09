"use client";

import { professions } from "@/lib/alumni-profile";

export default function ProfessionFields({ selected, other, onChange, onOtherChange }: {
  selected: string[];
  other: string;
  onChange: (value: string[]) => void;
  onOtherChange: (value: string) => void;
}) {

  return (
    <>
      <div className="checkbox-grid" role="group" aria-label="Profession or occupation">
        {professions.map((profession) => (
          <label key={profession}>
            <input type="checkbox" name="professions" value={profession} checked={selected.includes(profession)} onChange={(event) => onChange(event.target.checked ? [...selected, profession] : selected.filter(value => value !== profession))} />
            <span>{profession}</span>
          </label>
        ))}
      </div>

      {selected.includes("Other") && (
        <label className="other-profession">
          Specify other profession or occupation *
          <input
            name="otherProfession"
            value={other}
            onChange={(event) => onOtherChange(event.target.value)}
            placeholder="Type your profession or occupation"
            required
            autoFocus
          />
        </label>
      )}
    </>
  );
}
