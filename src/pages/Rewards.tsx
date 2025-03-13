
import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import RewardsTabs from '@/components/rewards/RewardsTabs';
import BadgeCard from '@/components/rewards/BadgeCard';
import { useUser } from '@/context/UserContext';
import { TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Flame } from 'lucide-react';

const Rewards: React.FC = () => {
  const { user } = useUser();
  
  if (!user) {
    return <div className="page-container">Loading...</div>;
  }
  
  const { badges } = user;
  const completedBadges = badges.filter(badge => badge.completed);
  const upcomingBadges = badges.filter(badge => !badge.completed);
  
  return (
    <div className="page-container">
      <PageHeader title="Rewards & Progress" showBackButton />
      
      <div className="math-card mb-6 flex items-center gap-3">
        <div className="flex-shrink-0 text-orange-500">
          <Flame size={24} />
        </div>
        <div className="flex-1">
          <div className="text-lg font-medium">{user.streak} day streak</div>
        </div>
      </div>
      
      <RewardsTabs>
        <TabsContent value="badges" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {completedBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming Badges</h3>
            {upcomingBadges.map(badge => (
              <div key={badge.id} className="math-card mb-4">
                <div className="flex items-center gap-4">
                  <h4 className="text-lg font-medium">{badge.name}</h4>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{badge.progress?.current}/{badge.progress?.total}</span>
                      <span>
                        {badge.progress && Math.round((badge.progress.current / badge.progress.total) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={badge.progress 
                        ? (badge.progress.current / badge.progress.total) * 100
                        : 0
                      } 
                      className="h-1.5"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{badge.description}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="social">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Social features coming soon!</p>
          </div>
        </TabsContent>
        
        <TabsContent value="progress">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Progress tracking coming soon!</p>
          </div>
        </TabsContent>
      </RewardsTabs>
    </div>
  );
};

export default Rewards;
