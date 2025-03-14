
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageHeader from '@/components/layout/PageHeader';
import NumberPad from '@/components/practice/NumberPad';
import MathProblem from '@/components/practice/MathProblem';
import { Progress } from '@/components/ui/progress';
import { MathQuestion, MathLevel } from '@/types';
import { generateQuestionSet, formatOperation } from '@/lib/math';
import { useUser } from '@/context/user';

const levels: Record<string, MathLevel> = {
  'addition-0-10': {
    id: 'addition-0-10',
    name: 'Addition 0-10',
    operation: 'addition',
    range: [0, 10],
    description: 'Basic addition facts',
  },
  'subtraction-0-10': {
    id: 'subtraction-0-10',
    name: 'Subtraction 0-10',
    operation: 'subtraction',
    range: [0, 10],
    description: 'Basic subtraction facts',
  },
  'multiplication-0-5': {
    id: 'multiplication-0-5',
    name: 'Multiplication 0-5',
    operation: 'multiplication',
    range: [0, 5],
    description: 'Basic multiplication facts',
  },
  'division-1-5': {
    id: 'division-1-5',
    name: 'Division 1-5',
    operation: 'division',
    range: [1, 5],
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Reset state when component mounts
    setQuestions([]);
    setCurrentIndex(0);
    setUserInput('');
    setShowFeedback(false);
    setScore(0);
    setIsLoading(true);
    setError(null);
    
    if (!levelId) {
      setError("No level selected");
      setIsLoading(false);
      return;
    }
    
    if (!levels[levelId]) {
      setError(`Invalid level: ${levelId}`);
      setIsLoading(false);
      toast.error("Invalid practice level selected");
      navigate('/practice');
      return;
    }
    
    try {
      const level = levels[levelId];
      const questionSet = generateQuestionSet(
        level.operation,
        5,
        level.range[0],
        level.range[1]
      );
      
      console.log("Generated question set:", questionSet);
      
      if (questionSet.length === 0) {
        throw new Error("Failed to generate questions");
      }
      
      setQuestions(questionSet);
      setIsLoading(false);
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Failed to load questions");
      setIsLoading(false);
      toast.error("Error loading practice session");
    }
  }, [levelId, navigate]);
  
  const handleNumberClick = (num: number) => {
    if (showFeedback) return;
    
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
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserInput('');
        setShowFeedback(false);
      } else {
        const percentCorrect = (score + (isCorrect ? 1 : 0)) / questions.length * 100;
        
        updateDailyGoal(1);
        
        toast.success(`Practice completed! Score: ${score + (isCorrect ? 1 : 0)}/${questions.length}`);
        
        setTimeout(() => {
          navigate('/practice');
        }, 2000);
      }
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <div className="page-container">
        <PageHeader title="Practice" showBackButton />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="mb-4 text-muted-foreground">Loading practice questions...</div>
            <Progress value={100} className="h-2 w-40 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || questions.length === 0) {
    return (
      <div className="page-container">
        <PageHeader title="Practice" showBackButton />
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <div className="text-lg font-medium text-center text-destructive">
            {error || "No questions available for this level."}
          </div>
          <button
            onClick={() => navigate('/practice')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg"
          >
            Back to Practice Menu
          </button>
        </div>
      </div>
    );
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
