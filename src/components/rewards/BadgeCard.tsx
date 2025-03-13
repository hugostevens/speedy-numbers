
import React from 'react';
import { Badge } from '@/types';
import { Award, Star, Crown, Calendar, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BadgeCardProps {
  badge: Badge;
}

const BadgeIcon: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'addition-pro':
      return <Award className="w-10 h-10" />;
    case '5-day-streak':
    case '10-day-streak':
      return <Star className="w-10 h-10" />;
    case 'level-up':
      return <Trophy className="w-10 h-10" />;
    case 'multiplication-master':
      return <Crown className="w-10 h-10" />;
    default:
      return <Award className="w-10 h-10" />;
  }
};

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const { name, description, completed, progress } = badge;
  
  return (
    <div className={`math-card ${completed ? 'border-primary/30' : ''}`}>
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full mb-3 ${
          completed ? 'text-primary' : 'text-gray-400'
        }`}>
          <BadgeIcon id={badge.id} />
        </div>
        
        <h3 className="font-medium text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        
        {progress && (
          <div className="w-full mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>{progress.current}/{progress.total}</span>
              {progress.current > 0 && (
                <span className="text-primary">
                  {Math.round((progress.current / progress.total) * 100)}%
                </span>
              )}
            </div>
            <Progress 
              value={(progress.current / progress.total) * 100} 
              className="h-1.5"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
