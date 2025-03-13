
import React from 'react';
import UserHeader from '@/components/dashboard/UserHeader';
import StreakCard from '@/components/dashboard/StreakCard';
import RecentRewards from '@/components/dashboard/RecentRewards';
import LearningSection from '@/components/dashboard/LearningSection';

const Index: React.FC = () => {
  return (
    <div className="page-container">
      <UserHeader />
      
      <StreakCard />
      
      <div className="my-6">
        <RecentRewards />
      </div>
      
      <LearningSection />
    </div>
  );
};

export default Index;
