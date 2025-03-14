
import React from 'react';
import { KnowledgeItem, MathOperation } from '@/types';
import ResourceCard from '@/components/knowledge/ResourceCard';
import { getOperationSymbol } from '@/lib/math';

interface StruggleQuestion {
  id: string;
  operation: MathOperation;
  num1: number;
  num2: number;
  answer: number;
  consecutive_incorrect: number;
}

interface StrugglingQuestionsProps {
  isLoading: boolean;
  user: any;
  strugglingQuestions: StruggleQuestion[];
  onSelectQuestion: (resource: KnowledgeItem) => void;
  debugInfo?: string; // Add this for debugging
}

const StrugglingQuestions: React.FC<StrugglingQuestionsProps> = ({
  isLoading,
  user,
  strugglingQuestions,
  onSelectQuestion,
  debugInfo
}) => {
  const createResourceFromQuestion = (question: StruggleQuestion): KnowledgeItem => {
    const operationSymbol = getOperationSymbol(question.operation);
    
    return {
      id: question.id,
      title: `${question.num1} ${operationSymbol} ${question.num2} = ${question.answer}`,
      description: `This question has been answered incorrectly ${question.consecutive_incorrect} time(s) in a row.`,
      type: 'interactive',
      tags: [question.operation]
    };
  };
  
  if (isLoading) {
    return <p className="text-center py-4">Loading personalized recommendations...</p>;
  }
  
  if (!user) {
    return (
      <div className="bg-muted p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Sign in to see personalized recommendations</h2>
        <p className="text-sm text-muted-foreground">
          We'll show you questions you're struggling with and recommend resources to help.
        </p>
      </div>
    );
  }
  
  if (strugglingQuestions.length > 0) {
    return (
      <>
        <h2 className="text-lg font-semibold mb-4">Would you like some help with the following questions?</h2>
        
        {strugglingQuestions.map(question => (
          <ResourceCard 
            key={question.id}
            resource={createResourceFromQuestion(question)}
            onSelect={onSelectQuestion}
            num1={question.num1}
            num2={question.num2}
            operation={question.operation}
            answer={question.answer}
            showHelpButton={true}
          />
        ))}
      </>
    );
  }
  
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Great job! You're not struggling with any questions.</h2>
      <p className="text-sm text-muted-foreground mb-4">
        As you practice more, we'll recommend resources for questions you find challenging.
      </p>
      {debugInfo && (
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <p>Debug info: {debugInfo}</p>
        </div>
      )}
    </>
  );
};

export default StrugglingQuestions;
