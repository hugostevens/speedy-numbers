
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';

interface ProgressItem {
  operation: string;
  range: string;
  percentage: number;
  mastered: number;
  total: number;
}

const ProgressContent: React.FC = () => {
  const { user } = useUser();
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([
    { operation: 'Addition', range: '(0-10)', percentage: 0, mastered: 0, total: 0 },
    { operation: 'Subtraction', range: '(0-10)', percentage: 0, mastered: 0, total: 0 },
    { operation: 'Multiplication', range: '(0-5)', percentage: 0, mastered: 0, total: 0 },
    { operation: 'Division', range: '(0-5)', percentage: 0, mastered: 0, total: 0 },
  ]);
  
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user || !user.session) return;
      
      try {
        // Fetch all user performance data
        const { data, error } = await supabase
          .from('user_question_performance')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching progress data:', error);
          return;
        }
        
        // Define ranges for each operation
        const ranges = {
          'addition': '(0-10)',
          'subtraction': '(0-10)',
          'multiplication': '(0-5)',
          'division': '(0-5)'
        };
        
        // Calculate mastery for each operation
        const operationCounts: Record<string, { mastered: number, total: number }> = {
          'addition': { mastered: 0, total: 0 },
          'subtraction': { mastered: 0, total: 0 },
          'multiplication': { mastered: 0, total: 0 },
          'division': { mastered: 0, total: 0 }
        };
        
        // Count mastered questions
        data.forEach(item => {
          if (item.operation in operationCounts) {
            operationCounts[item.operation].total++;
            if (item.fast_correct_attempts >= 5) {
              operationCounts[item.operation].mastered++;
            }
          }
        });
        
        // Calculate percentages and update state
        const updatedProgressItems = Object.entries(operationCounts).map(([operation, counts]) => {
          const capitalizedOp = operation.charAt(0).toUpperCase() + operation.slice(1);
          return {
            operation: capitalizedOp,
            range: ranges[operation as keyof typeof ranges] || '',
            percentage: counts.total > 0 ? Math.round((counts.mastered / counts.total) * 100) : 0,
            mastered: counts.mastered,
            total: counts.total
          };
        });
        
        setProgressItems(updatedProgressItems);
      } catch (error) {
        console.error('Error processing progress data:', error);
      }
    };
    
    fetchUserProgress();
  }, [user]);
  
  return (
    <div className="space-y-6">
      <div className="math-card p-6">
        <h2 className="text-3xl font-bold mb-2">Your Progress</h2>
        <p className="text-muted-foreground mb-6">Math facts mastered</p>
        
        <div className="space-y-6">
          {progressItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium">
                  {item.operation} {item.range}
                </div>
                <div className="font-semibold">
                  {item.percentage}% {item.mastered > 0 && `(${item.mastered}/${item.total})`}
                </div>
              </div>
              <Progress value={item.percentage} className="h-3 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </div>
      
      <Button variant="outline" className="w-full py-6 border-primary border flex items-center justify-center gap-2">
        <Award size={18} />
        <span className="font-medium">Share Progress Report</span>
      </Button>
    </div>
  );
};

export default ProgressContent;
