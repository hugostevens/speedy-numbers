
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MathQuestion, MathLevel } from '@/types';
import { generateQuestionSet } from '@/lib/math';
import { useUser } from '@/context/UserContext';

export const usePracticeSession = (levelId: string | undefined, level: MathLevel | undefined) => {
  const navigate = useNavigate();
  const { updateDailyGoal } = useUser();
  
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [answerTime, setAnswerTime] = useState<number>(0);

  useEffect(() => {
    if (!levelId || !level) {
      navigate('/practice');
      return;
    }
    
    const questionSet = generateQuestionSet(
      level.operation,
      5,
      level.range[0],
      level.range[1]
    );
    
    setQuestions(questionSet);
    setStartTime(Date.now());
  }, [levelId, level, navigate]);
  
  // Reset the timer when moving to a new question
  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);
  
  const handleNumberClick = (num: number) => {
    if (showFeedback) return;
    
    if (userInput.length < 2) {
      setUserInput(prev => prev + num);
    }
  };
  
  const handleResetInput = () => {
    if (showFeedback) return;
    
    setUserInput('');
  };
  
  const handleCheckAnswer = () => {
    if (!userInput || showFeedback) return;
    
    // Calculate time taken to answer
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
    setAnswerTime(timeTaken);
    
    const userAnswer = parseInt(userInput);
    const currentQuestion = questions[currentIndex];
    const isCorrect = userAnswer === currentQuestion.answer;
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQuestion,
      userAnswer,
      isCorrect,
      timeToAnswer: timeTaken
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

  return {
    questions,
    currentIndex,
    userInput,
    showFeedback,
    answerTime,
    handleNumberClick,
    handleResetInput,
    handleCheckAnswer
  };
};
