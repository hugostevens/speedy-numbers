
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Award, Star, Trophy } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const BadgeIcon: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'addition-pro':
      return <Award className="w-7 h-7" />;
    case '5-day-streak':
      return <Star className="w-7 h-7" />;
    case 'level-up':
      return <Trophy className="w-7 h-7" />;
    default:
      return <Award className="w-7 h-7" />;
  }
};

const RecentRewards: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const recentBadges = user.badges
    .filter(badge => badge.completed)
    .slice(0, 3);
  
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
            <div className="mb-1 text-gray-700">
              <BadgeIcon id={badge.id} />
            </div>
            <span className="text-xs text-center">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRewards;
