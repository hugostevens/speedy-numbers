
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Badge } from '@/types';
import { toast } from 'sonner';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  updateStreak: (increment: boolean) => void;
  updateDailyGoal: (progress: number) => void;
  addBadge: (badge: Badge) => void;
  updateTheme: (theme: string) => void;
}

const initialBadges: Badge[] = [
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

const initialUser: UserProfile = {
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

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  updateStreak: () => {},
  updateDailyGoal: () => {},
  addBadge: () => {},
  updateTheme: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading user data
  useEffect(() => {
    const loadUser = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(initialUser);
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const updateStreak = (increment: boolean) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      const newStreak = increment ? prev.streak + 1 : 0;
      
      if (increment && newStreak % 5 === 0) {
        toast.success(`🎉 ${newStreak} day streak achieved!`);
      }
      
      return { ...prev, streak: newStreak };
    });
  };

  const updateDailyGoal = (progress: number) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      const newCurrent = Math.min(prev.dailyGoal.current + progress, prev.dailyGoal.target);
      const isComplete = newCurrent >= prev.dailyGoal.target;
      
      if (isComplete && prev.dailyGoal.current < prev.dailyGoal.target) {
        toast.success('🎯 Daily goal completed!');
      }
      
      return {
        ...prev,
        dailyGoal: {
          ...prev.dailyGoal,
          current: newCurrent
        }
      };
    });
  };

  const addBadge = (badge: Badge) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      const existingBadgeIndex = prev.badges.findIndex(b => b.id === badge.id);
      
      if (existingBadgeIndex >= 0) {
        // Update existing badge
        const updatedBadges = [...prev.badges];
        updatedBadges[existingBadgeIndex] = badge;
        return { ...prev, badges: updatedBadges };
      } else {
        // Add new badge
        toast.success(`🏆 New badge: ${badge.name}`);
        return { ...prev, badges: [...prev.badges, badge] };
      }
    });
  };

  const updateTheme = (theme: string) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      return { ...prev, theme };
    });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      updateStreak, 
      updateDailyGoal, 
      addBadge,
      updateTheme
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
