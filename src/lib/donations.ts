export type DonationAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
};

// Add only association-supplied accounts intended for public donation inquiries.
// No account details have been supplied in this checkout yet.
export const donationAccounts: DonationAccount[] = [];
