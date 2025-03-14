
import React from 'react';
import { MathQuestion } from '@/types';
import { getOperationSymbol } from '@/lib/math';

interface MathProblemProps {
  question: MathQuestion;
  userInput: string;
  showFeedback?: boolean;
  answerTime?: number;
}

const MathProblem: React.FC<MathProblemProps> = ({ 
  question, 
  userInput,
  showFeedback = false,
  answerTime = 0
}) => {
  const { operation, num1, num2, answer } = question;
  const operationSymbol = getOperationSymbol(operation);
  const isCorrect = parseInt(userInput) === answer;
  const isFast = isCorrect && answerTime < 3;
  
  return (
    <div className="text-center py-8">
      <div className="text-4xl font-bold mb-6">
        {num1} {operationSymbol} {num2} = ?
      </div>
      
      <div className="relative">
        <input
          type="text"
          className={`text-center text-2xl font-bold py-3 px-4 border-2 rounded-lg w-32 mx-auto block ${
            showFeedback 
              ? isCorrect 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
              : 'border-gray-300'
          }`}
          value={userInput}
          readOnly
        />
        
        {showFeedback && (
          <div 
            className={`absolute top-full left-0 right-0 mt-2 text-sm font-medium ${
              isCorrect ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isCorrect 
              ? (isFast ? 'That was fast!' : 'Correct!')
              : `Incorrect. The answer is ${answer}.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MathProblem;
