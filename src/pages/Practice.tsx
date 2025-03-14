
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { levels } from '@/data/mathLevels';
import { Plus, Minus, X, Divide } from 'lucide-react';

const Practice: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartPractice = (levelId: string) => {
    navigate(`/practice/${levelId}`);
  };
  
  // Helper function to get icon based on operation
  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'addition':
        return <Plus size={24} className="text-green-500" />;
      case 'subtraction':
        return <Minus size={24} className="text-blue-500" />;
      case 'multiplication':
        return <X size={24} className="text-purple-500" />;
      case 'division':
        return <Divide size={24} className="text-orange-500" />;
      default:
        return <Plus size={24} className="text-green-500" />;
    }
  };
  
  return (
    <div className="page-container">
      <PageHeader title="Practice" showBackButton />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(levels).map(level => (
          <div 
            key={level.id} 
            className="math-card hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex items-start gap-3">
              <div className="math-icon-container">
                {getOperationIcon(level.operation)}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{level.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{level.description}</p>
                
                <button
                  onClick={() => handleStartPractice(level.id)}
                  className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors transform hover:scale-[1.02] shadow-md"
                >
                  Start Practice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Practice;
