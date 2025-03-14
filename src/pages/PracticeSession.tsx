
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageHeader from '@/components/layout/PageHeader';
import NumberPad from '@/components/practice/NumberPad';
import MathProblem from '@/components/practice/MathProblem';
import { Progress } from '@/components/ui/progress';
import { MathQuestion, MathLevel } from '@/types';
import { generateQuestionSet, formatOperation } from '@/lib/math';
import { useUser } from '@/context/UserContext';

const levels: Record<string, MathLevel> = {
  'addition-0-4': {
    id: 'addition-0-4',
    name: 'Addition 0-4',
    operation: 'addition',
    range: [0, 4],
    description: 'Basic addition facts',
  },
  'addition-5-9': {
    id: 'addition-5-9',
    name: 'Addition 5-9',
    operation: 'addition',
    range: [5, 9],
    description: 'Basic addition facts',
  },
  'subtraction-0-4': {
    id: 'subtraction-0-4',
    name: 'Subtraction 0-4',
    operation: 'subtraction',
    range: [0, 4],
    description: 'Basic subtraction facts',
  },
  'subtraction-5-9': {
    id: 'subtraction-5-9',
    name: 'Subtraction 5-9',
    operation: 'subtraction',
    range: [5, 9],
    description: 'Basic subtraction facts',
  },
  'multiplication-0-4': {
    id: 'multiplication-0-4',
    name: 'Multiplication 0-4',
    operation: 'multiplication',
    range: [0, 4],
    description: 'Basic multiplication facts',
  },
  'multiplication-5-9': {
    id: 'multiplication-5-9',
    name: 'Multiplication 5-9',
    operation: 'multiplication',
    range: [5, 9],
    description: 'Basic multiplication facts',
  },
  'division-1-4': {
    id: 'division-1-4',
    name: 'Division 1-4',
    operation: 'division',
    range: [1, 4],
    description: 'Basic division facts',
  },
  'division-5-9': {
    id: 'division-5-9',
    name: 'Division 5-9',
    operation: 'division',
    range: [5, 9],
    description: 'Basic division facts',
  },
};

const PracticeSession: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { updateDailyGoal } = useUser();
  
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    if (!levelId || !levels[levelId]) {
      navigate('/practice');
      return;
    }
    
    const level = levels[levelId];
    const questionSet = generateQuestionSet(
      level.operation,
      5,
      level.range[0],
      level.range[1]
    );
    
    setQuestions(questionSet);
  }, [levelId, navigate]);
  
  const handleNumberClick = (num: number) => {
    if (showFeedback) return;
    
    // Limit to 2 digits for simplicity
    if (userInput.length < 2) {
      setUserInput(prev => prev + num);
    }
  };
  
  const handleDeleteClick = () => {
    if (showFeedback) return;
    
    setUserInput(prev => prev.slice(0, -1));
  };
  
  const handleCheckAnswer = () => {
    if (!userInput || showFeedback) return;
    
    const userAnswer = parseInt(userInput);
    const currentQuestion = questions[currentIndex];
    const isCorrect = userAnswer === currentQuestion.answer;
    
    // Update question with user's answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQuestion,
      userAnswer,
      isCorrect
    };
    
    setQuestions(updatedQuestions);
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserInput('');
        setShowFeedback(false);
      } else {
        // Session completed
        const percentCorrect = (score + (isCorrect ? 1 : 0)) / questions.length * 100;
        
        // Update daily goal
        updateDailyGoal(1);
        
        // Show completion message
        toast.success(`Practice completed! Score: ${score + (isCorrect ? 1 : 0)}/${questions.length}`);
        
        // Navigate back to practice menu
        setTimeout(() => {
          navigate('/practice');
        }, 2000);
      }
    }, 1500);
  };
  
  if (questions.length === 0) {
    return <div className="page-container">Loading...</div>;
  }
  
  const level = levels[levelId!];
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100;
  
  return (
    <div className="page-container">
      <PageHeader 
        title="Practice" 
        showBackButton
      />
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>
            Level: {formatOperation(level.operation)} {level.range[0]}-{level.range[1]}
          </span>
        </div>
        
        <Progress value={progress} className="h-2" />
      </div>
      
      <MathProblem 
        question={currentQuestion}
        userInput={userInput}
        showFeedback={showFeedback}
      />
      
      <div className="mt-6">
        {!showFeedback && (
          <button
            onClick={handleCheckAnswer}
            disabled={!userInput}
            className={`w-full py-3 rounded-lg mb-6 transition-colors ${
              userInput
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted/70 text-muted-foreground cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        )}
        
        <NumberPad
          onNumberClick={handleNumberClick}
          onDeleteClick={handleDeleteClick}
        />
      </div>
    </div>
  );
};

export default PracticeSession;
