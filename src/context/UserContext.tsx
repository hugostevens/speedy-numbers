import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Badge } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { checkForNewBadges } from '@/utils/badgeUtils';

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
  checkAndAwardBadges: () => Promise<void>;
}

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
  checkAndAwardBadges: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Initial session check in UserContext');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check result:', currentSession?.user?.id);
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          await fetchUserData(currentSession);
        } else {
          console.log('No session found in initial check, setting user to null');
          setUser(null);
        }
      } catch (error) {
        console.error('Error during initial session check:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
        setSessionChecked(true);
      }
    };
    
    checkSession();
  }, []);

  useEffect(() => {
    if (!sessionChecked) return;
    
    console.log('Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
          
          if (currentSession?.user) {
            await fetchUserData(currentSession);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('Sign out detected, clearing user data');
          setUser(null);
          setSession(null);
        }
      }
    );

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [sessionChecked]);

  const fetchUserData = async (currentSession: Session) => {
    try {
      console.log('Fetching user data for:', currentSession.user.id);
      
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

      const userData: UserProfile = {
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
        badges: [],
        recentActivity: [
          {
            date: new Date().toISOString(),
            action: 'Completed practice session',
          }
        ],
      };
      
      try {
        const { earnedBadges } = await checkForNewBadges(currentSession.user.id);
        if (earnedBadges.length > 0) {
          userData.badges = earnedBadges;
        }
      } catch (badgeError) {
        console.error('Error checking for badges:', badgeError);
      }
      
      console.log('Setting user data:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Could not load user data');
      // Don't set user to null here as we at least have the session
    }
  };

  const checkAndUpdateStreak = async () => {
    if (!user?.id || !session) return;
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayString = today.toISOString().split('T')[0];
      
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
      
      if (lastPracticeDate && lastPracticeDate.getTime() === today.getTime()) {
        console.log('User already practiced today');
        return;
      }
      
      if (lastPracticeDate && lastPracticeDate.getTime() === yesterday.getTime()) {
        newStreak += 1;
        console.log('User practiced yesterday, incrementing streak to', newStreak);
      } 
      else if (lastPracticeDate && lastPracticeDate.getTime() < yesterday.getTime()) {
        newStreak = 1;
        console.log('Streak reset to 1 (no practice yesterday)');
      }
      else if (!lastPracticeDate) {
        newStreak = 1;
        console.log('First practice, setting streak to 1');
      }
      
      if (newStreak > updatedLongestStreak) {
        updatedLongestStreak = newStreak;
      }
      
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
      
      setUser(prev => prev ? { 
        ...prev, 
        streak: newStreak,
        longestStreak: updatedLongestStreak
      } : prev);
      
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
    console.log('Signing out user');
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const checkAndAwardBadges = async () => {
    if (!user?.id || !session) return;
    
    try {
      const { earnedBadges, shouldUpdateUI } = await checkForNewBadges(user.id);
      
      if (earnedBadges.length > 0) {
        const newBadges = earnedBadges.filter(newBadge => 
          !user.badges.some(existingBadge => existingBadge.id === newBadge.id && existingBadge.completed)
        );
        
        if (newBadges.length > 0) {
          setUser(prev => {
            if (!prev) return prev;
            
            const updatedBadges = [...prev.badges];
            
            newBadges.forEach(newBadge => {
              const existingIndex = updatedBadges.findIndex(b => b.id === newBadge.id);
              if (existingIndex >= 0) {
                updatedBadges[existingIndex] = newBadge;
              } else {
                updatedBadges.push(newBadge);
                toast.success(`🏆 New badge: ${newBadge.name}`);
              }
            });
            
            return {
              ...prev,
              badges: updatedBadges
            };
          });
          
          console.log('New badges awarded:', newBadges);
        }
      }
    } catch (error) {
      console.error('Error checking and awarding badges:', error);
    }
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
      checkAndUpdateStreak,
      checkAndAwardBadges
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
