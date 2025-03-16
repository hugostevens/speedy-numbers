
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import UserHeader from '@/components/dashboard/UserHeader';
import StreakCard from '@/components/dashboard/StreakCard';
import RecentRewards from '@/components/dashboard/RecentRewards';
import LearningSection from '@/components/dashboard/LearningSection';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, session, checkAndAwardBadges, checkAndUpdateStreak } = useUser();

  // Verify user and session when the page loads
  useEffect(() => {
    const checkUserAndSession = async () => {
      console.log("Index page loaded, checking user and session state");
      console.log("Current user state:", user?.id);
      console.log("Current session state:", session?.user?.id);
      
      if (isLoading) {
        console.log("User context is still loading, waiting...");
        return;
      }
      
      // If we have a session but no user data, try to forcefully reload it
      if (session && !user) {
        console.log("Found session but no user data, trying to fetch user data");
        try {
          // First check the streak since this populates user data
          await checkAndUpdateStreak();
          // Then check badges which also updates user UI
          await checkAndAwardBadges();
        } catch (error) {
          console.error("Error loading user data:", error);
          // If we can't load the user data, we might have an invalid session
          // Redirect to auth page
          navigate('/auth');
        }
      } else if (!session && !isLoading) {
        console.log("No session found, redirecting to auth");
        navigate('/auth');
      }
    };
    
    checkUserAndSession();
  }, [user, session, isLoading, navigate, checkAndUpdateStreak, checkAndAwardBadges]);
  
  // Update streak and check for badges when the user visits the home page
  // But only if we have both a user and session
  useEffect(() => {
    if (user && session) {
      console.log("User logged in and present, checking streak and badges");
      checkAndUpdateStreak();
      checkAndAwardBadges();
    }
  }, [user, session, checkAndUpdateStreak, checkAndAwardBadges]);

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
