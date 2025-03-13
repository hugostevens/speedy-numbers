
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ id, title, description }) => {
  const navigate = useNavigate();
  
  return (
    <div className="math-card">
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      
      <button
        onClick={() => navigate(`/knowledge/${id}`)}
        className="w-full py-2 px-4 bg-white border border-gray-200 text-foreground rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center"
      >
        Explore
      </button>
    </div>
  );
};

export default TopicCard;
