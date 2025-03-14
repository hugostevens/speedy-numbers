
import { Badge, UserProfile } from '@/types';

export const initialBadges: Badge[] = [
  {
    id: 'addition-pro',
    name: 'Addition Pro',
    description: 'Mastered addition facts',
    icon: 'award',
    completed: true,
  },
  {
    id: '5-day-streak',
    name: '5 Day Streak',
    description: 'Practiced 5 days in a row',
    icon: 'star',
    completed: true,
  },
  {
    id: 'level-up',
    name: 'Level Up',
    description: 'Reached level 3',
    icon: 'trophy',
    completed: true,
  },
  {
    id: '10-day-streak',
    name: '10 Day Streak',
    description: 'Keep practicing daily',
    icon: 'calendar',
    completed: false,
    progress: {
      current: 5,
      total: 10,
    },
  },
  {
    id: 'multiplication-master',
    name: 'Multiplication Master',
    description: 'Complete all multiplication exercises',
    icon: 'crown',
    completed: false,
    progress: {
      current: 3,
      total: 10,
    },
  }
];

export const initialUser: UserProfile = {
  id: '1',
  name: 'Jamie',
  avatar: 'JD',
  level: 3,
  streak: 5,
  dailyGoal: {
    target: 10,
    current: 6,
  },
  theme: 'space',
  badges: initialBadges,
  recentActivity: [
    {
      date: new Date().toISOString(),
      action: 'Completed practice session',
    }
  ]
};
