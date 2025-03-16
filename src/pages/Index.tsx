
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import UserHeader from '@/components/dashboard/UserHeader';
import StreakCard from '@/components/dashboard/StreakCard';
import RecentRewards from '@/components/dashboard/RecentRewards';
import LearningSection from '@/components/dashboard/LearningSection';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { supabase, getSession } from '@/integrations/supabase/client';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, session, checkAndAwardBadges, checkAndUpdateStreak } = useUser();

  // Check and load user data when the page loads
  useEffect(() => {
    const loadUserData = async () => {
      console.log("Index page loaded, checking user and session state");
      
      if (isLoading) {
        console.log("User context is still loading, waiting...");
        return;
      }
      
      // If no session but auth state finished loading, redirect to login
      if (!session && !isLoading) {
        console.log("No session found, redirecting to auth");
        navigate('/auth');
        return;
      }
      
      // If we have a session and user data, update streaks and badges
      if (session && user) {
        console.log("User logged in and present, checking streak and badges");
        try {
          await checkAndUpdateStreak();
          await checkAndAwardBadges();
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      }
      // If we have a session but no user data, force reload
      else if (session && !user) {
        console.log("Session found but no user data, trying to reload user data");
        try {
          await checkAndUpdateStreak();
          await checkAndAwardBadges();
        } catch (error) {
          console.error("Error loading user data:", error);
          // If we can't load the user data, we might have an invalid session
          navigate('/auth');
        }
      }
    };
    
    loadUserData();
  }, [user, session, isLoading, navigate, checkAndUpdateStreak, checkAndAwardBadges]);

  if (isLoading) {
    return <div className="page-container flex items-center justify-center p-10">Loading...</div>;
  }

  if (!user || !session) {
    return (
      <div className="page-container flex flex-col items-center justify-center h-[80vh] gap-6">
        <h1 className="text-3xl font-bold text-center">Speedy Numbers Fun</h1>
        <p className="text-lg text-center text-muted-foreground">
          Improve your math skills with fun and interactive exercises
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/auth')}
          className="flex gap-2 items-center"
        >
          <LogIn size={20} />
          <span>Login to Start</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <UserHeader />
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <StreakCard />
        <LearningSection />
        <RecentRewards />
      </div>
    </div>
  );
};

export default Index;
