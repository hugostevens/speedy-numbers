
import { Badge } from '@/types';
import { Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  streak: number;
  dailyGoal: {
    target: number;
    current: number;
  };
  theme: string;
  badges: Badge[];
  recentActivity: {
    date: string;
    action: string;
  }[];
}

export interface UserContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  updateStreak: (increment: boolean) => void;
  updateDailyGoal: (progress: number) => void;
  addBadge: (badge: Badge) => void;
  updateTheme: (theme: string) => void;
  signOut: () => Promise<void>;
}
