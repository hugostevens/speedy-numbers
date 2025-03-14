
import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import MathProblem from '@/components/practice/MathProblem';
import SessionHeader from '@/components/practice/SessionHeader';
import AnswerInput from '@/components/practice/AnswerInput';
import { usePracticeSession } from '@/hooks/usePracticeSession';
import { levels } from '@/data/mathLevels';
import { Award, AlertCircle } from 'lucide-react';

const PracticeSession: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const level = levelId ? levels[levelId] : undefined;
  
  const {
    questions,
    currentIndex,
    userInput,
    showFeedback,
    answerTime,
    masteryInfo,
    handleNumberClick,
    handleResetInput,
    handleCheckAnswer
  } = usePracticeSession(levelId, level);
  
  if (questions.length === 0) {
    return <div className="page-container">Loading...</div>;
  }
  
  const currentQuestion = questions[currentIndex];
  
  return (
    <div className="page-container">
      <PageHeader 
        title="Practice" 
        showBackButton
      />
      
      <SessionHeader 
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        level={level!}
      />
      
      {masteryInfo && (
        <div className="flex justify-center mb-2">
          {masteryInfo.isMastered && (
            <div className="inline-flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <Award className="h-4 w-4 mr-1" />
              <span>Mastered</span>
            </div>
          )}
          
          {masteryInfo.isStruggling && (
            <div className="inline-flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Practice needed</span>
            </div>
          )}
        </div>
      )}
      
      <MathProblem 
        question={currentQuestion}
        userInput={userInput}
        showFeedback={showFeedback}
        answerTime={answerTime}
      />
      
      <AnswerInput 
        userInput={userInput}
        showFeedback={showFeedback}
        onNumberClick={handleNumberClick}
        onResetInput={handleResetInput}
        onCheckAnswer={handleCheckAnswer}
      />
    </div>
  );
};

export default PracticeSession;
