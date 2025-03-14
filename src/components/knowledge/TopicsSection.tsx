
import React from 'react';
import TopicCard from '@/components/knowledge/TopicCard';
import { Video, Headphones, Eye } from 'lucide-react';
import { levels } from '@/data/mathLevels';

const TopicsSection: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">All Topics</h2>
      <div className="flex flex-wrap items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Learn different ways to add, subtract, multiply, and divide
        </p>
        
        <div className="flex items-center gap-2 mt-1 md:mt-0">
          <div className="flex items-center">
            <div className="math-icon-container h-6 w-6 mr-1">
              <Video size={16} />
            </div>
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              Video
            </span>
          </div>
          
          <div className="flex items-center">
            <div className="math-icon-container h-6 w-6 mr-1">
              <Headphones size={16} />
            </div>
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              Audio
            </span>
          </div>
          
          <div className="flex items-center">
            <div className="math-icon-container h-6 w-6 mr-1">
              <Eye size={16} />
            </div>
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              Visual
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(levels).map(level => (
          <TopicCard
            key={level.id}
            id={level.id}
            title={level.name}
            description={level.description}
          />
        ))}
      </div>
    </div>
  );
};

export default TopicsSection;
