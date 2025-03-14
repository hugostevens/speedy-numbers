
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { levels } from '@/data/mathLevels';
import { Plus, Minus, X, Divide } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

// Define level status types
type LevelStatus = 'mastered' | 'available' | 'locked';

const Practice: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [levelStatus, setLevelStatus] = useState<Record<string, LevelStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) {
        // If no user is logged in, make only the first level available
        const initialStatus: Record<string, LevelStatus> = {};
        
        // Find the first level (assume it's the first in sorted order)
        const levelIds = Object.keys(levels).sort();
        if (levelIds.length > 0) {
          levelIds.forEach((id, index) => {
            initialStatus[id] = index === 0 ? 'available' : 'locked';
          });
        }
        
        setLevelStatus(initialStatus);
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch user performance data from Supabase
        const { data, error } = await supabase
          .from('user_question_performance')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching user progress:', error);
          toast.error('Failed to load your progress');
          setIsLoading(false);
          return;
        }
        
        // Initialize status for all levels as locked
        const status: Record<string, LevelStatus> = {};
        Object.keys(levels).forEach(id => {
          status[id] = 'locked';
        });
        
        // Process performance data to determine mastered levels
        const operationRangeProgress: Record<string, Record<string, number>> = {};
        
        // Initialize the progress tracking structure
        Object.values(levels).forEach(level => {
          if (!operationRangeProgress[level.operation]) {
            operationRangeProgress[level.operation] = {};
          }
          operationRangeProgress[level.operation][`${level.range[0]}-${level.range[1]}`] = 0;
        });
        
        // Calculate mastery percentage for each level
        data?.forEach(item => {
          Object.values(levels).forEach(level => {
            const num = Math.max(item.num1, item.num2);
            if (item.operation === level.operation && 
                num >= level.range[0] && 
                num <= level.range[1]) {
              if (item.fast_correct_attempts >= 5) {
                const rangeKey = `${level.range[0]}-${level.range[1]}`;
                operationRangeProgress[level.operation][rangeKey]++;
              }
            }
          });
        });
        
        // Determine the highest mastered level and make the next one available
        const masteredLevels: string[] = [];
        Object.values(levels).forEach(level => {
          const rangeKey = `${level.range[0]}-${level.range[1]}`;
          const masteryCount = operationRangeProgress[level.operation][rangeKey];
          
          // Consider a level mastered if at least 10 facts are mastered
          // This threshold can be adjusted based on your requirements
          if (masteryCount >= 10) {
            status[level.id] = 'mastered';
            masteredLevels.push(level.id);
          }
        });
        
        // Sort levels by operation type and then by number range
        const sortedLevelIds = Object.keys(levels).sort((a, b) => {
          const levelA = levels[a];
          const levelB = levels[b];
          
          // First sort by operation
          const operations = ['addition', 'subtraction', 'multiplication', 'division'];
          const opIndexA = operations.indexOf(levelA.operation);
          const opIndexB = operations.indexOf(levelB.operation);
          
          if (opIndexA !== opIndexB) {
            return opIndexA - opIndexB;
          }
          
          // Then sort by range
          return levelA.range[0] - levelB.range[0];
        });
        
        // Make the first non-mastered level available
        let firstAvailableLevelSet = false;
        sortedLevelIds.forEach(id => {
          if (status[id] !== 'mastered' && !firstAvailableLevelSet) {
            status[id] = 'available';
            firstAvailableLevelSet = true;
          }
        });
        
        // If all levels are mastered, make all available
        if (!firstAvailableLevelSet) {
          Object.keys(status).forEach(id => {
            if (status[id] !== 'mastered') {
              status[id] = 'available';
            }
          });
        }
        
        setLevelStatus(status);
      } catch (error) {
        console.error('Error processing progress data:', error);
        toast.error('Failed to load your progress');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProgress();
  }, [user]);
  
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
  
  // Helper function to get CSS classes based on level status
  const getLevelCardClasses = (levelId: string): string => {
    const status = levelStatus[levelId] || 'locked';
    
    let baseClasses = "math-card transition-all duration-300 transform";
    
    switch (status) {
      case 'mastered':
        return `${baseClasses} bg-green-50 border-green-200 hover:shadow-md hover:scale-[1.01]`;
      case 'available':
        return `${baseClasses} hover:shadow-lg hover:scale-[1.02]`;
      case 'locked':
        return `${baseClasses} opacity-50 cursor-not-allowed`;
      default:
        return baseClasses;
    }
  };
  
  if (isLoading) {
    return (
      <div className="page-container">
        <PageHeader title="Practice" showBackButton />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading your progress...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <PageHeader title="Practice" showBackButton />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(levels).map(level => {
          const status = levelStatus[level.id] || 'locked';
          
          return (
            <div 
              key={level.id} 
              className={getLevelCardClasses(level.id)}
            >
              <div className="flex items-start gap-3">
                <div className="math-icon-container">
                  {getOperationIcon(level.operation)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium mb-1">{level.name}</h3>
                    {status === 'mastered' && (
                      <span className="inline-flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Mastered
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{level.description}</p>
                  
                  <button
                    onClick={() => status !== 'locked' && handleStartPractice(level.id)}
                    disabled={status === 'locked'}
                    className={`w-full py-3 px-4 rounded-lg transition-colors transform shadow-md
                      ${status === 'locked' 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]'}`}
                  >
                    {status === 'mastered' 
                      ? 'Practice Again' 
                      : status === 'locked' 
                        ? 'Locked' 
                        : 'Start Practice'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Practice;
