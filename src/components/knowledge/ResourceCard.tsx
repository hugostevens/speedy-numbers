
import React from 'react';
import { KnowledgeItem } from '@/types';
import { Video, BookOpen, Play } from 'lucide-react';

interface ResourceCardProps {
  resource: KnowledgeItem;
  onSelect: (resource: KnowledgeItem) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSelect }) => {
  const { title, description, type } = resource;
  
  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Video size={20} />;
      case 'interactive':
        return <Play size={20} />;
      default:
        return <BookOpen size={20} />;
    }
  };
  
  return (
    <div 
      className="math-card card-hover cursor-pointer"
      onClick={() => onSelect(resource)}
    >
      <div className="flex items-start gap-3">
        <div className="math-icon-container h-10 w-10">
          {getIcon()}
        </div>
        
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          <div className="flex mt-2">
            <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded-full">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
