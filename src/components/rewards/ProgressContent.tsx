
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

interface ProgressItem {
  operation: string;
  range: string;
  percentage: number;
}

const ProgressContent: React.FC = () => {
  // Mock data for progress tracking
  const progressItems: ProgressItem[] = [
    { operation: 'Addition', range: '(0-10)', percentage: 80 },
    { operation: 'Subtraction', range: '(0-10)', percentage: 60 },
    { operation: 'Multiplication', range: '(0-5)', percentage: 30 },
    { operation: 'Division', range: '(0-5)', percentage: 10 },
  ];
  
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
                <div className="font-semibold">{item.percentage}%</div>
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
