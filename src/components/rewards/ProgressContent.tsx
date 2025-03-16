
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { levels } from '@/data/mathLevels';
import { MathOperation } from '@/types';
import { getLevelDisplayName } from '@/lib/math';

interface ProgressItem {
  id: string;
  operation: string;
  range: string;
  percentage: number;
  mastered: number;
  total: number;
}

const ProgressContent: React.FC = () => {
  const { user } = useUser();
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Helper function to format operation name
  const formatOperation = (operation: string): string => {
    return operation.charAt(0).toUpperCase() + operation.slice(1);
  };
  
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Fetching progress data for user:", user.id);
        
        // Fetch all user performance data
        const { data, error } = await supabase
          .from('user_question_performance')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching progress data:', error);
          setIsLoading(false);
          return;
        }
        
        console.log("Fetched performance data:", data);
        
        // Create a map to track mastery for each level
        const levelProgress: Record<string, { mastered: number, total: number }> = {};
        
        // Initialize level progress for all available levels
        Object.values(levels).forEach(level => {
          const levelId = level.id;
          levelProgress[levelId] = { mastered: 0, total: 0 };
        });
        
        // Group performance data by operation and range
        data.forEach(item => {
          const num = Math.max(item.num1, item.num2);
          const operation = item.operation as MathOperation;
          
          // Find matching level for this question
          Object.values(levels).forEach(level => {
            if (level.operation === operation && 
                num >= level.range[0] && 
                num <= level.range[1]) {
              levelProgress[level.id].total++;
              if (item.fast_correct_attempts >= 5) {
                levelProgress[level.id].mastered++;
              }
            }
          });
        });
        
        // Convert to progress items for display
        const updatedProgressItems = Object.values(levels).map(level => {
          const progress = levelProgress[level.id] || { mastered: 0, total: 0 };
          return {
            id: level.id,
            operation: formatOperation(level.operation),
            range: `(${level.range[0]}-${level.range[1]})`,
            percentage: progress.total > 0 ? Math.round((progress.mastered / progress.total) * 100) : 0,
            mastered: progress.mastered,
            total: progress.total
          };
        });
        
        console.log("Processed progress items:", updatedProgressItems);
        setProgressItems(updatedProgressItems);
        setIsLoading(false);
      } catch (error) {
        console.error('Error processing progress data:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserProgress();
  }, [user]);
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading your progress...</div>;
  }
  
  if (!user) {
    return (
      <div className="math-card p-6 text-center">
        <p className="mb-4">Please log in to view your progress.</p>
        <Button onClick={() => window.location.href = '/auth'}>Log In</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="math-card p-6">
        <h2 className="text-3xl font-bold mb-2">Your Progress</h2>
        <p className="text-muted-foreground mb-6">Math facts mastered</p>
        
        {progressItems.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No progress data yet. Start practicing to see your progress!
          </p>
        ) : (
          <div className="space-y-6">
            {progressItems.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">
                    {getLevelDisplayName(item.id)}
                  </div>
                  <div className="font-semibold">
                    {item.percentage}% {item.total > 0 && `(${item.mastered}/${item.total})`}
                  </div>
                </div>
                <Progress value={item.percentage} className="h-3 rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button variant="outline" className="w-full py-6 border-primary border flex items-center justify-center gap-2">
        <Award size={18} />
        <span className="font-medium">Share Progress Report</span>
      </Button>
    </div>
  );
};

export default ProgressContent;
