"use client";

import { useState } from "react";

const professions = [
  "Legal",
  "Medical",
  "Engineering",
  "Finance",
  "Information Technology",
  "Entrepreneur",
  "Retired",
];

export default function ProfessionFields() {
  const [otherSelected, setOtherSelected] = useState(false);

  return (
    <>
      <div className="checkbox-grid" role="group" aria-label="Profession or occupation">
        {professions.map((profession) => (
          <label key={profession}>
            <input type="checkbox" name="professions" value={profession} />
            <span>{profession}</span>
          </label>
        ))}
        <label>
          <input
            type="checkbox"
            name="professions"
            value="Other"
            checked={otherSelected}
            onChange={(event) => setOtherSelected(event.target.checked)}
          />
          <span>Other</span>
        </label>
      </div>

      {otherSelected && (
        <label className="other-profession">
          Specify other profession or occupation *
          <input
            name="otherProfession"
            placeholder="Type your profession or occupation"
            required
            autoFocus
          />
        </label>
      )}
    </>
  );
}
