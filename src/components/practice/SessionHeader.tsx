
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { formatOperation } from '@/lib/math';
import { MathLevel } from '@/types';

interface SessionHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  level: MathLevel;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
  currentIndex,
  totalQuestions,
  level,
}) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-1">
        <span>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span>
          Level: {formatOperation(level.operation)} {level.range[0]}-{level.range[1]}
        </span>
      </div>
      
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default SessionHeader;
