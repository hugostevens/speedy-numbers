
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { levels } from '@/data/mathLevels';

const Practice: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartPractice = (levelId: string) => {
    navigate(`/practice/${levelId}`);
  };
  
  return (
    <div className="page-container">
      <PageHeader title="Practice" showBackButton />
      
      <div className="space-y-4">
        {Object.values(levels).map(level => (
          <div key={level.id} className="math-card">
            <h3 className="text-lg font-medium mb-1">{level.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
            
            <button
              onClick={() => handleStartPractice(level.id)}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Start Practice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Practice;
