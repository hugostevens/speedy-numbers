
import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import MathProblem from '@/components/practice/MathProblem';
import SessionHeader from '@/components/practice/SessionHeader';
import AnswerInput from '@/components/practice/AnswerInput';
import { usePracticeSession } from '@/hooks/usePracticeSession';
import { levels } from '@/data/mathLevels';

const PracticeSession: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const level = levelId ? levels[levelId] : undefined;
  
  const {
    questions,
    currentIndex,
    userInput,
    showFeedback,
    answerTime,
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
