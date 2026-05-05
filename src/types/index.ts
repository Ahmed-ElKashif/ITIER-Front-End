export type Role = 'STUDENT' | 'SUPERVISOR';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: Role;
  trackId: number;
}

export interface StudyEntry {
  id: number;
  subject: string;
  hours: string;
  date: string;
  notes?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  fullName: string;
  totalHours: string;
  subjects: string[];
}

export interface Quote {
  quote: string;
  author: string;
  category: string;
}
