
import React from 'react';
import { Flame, Trophy, Award } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Progress } from '@/components/ui/progress';

const StreakCard: React.FC = () => {
  const { user } = useUser();
  
  if (!user) return null;
  
  const { streak, longestStreak, dailyGoal } = user;
  const progress = (dailyGoal.current / dailyGoal.target) * 100;
  
  return (
    <div className="math-card">
      <h3 className="text-lg font-semibold mb-2">Keep it up!</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 mb-1">
            <Flame size={16} className="text-orange-500" />
            <span className="text-sm font-medium">Current Streak</span>
          </div>
          <span className="text-2xl font-bold">{streak} days</span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1 mb-1">
            <Award size={16} className="text-indigo-500" />
            <span className="text-sm font-medium">Best Streak</span>
          </div>
          <span className="text-2xl font-bold">{longestStreak} days</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-2">
        <Trophy size={20} className="text-gray-500" />
        <span className="text-sm font-medium">Daily Goal</span>
        <span className="ml-auto text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default StreakCard;
