
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Badge } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface UserContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  updateStreak: (increment: boolean) => void;
  updateDailyGoal: (progress: number) => void;
  addBadge: (badge: Badge) => void;
  updateTheme: (theme: string) => void;
  signOut: () => Promise<void>;
  checkAndUpdateStreak: () => Promise<void>;
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

const UserContext = createContext<UserContextType>({
  user: null,
  session: null,
  isLoading: true,
  updateStreak: () => {},
  updateDailyGoal: () => {},
  addBadge: () => {},
  updateTheme: () => {},
  signOut: async () => {},
  checkAndUpdateStreak: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        setIsLoading(false);
        
        if (currentSession?.user) {
          await fetchUserData(currentSession);
        } else {
          console.log('No session found, setting user to null');
          setUser(null);
        }
      }
    );

    const fetchUserData = async (currentSession: Session) => {
      try {
        // Fetch user streak data
        const { data: streakData, error: streakError } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', currentSession.user.id)
          .single();
          
        if (streakError && streakError.code !== 'PGRST116') {
          console.error('Error fetching streak data:', streakError);
        }
        
        const streak = streakData?.current_streak || 0;
        const longestStreak = streakData?.longest_streak || 0;

        const userData = {
          id: currentSession.user.id,
          name: currentSession.user.email?.split('@')[0] || 'User',
          avatar: currentSession.user.email?.substring(0, 2).toUpperCase() || 'U',
          level: 3,
          streak: streak,
          longestStreak: longestStreak,
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
          ],
          session: currentSession
        };
        
        console.log('Setting user data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Could not load user data');
      }
    };

    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log('Initial session check:', currentSession?.user?.id);
      setSession(currentSession);
      
      if (currentSession?.user) {
        await fetchUserData(currentSession);
      }
      
      setIsLoading(false);
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAndUpdateStreak = async () => {
    if (!user?.id || !session) return;
    
    try {
      // Get the current date in the user's timezone
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayString = today.toISOString().split('T')[0];
      
      // Get streak data
      const { data: streakData, error: fetchError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching streak data:', fetchError);
        return;
      }
      
      if (!streakData) {
        // If no streak record exists, create one
        const { error: insertError } = await supabase
          .from('user_streaks')
          .insert({
            user_id: user.id,
            current_streak: 1,
            longest_streak: 1,
            last_practice_date: todayString
          });
          
        if (insertError) {
          console.error('Error creating streak record:', insertError);
          return;
        }
        
        setUser(prev => prev ? { ...prev, streak: 1, longestStreak: 1 } : prev);
        return;
      }
      
      const lastPracticeDate = streakData.last_practice_date ? new Date(streakData.last_practice_date) : null;
      lastPracticeDate?.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = streakData.current_streak;
      let updatedLongestStreak = streakData.longest_streak;
      
      // If the user has already practiced today, don't update the streak
      if (lastPracticeDate && lastPracticeDate.getTime() === today.getTime()) {
        console.log('User already practiced today');
        return;
      }
      
      // If the user practiced yesterday, increment streak
      if (lastPracticeDate && lastPracticeDate.getTime() === yesterday.getTime()) {
        newStreak += 1;
        console.log('User practiced yesterday, incrementing streak to', newStreak);
      } 
      // If the user didn't practice yesterday but practiced earlier, reset streak to 1
      else if (lastPracticeDate && lastPracticeDate.getTime() < yesterday.getTime()) {
        newStreak = 1;
        console.log('Streak reset to 1 (no practice yesterday)');
      }
      // If the user has no last practice date record, set streak to 1
      else if (!lastPracticeDate) {
        newStreak = 1;
        console.log('First practice, setting streak to 1');
      }
      
      // Update longest streak if current streak is higher
      if (newStreak > updatedLongestStreak) {
        updatedLongestStreak = newStreak;
      }
      
      // Update streak record in database
      const { error: updateError } = await supabase
        .from('user_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: updatedLongestStreak,
          last_practice_date: todayString,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      if (updateError) {
        console.error('Error updating streak:', updateError);
        return;
      }
      
      // Update UI state
      setUser(prev => prev ? { 
        ...prev, 
        streak: newStreak,
        longestStreak: updatedLongestStreak
      } : prev);
      
      // Show toast messages for streak milestones
      if (newStreak > streakData.current_streak && newStreak % 5 === 0) {
        toast.success(`🔥 ${newStreak} day streak achieved!`);
      }
      
    } catch (error) {
      console.error('Error updating streak:', error);
      toast.error('Could not update your practice streak');
    }
  };

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
        const updatedBadges = [...prev.badges];
        updatedBadges[existingBadgeIndex] = badge;
        return { ...prev, badges: updatedBadges };
      } else {
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

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    toast.success('Signed out successfully');
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      session,
      isLoading, 
      updateStreak, 
      updateDailyGoal, 
      addBadge,
      updateTheme,
      signOut,
      checkAndUpdateStreak
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
