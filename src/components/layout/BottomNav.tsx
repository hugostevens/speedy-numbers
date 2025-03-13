
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Trophy, BarChart } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border py-2 px-4 z-10">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <NavLink
          to="/"
          className={({ isActive }) => 
            `flex flex-col items-center p-2 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <BookOpen size={24} />
          <span className="text-xs mt-1">Learn</span>
        </NavLink>
        
        <NavLink
          to="/rewards"
          className={({ isActive }) => 
            `flex flex-col items-center p-2 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <Trophy size={24} />
          <span className="text-xs mt-1">Rewards</span>
        </NavLink>
        
        <NavLink
          to="/progress"
          className={({ isActive }) => 
            `flex flex-col items-center p-2 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <BarChart size={24} />
          <span className="text-xs mt-1">Progress</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNav;
