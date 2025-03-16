
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Flame } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Avatar } from '@/components/ui/avatar';

const UserHeader: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // If user is not available, show a minimal placeholder
  if (!user) {
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-10 w-10 rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
          <span>{user.avatar}</span>
        </Avatar>
        <div>
          <h2 className="text-lg font-medium">Hi, {user.name}!</h2>
          <p className="text-sm text-muted-foreground">Level {user.level} Math Wizard</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
          <Flame size={14} className="text-orange-500" />
          <span>{user.streak} day streak</span>
        </div>
        
        <button
          onClick={() => navigate('/settings')}
          className="btn-icon bg-muted/50 hover:bg-muted"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default UserHeader;
