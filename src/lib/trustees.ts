// Source: BOT Brief Bio-2026  BOT.pdf, supplied by the association.
// Portraits are matched by the supplied filenames in public/profile.
// The source includes these three profiles; it does not specify full term dates.
export const trustees = [
  {
    slug: "niceforo-solis",
    name: "Atty. Niceforo V. Solis Jr.",
    role: "President",
    batch: "1994",
    photo: "/profile/niceforo.png",
    summary: "A lawyer, educator, and former City High student leader with a continuing commitment to education and service.",
    areas: ["Law", "Education", "Human resource management"],
    biography: [
      "Attorney Niceforo Villafuerte Solis Jr. is a lawyer by profession. He has taught Philosophy at Ateneo de Davao University and Constitutional Law at the Ateneo College of Law. His 2026 profile identifies him as Director of the Human Resource Management and Development Office at Ateneo de Davao University.",
      "During his high school years, he was an active student leader, serving in the student government from first year through fourth year. He also founded Students for Nationalism and Progress (SNAP), which the association’s profile describes as one of the leading student political parties at DCNHS.",
    ],
  },
  {
    slug: "merle-bobilles",
    name: "Merle G. Bobilles",
    role: "Treasurer",
    batch: "1971",
    photo: "/profile/merle.png",
    summary: "A Certified Public Accountant with extensive corporate experience in finance, administration, planning, and treasury.",
    areas: ["Finance & administration", "Internal audit", "Treasury"],
    biography: [
      "Merle G. Bobilles is a Certified Public Accountant (CPA) who chose a career in the corporate sector. Known as Ms. Merle, pronounced “Merl,” to her former subordinates, she developed a wide range of skills in finance and administration across different corporate environments.",
      "She held key positions at domestic and multinational manufacturing firms and conglomerates, including Legaspi Oil Co., Inc., a coconut oil mill in Davao City; San Miguel Corporation’s Agribusiness Division in Makati City; and Stepan Philippines Inc. in Bauan, Batangas, a wholly owned chemical manufacturing plant of the Illinois-based Stepan Company.",
      "Her areas of specialization include internal audit, administration, comptrollership, financial and strategic planning, and treasury. Now enjoying retirement, she brings that experience to her service as association treasurer while describing her occasional “CPA” work with a lighter meaning: “Certified Plantita and Apo-sitter.”",
    ],
  },
  {
    slug: "ruth-arancel",
    name: "Ruth Ulac Arancel",
    role: "Corporate Secretary",
    batch: "1982",
    photo: "/profile/ruth.png",
    summary: "An accounting graduate whose career spans financial operations, management, and connecting people through telecommunications.",
    areas: ["Accounting", "Operations management", "Telecommunications"],
    biography: [
      "Ruth Ulac Arancel graduated with a Bachelor of Science in Accounting from Ateneo de Davao University in 1986. She began her professional career as an Account Executive at Solidlink Futures Exchange, where she gained exposure to equity and commodities trading.",
      "She then spent three years in charge of labor costs at Tagnanan Plantation Estate, Inc. in Mabini, Tagum, Davao del Norte. This was followed by another three years as Operation and Accounting Manager at Davao Central Food Systems for Tower of Pizza and Orange Brutus, strengthening her accounting and management experience.",
      "In 1993, she joined the Philippine Long Distance Telephone Company (PLDT Co.) as a telephone operator for national and international calls. The move from accounting to telecommunications gave her a new way to connect people across distances. She spent nearly a decade with PLDT before the Davao telephone operations department closed in 2002.",
      "Although offered a transfer to Manila, she chose to remain in Davao. Since then, she has devoted her time to her family and caring for a small organic farm.",
    ],
  },
] as const;

export function getTrustee(slug: string) {
  return trustees.find((trustee) => trustee.slug === slug);
}
