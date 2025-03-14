
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Award, Star, Trophy, Flame, Crown, Calendar } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Badge as BadgeType } from '@/types';

const BadgeIcon: React.FC<{ badge: BadgeType }> = ({ badge }) => {
  switch (badge.id) {
    case 'first-day-streak':
    case '5-day-streak':
    case '10-day-streak':
      return <Flame className="w-7 h-7" />;
    case 'first-mastery':
      return <Award className="w-7 h-7" />;
    case 'addition-master':
    case 'subtraction-master':
    case 'multiplication-master':
    case 'division-master':
      return <Trophy className="w-7 h-7" />;
    case 'level-up':
      return <Crown className="w-7 h-7" />;
    default:
      return <Award className="w-7 h-7" />;
  }
};

const RecentRewards: React.FC = () => {
  const { user, checkAndAwardBadges } = useUser();
  const navigate = useNavigate();
  
  // If no user is logged in, don't render anything
  if (!user) return null;

  // Ensure badges are up-to-date
  React.useEffect(() => {
    checkAndAwardBadges();
  }, [checkAndAwardBadges]);
  
  // Sort badges by recent completion (assuming all completed badges are equally recent for now)
  const recentBadges = user.badges
    .filter(badge => badge.completed)
    .slice(0, 3);
  
  // If there are no badges yet, don't show the component
  if (recentBadges.length === 0) return null;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Rewards</h2>
        <button 
          onClick={() => navigate('/rewards')}
          className="text-sm text-primary flex items-center"
        >
          View all <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {recentBadges.map(badge => (
          <div key={badge.id} className="math-card flex flex-col items-center justify-center py-3">
            <div className="mb-1 text-primary">
              <BadgeIcon badge={badge} />
            </div>
            <span className="text-xs text-center">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRewards;
