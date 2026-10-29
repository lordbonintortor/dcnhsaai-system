export type ActivityPostData = {
  slug: string;
  title: string;
  date: string;
  dateValue: string;
  summary: string;
  body: string;
  images: ReadonlyArray<{ src: string; alt: string }>;
};

export const tionkoDayActivity = {
  slug: "tionko-day-2023",
  title: "1st Tionko Day Celebration",
  date: "October 20, 2023",
  dateValue: "2023-10-20",
  summary: "The first Tionko Day Commemoration recognized the Tionko Heirs' consent to preserve the name of Davao City National High School and expressed gratitude for their substantial land donation.",
  body: "The Tionko Day Commemoration was formally established pursuant to an agreement between the Tionko Heirs and the DCNHS Alumni Group, represented by Association President Leoncio A. Cirunay Jr. and School Principal Mrs. Evelyn E. Magno, during a committee hearing conducted on February 23, 2023. The proceedings were presided over by the Honorable Councilor Pilar C. Braga, Chairperson of the Committee on Education, Science and Technology, Arts and Culture of the Sangguniang Panlungsod of Davao City. The annual observance is scheduled for October 30, or the school day immediately preceding or following said date. This commemoration is observed in recognition of the Tionko Heirs' consent to preserve the name of Davao City National High School and as an expression of gratitude for the substantial land donation provided by the late Tomas M. Tionko.",
  images: [
    { src: "/events/tionko-day-2024/image1.jpeg", alt: "1st Tionko Day Celebration" },
    { src: "/events/tionko-day-2024/image2.jpeg", alt: "Tionko Day celebration activity" },
    { src: "/events/tionko-day-2024/image3.jpeg", alt: "Tionko Day celebration activity" },
    { src: "/events/tionko-day-2024/image4.jpeg", alt: "Tionko Day celebration activity" },
    { src: "/events/tionko-day-2024/image5.jpeg", alt: "Tionko Day celebration activity" },
    { src: "/events/tionko-day-2024/image6.jpeg", alt: "Tionko Day celebration activity" },
    { src: "/events/tionko-day-2024/the donor.jpeg", alt: "Tionko donor recognition" },
    { src: "/events/tionko-day-2024/The Invitation and Program of Activities.jpeg", alt: "Tionko Day invitation and program" },
    { src: "/events/tionko-day-2024/The Notice of the City Council Committee Hearing.jpeg", alt: "City Council committee hearing notice" },
  ],
} as const;

export const februaryElevenActivity = {
  slug: "officers-oath-taking-2025",
  title: "DCNHS Alumni Officers Take Oath, Strengthen Commitment to Service",
  date: "February 11, 2025",
  dateValue: "2025-02-11",
  summary: "The newly elected officers of the Board of Trustees of the Davao City National High School Alumni Association, Inc. officially took their oath of office at the Senior High School Conference Room of DCNHS.",
  body: "The ceremony was officiated by Mrs. Evelyn E. Magno, Principal IV of DCNHS, who expressed her deep gratitude to the alumni association and shared her enthusiasm for future collaborations between the alumni and the school administration.\n\nIn his address, Atty. Niceforo V. Solis, Jr. outlined three key focus areas for the association this year:\n\n✅ Strengthening alumni engagement – fostering meaningful connections among graduates through programs and development opportunities.\n\n✅ Supporting DCNHS – promoting initiatives that enhance academic excellence, student development, and institutional growth.\n\n✅ Encouraging community service – ensuring that DCNHS alumni continue to make a positive impact on society.\n\nDuring the same event, the alumni association formally turned over two significant projects initiated under the leadership of Brig. Gen. Leoncio A. Cirunay:\n\n📍 Doña Vicenta Tionko Monument – a tribute to the institution’s rich history.\n\n💡 Solar Lamp Post Project – co-donated by DCNHS Batch 1973, enhancing campus safety and sustainability.\n\n👏 Congratulations to the new officers of the Davao City National High School Alumni Association, Inc.! May you continue to strengthen the alumni community and uphold the legacy of our beloved alma mater.\n\n🎉 Mabuhay, Davao City High! 🎉\n\n#DCNHSAlumni #DavaoCityHigh #StrongerTogether #AlumniEngagement #SchoolPride",
  images: [
    { src: "/events/officers-oath-taking-2025-1.jpg", alt: "DCNHS alumni officers taking their oath of office" },
    { src: "/events/officers-oath-taking-2025-2.jpg", alt: "DCNHS alumni officers gathered during the oath-taking ceremony" },
    { src: "/events/officers-oath-taking-2025-3.jpg", alt: "DCNHS alumni officers and guests at the service commitment event" },
  ],
} as const;

export const alumniActivities: readonly ActivityPostData[] = [
  februaryElevenActivity,
  tionkoDayActivity,
].sort((a, b) => b.dateValue.localeCompare(a.dateValue));
