
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Minus, X, Divide } from 'lucide-react';

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ id, title, description }) => {
  const navigate = useNavigate();
  
  // Helper function to get icon based on topic id
  const getOperationIcon = (id: string) => {
    if (id.includes('addition')) {
      return <Plus size={24} className="text-green-500" />;
    } else if (id.includes('subtraction')) {
      return <Minus size={24} className="text-blue-500" />;
    } else if (id.includes('multiplication')) {
      return <X size={24} className="text-purple-500" />;
    } else if (id.includes('division')) {
      return <Divide size={24} className="text-orange-500" />;
    }
    return <ChevronRight size={24} className="text-primary" />;
  };
  
  return (
    <div className="math-card hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-start gap-3">
        <div className="math-icon-container">
          {getOperationIcon(id)}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          
          <button
            onClick={() => navigate(`/knowledge/${id}`)}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors transform hover:scale-[1.02] shadow-md"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
