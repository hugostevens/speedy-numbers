
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { MathLevel } from '@/types';

const levels: MathLevel[] = [
  {
    id: 'addition-0-10',
    name: 'Addition 0-10',
    operation: 'addition',
    range: [0, 10],
    description: 'Basic addition facts',
  },
  {
    id: 'subtraction-0-10',
    name: 'Subtraction 0-10',
    operation: 'subtraction',
    range: [0, 10],
    description: 'Basic subtraction facts',
  },
  {
    id: 'multiplication-0-5',
    name: 'Multiplication 0-5',
    operation: 'multiplication',
    range: [0, 5],
    description: 'Basic multiplication facts',
  },
  {
    id: 'division-1-5',
    name: 'Division 1-5',
    operation: 'division',
    range: [1, 5],
    description: 'Basic division facts',
  },
];

const Practice: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartPractice = (levelId: string) => {
    navigate(`/practice/${levelId}`);
  };
  
  return (
    <div className="page-container">
      <PageHeader title="Practice" showBackButton />
      
      <div className="space-y-4">
        {levels.map(level => (
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
