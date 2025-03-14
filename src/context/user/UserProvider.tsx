
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Badge } from '@/types';
import UserContext from './UserContext';
import { UserProfile } from './types';
import { initialUser } from './initialData';
import { fetchUserProfile, signOutUser } from './userApi';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setIsLoading(true);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          
          setUser({
            ...initialUser,
            id: session.user.id,
            name: profile?.name || session.user.email?.split('@')[0] || 'User',
            avatar: (profile?.name || session.user.email?.substring(0, 2) || 'U').substring(0, 2).toUpperCase(),
          });
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        
        setUser({
          ...initialUser,
          id: session.user.id,
          name: profile?.name || session.user.email?.split('@')[0] || 'User',
          avatar: (profile?.name || session.user.email?.substring(0, 2) || 'U').substring(0, 2).toUpperCase(),
        });
      }
      
      setIsLoading(false);
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
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
    await signOutUser();
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
      signOut
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
