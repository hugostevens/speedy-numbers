
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
  const { user, isLoading, checkAndAwardBadges } = useUser();

  // Verify Supabase session on page load
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Current Supabase session on Index page:", data.session);
    };
    
    checkSession();
  }, []);

  // Check for badges when the user visits the home page
  useEffect(() => {
    if (user) {
      checkAndAwardBadges();
    }
  }, [user, checkAndAwardBadges]);

  if (isLoading) {
    return <div className="page-container">Loading...</div>;
  }

  if (!user) {
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
