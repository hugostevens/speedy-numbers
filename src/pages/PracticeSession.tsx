import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import MathProblem from '@/components/practice/MathProblem';
import SessionHeader from '@/components/practice/SessionHeader';
import AnswerInput from '@/components/practice/AnswerInput';
import { usePracticeSession } from '@/hooks/usePracticeSession';
import { levels } from '@/data/mathLevels';
import { Award, AlertCircle, Check, ArrowRight, HelpCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PracticeSession: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const level = levelId ? levels[levelId] : undefined;
  const navigate = useNavigate();
  
  const {
    questions,
    currentIndex,
    userInput,
    showFeedback,
    answerTime,
    masteryInfo,
    sessionComplete,
    handleNumberClick,
    handleResetInput,
    handleCheckAnswer,
    restartSession
  } = usePracticeSession(levelId, level);
  
  if (questions.length === 0) {
    return <div className="page-container">Loading...</div>;
  }
  
  // Don't access current question if session is complete
  const currentQuestion = sessionComplete ? null : questions[currentIndex];
  
  const handleContinuePractice = () => {
    // Call restartSession directly instead of navigating
    restartSession();
  };
  
  const handleGetHelp = () => {
    navigate('/knowledge');
  };
  
  const handleFinishForNow = () => {
    navigate('/');
  };
  
  return (
    <div className="page-container">
      <PageHeader 
        title="Practice" 
        showBackButton
        backPath="/practice"
      />
      
      {!sessionComplete ? (
        <>
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
          
          {currentQuestion && (
            <MathProblem 
              question={currentQuestion}
              userInput={userInput}
              showFeedback={showFeedback}
              answerTime={answerTime}
            />
          )}
          
          <AnswerInput 
            userInput={userInput}
            showFeedback={showFeedback}
            onNumberClick={handleNumberClick}
            onResetInput={handleResetInput}
            onCheckAnswer={handleCheckAnswer}
          />
        </>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Practice Complete!</h2>
          <p className="text-muted-foreground mb-8">What would you like to do next?</p>
          
          <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
            <Button onClick={handleContinuePractice} className="w-full justify-start">
              <ArrowRight className="mr-2" />
              Keep going
            </Button>
            
            <Button onClick={handleGetHelp} variant="outline" className="w-full justify-start">
              <HelpCircle className="mr-2" />
              Get some help
            </Button>
            
            <Button onClick={handleFinishForNow} variant="secondary" className="w-full justify-start">
              <Home className="mr-2" />
              Finish for now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeSession;
