export type UserRole = 'CLEANER' | 'SUPERVISOR';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  created_at?: string;
}

export interface CleaningRecord {
  id: string;
  user_id: string;
  ppu: string;
  bus_number: string;
  terminal: string;
  cleaning_type: string;
  stickers_removed: boolean;
  graffiti_removed: boolean;
  image_front_url?: string;
  image_back_url?: string;
  created_at?: string;
}

export interface Task {
  id: string;
  cleaner_id: string;
  supervisor_id: string;
  title?: string | null;
  content: string;
  status: 'pending' | 'done';
  created_at?: string;
  completed_at?: string | null;
}

export interface BreakAssignment {
  id: number;
  user_id: string;
  break_time?: string | null;
  updated_at?: string;
}
