
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lightbulb } from 'lucide-react';

const LearningSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Learning</h2>
      
      <div className="space-y-4">
        <div className="math-card">
          <div className="flex items-start gap-4">
            <div className="math-icon-container">
              <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-1">Practice</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Become better at math facts
              </p>
              <button
                onClick={() => navigate('/practice')}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Start Practice
              </button>
            </div>
          </div>
        </div>
        
        <div className="math-card">
          <div className="flex items-start gap-4">
            <div className="math-icon-container">
              <Lightbulb size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-1">Knowledge</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Learn tips and tricks
              </p>
              <button
                onClick={() => navigate('/knowledge')}
                className="w-full py-2 px-4 bg-white border border-border text-foreground rounded-md hover:bg-muted/50 transition-colors"
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningSection;
