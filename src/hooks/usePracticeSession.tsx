
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MathQuestion, MathLevel } from '@/types';
import { generateQuestionSet } from '@/lib/math';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';

export const usePracticeSession = (levelId: string | undefined, level: MathLevel | undefined) => {
  const navigate = useNavigate();
  const { user, updateDailyGoal, checkAndUpdateStreak } = useUser();
  
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [answerTime, setAnswerTime] = useState<number>(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [masteryInfo, setMasteryInfo] = useState<{
    isMastered: boolean;
    isStruggling: boolean;
  }>({ isMastered: false, isStruggling: false });

  useEffect(() => {
    if (!levelId || !level) {
      navigate('/practice');
      return;
    }
    
    const fetchQuestionsWithMasteryInfo = async () => {
      const questionSet = generateQuestionSet(
        level.operation,
        10, // Changed from 5 to 10 questions
        level.range[0],
        level.range[1]
      );
      
      console.log('Current user state:', user);
      
      if (!user) {
        console.log('User object is completely missing. Performance tracking disabled.');
        toast.warning('Log in to track your progress and mastery');
        setQuestions(questionSet);
        return;
      }
      
      console.log('User ID:', user.id);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current Supabase session:', session);
      
      if (!session) {
        console.log('No active Supabase session. Performance tracking disabled.');
        toast.warning('Your session has expired. Please log in again to track progress.');
        setQuestions(questionSet);
        return;
      }
      
      try {
        console.log('Fetching performance data for user:', user.id);
        const { data: performanceData, error } = await supabase
          .from('user_question_performance')
          .select('*')
          .eq('user_id', user.id)
          .eq('operation', level.operation)
          .in('num1', questionSet.map(q => q.num1))
          .in('num2', questionSet.map(q => q.num2));
          
        if (error) {
          console.error('Error fetching performance data:', error);
          toast.error('Could not retrieve your past performance data');
          setQuestions(questionSet);
          return;
        }
        
        console.log('Performance data retrieved:', performanceData);
        
        const enhancedQuestions = questionSet.map(question => {
          const performance = performanceData?.find(p => 
            p.operation === question.operation && 
            p.num1 === question.num1 && 
            p.num2 === question.num2
          );
          
          return {
            ...question,
            performance: performance ? {
              attempts: performance.attempts,
              correctAttempts: performance.correct_attempts,
              fastCorrectAttempts: performance.fast_correct_attempts,
              consecutiveIncorrect: performance.consecutive_incorrect,
              isMastered: performance.fast_correct_attempts >= 5,
              isStruggling: performance.consecutive_incorrect >= 2
            } : {
              attempts: 0,
              correctAttempts: 0,
              fastCorrectAttempts: 0,
              consecutiveIncorrect: 0,
              isMastered: false,
              isStruggling: false
            }
          };
        });
        
        setQuestions(enhancedQuestions);
        
        if (enhancedQuestions.length > 0 && enhancedQuestions[0].performance) {
          setMasteryInfo({
            isMastered: enhancedQuestions[0].performance.isMastered,
            isStruggling: enhancedQuestions[0].performance.isStruggling
          });
        }
      } catch (error) {
        console.error('Error processing questions:', error);
        setQuestions(questionSet);
      }
    };
    
    fetchQuestionsWithMasteryInfo();
  }, [levelId, level, navigate, user]);
  
  useEffect(() => {
    setStartTime(Date.now());
    
    if (questions.length > 0 && currentIndex < questions.length) {
      const currentQuestion = questions[currentIndex];
      if (currentQuestion.performance) {
        setMasteryInfo({
          isMastered: currentQuestion.performance.isMastered,
          isStruggling: currentQuestion.performance.isStruggling
        });
      } else {
        setMasteryInfo({ isMastered: false, isStruggling: false });
      }
    }
  }, [currentIndex, questions]);
  
  const updateQuestionPerformance = async (
    question: MathQuestion, 
    isCorrect: boolean, 
    answerTime: number
  ) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!user || !session) {
      console.log('User not logged in or session expired. Cannot update performance data.');
      toast.warning('Please log in to save your progress');
      return;
    }
    
    try {
      const isFastAnswer = answerTime < 1.5;
      console.log(`Updating performance for ${question.num1} ${question.operation} ${question.num2}:`, {
        isCorrect,
        answerTime,
        isFastAnswer
      });
      
      const { data: existingData, error: fetchError } = await supabase
        .from('user_question_performance')
        .select('*')
        .eq('user_id', user.id)
        .eq('operation', question.operation)
        .eq('num1', question.num1)
        .eq('num2', question.num2)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing performance:', fetchError);
        return;
      }
      
      if (existingData) {
        const { error: updateError } = await supabase
          .from('user_question_performance')
          .update({
            attempts: existingData.attempts + 1,
            correct_attempts: isCorrect ? existingData.correct_attempts + 1 : existingData.correct_attempts,
            fast_correct_attempts: (isCorrect && isFastAnswer) ? existingData.fast_correct_attempts + 1 : existingData.fast_correct_attempts,
            consecutive_incorrect: isCorrect ? 0 : existingData.consecutive_incorrect + 1,
            last_attempted_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
          
        if (updateError) {
          console.error('Error updating performance:', updateError);
          toast.error('Failed to save your progress');
        } else {
          console.log('Performance updated successfully');
          toast.success('Progress saved');
        }
      } else {
        const { data: newRecord, error: insertError } = await supabase
          .from('user_question_performance')
          .insert({
            user_id: user.id,
            operation: question.operation,
            num1: question.num1,
            num2: question.num2,
            answer: question.answer,
            attempts: 1,
            correct_attempts: isCorrect ? 1 : 0,
            fast_correct_attempts: (isCorrect && isFastAnswer) ? 1 : 0,
            consecutive_incorrect: isCorrect ? 0 : 1
          })
          .select();
          
        if (insertError) {
          console.error('Error inserting performance:', insertError);
          toast.error('Failed to save your progress');
        } else {
          console.log('New performance record created:', newRecord);
          toast.success('Progress saved');
        }
      }
    } catch (error) {
      console.error('Error updating question performance:', error);
      toast.error('Something went wrong while tracking your progress');
    }
  };
  
  const handleNumberClick = (num: number) => {
    if (showFeedback || sessionComplete) return;
    
    if (userInput.length < 2) {
      setUserInput(prev => prev + num);
    }
  };
  
  const handleResetInput = () => {
    if (showFeedback || sessionComplete) return;
    
    setUserInput('');
  };
  
  const handleCheckAnswer = () => {
    if (!userInput || showFeedback || sessionComplete) return;
    
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
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
    
    updateQuestionPerformance(currentQuestion, isCorrect, timeTaken);
    
    // Check if this is the last question
    const isLastQuestion = currentIndex >= questions.length - 1;
    
    setTimeout(() => {
      if (!isLastQuestion) {
        // Move to next question
        setCurrentIndex(prev => prev + 1);
        setUserInput('');
        setShowFeedback(false);
      } else {
        // End the session
        setSessionComplete(true);
        const finalScore = score + (isCorrect ? 1 : 0);
        const percentCorrect = finalScore / questions.length * 100;
        
        updateDailyGoal(1);
        checkAndUpdateStreak();
        
        toast.success(`Practice completed! Score: ${finalScore}/${questions.length}`);
        
        // Navigate away from the practice session after a delay
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
    masteryInfo,
    sessionComplete,
    handleNumberClick,
    handleResetInput,
    handleCheckAnswer
  };
};
