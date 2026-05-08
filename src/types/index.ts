export type Role = 'ADMIN' | 'SUPERVISOR' | 'STUDENT';

export type StudentStatus =
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'ARCHIVED';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: Role;
  status: StudentStatus;
  trackId: number | null;
  track?: { id: number; name: string } | null;
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
