
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface RewardsTabsProps {
  children: React.ReactNode;
}

const RewardsTabs: React.FC<RewardsTabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('badges');
  
  return (
    <Tabs defaultValue="badges" onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="badges">Badges</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default RewardsTabs;
