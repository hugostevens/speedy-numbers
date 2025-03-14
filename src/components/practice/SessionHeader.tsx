
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
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full animate-pulse-light">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          Level: {formatOperation(level.operation)} {level.range[0]}-{level.range[1]}
        </span>
      </div>
      
      <Progress value={progress} className="h-3 rounded-full bg-secondary/40" />
    </div>
  );
};

export default SessionHeader;
