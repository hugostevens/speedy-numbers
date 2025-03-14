
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';

interface Contributor {
  id: string;
  name: string;
  initials: string;
  problems: number;
}

const SocialContent: React.FC = () => {
  // Mock data for class challenge
  const totalProblems = 100;
  const completedProblems = 65;
  const daysLeft = 2;
  const progressPercentage = (completedProblems / totalProblems) * 100;
  
  // Mock data for top contributors
  const contributors: Contributor[] = [
    { id: '1', name: 'Jamie', initials: 'JD', problems: 16 },
    { id: '2', name: 'Alex', initials: 'AS', problems: 13 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="math-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-primary">
            <Users size={28} />
          </div>
          <h3 className="text-2xl font-semibold">Class Challenge</h3>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Complete {totalProblems} math problems as a class
        </p>
        
        <Progress value={progressPercentage} className="h-3 mb-2" />
        
        <div className="flex justify-between text-sm mb-6">
          <span className="font-medium">{completedProblems}/{totalProblems} problems</span>
          <span className="font-medium">{daysLeft} days left</span>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Top Contributors</h4>
          
          {contributors.map((contributor) => (
            <div key={contributor.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-muted">
                  <AvatarFallback>{contributor.initials}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{contributor.name}</span>
              </div>
              
              <div className="flex items-center gap-3 flex-1 max-w-[60%]">
                <Progress value={(contributor.problems / 20) * 100} className="h-2 flex-1" />
                <span className="font-semibold text-lg">{contributor.problems}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Button variant="default" className="w-full py-6 bg-black text-white hover:bg-black/90 flex gap-2">
        <UserPlus size={18} />
        <span>Invite Friends</span>
      </Button>
    </div>
  );
};

export default SocialContent;
