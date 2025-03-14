
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
      <div className="text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-float">
        {num1} {operationSymbol} {num2} = ?
      </div>
      
      <div className="relative">
        <input
          type="text"
          className={`text-center text-3xl font-bold py-4 px-6 border-3 rounded-xl w-36 mx-auto block shadow-md transition-all duration-300 ${
            showFeedback 
              ? isCorrect 
                ? 'border-green-500 bg-green-50 animate-scale-in' 
                : 'border-red-500 bg-red-50 animate-scale-in'
              : 'border-gray-300 hover:border-primary focus:border-primary'
          }`}
          value={userInput}
          readOnly
        />
        
        {showFeedback && (
          <div 
            className={`absolute top-full left-0 right-0 mt-3 text-lg font-medium animate-fade-in ${
              isCorrect ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isCorrect 
              ? (isFast ? '⚡ That was fast! ⚡' : '🎉 Correct! 🎉')
              : `❌ Incorrect. The answer is ${answer}.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MathProblem;
