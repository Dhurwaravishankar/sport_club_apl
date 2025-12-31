export interface Match {
  id: string;
  name: string;
  sport: string;
  date: string;
  time: string;
  location: string;
  prize: string;
  paidFree: 'paid' | 'free';
  registrationStatus: 'open' | 'closed';
  image?: string;
  entryFee?: string;
  qrCodeUrl?: string;
}

export interface Player {
  id: string;
  name: string;
}

export interface Registration {
  id: string;
  matchId: string;
  matchName?: string;
  teamName: string;
  captainName: string;
  contact: string;
  sport: string;
  players: Player[];
  screenshotUrl?: string;
  paymentStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AdminStats {
  totalMatches: number;
  totalRegistrations: number;
  pendingPayments: number;
  approvedTeams: number;
}
