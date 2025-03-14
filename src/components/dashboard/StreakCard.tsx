
import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { useUser } from '@/context/user';
import { Progress } from '@/components/ui/progress';

const StreakCard: React.FC = () => {
  const { user } = useUser();
  
  if (!user) return null;
  
  const { streak, dailyGoal } = user;
  const progress = (dailyGoal.current / dailyGoal.target) * 100;
  
  return (
    <div className="math-card">
      <h3 className="text-lg font-semibold mb-2">Keep it up!</h3>
      <p className="text-muted-foreground text-sm mb-4">
        You're on a {streak}-day streak
      </p>
      
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
