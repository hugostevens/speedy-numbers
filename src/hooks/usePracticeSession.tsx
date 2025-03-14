
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MathQuestion, MathLevel } from '@/types';
import { generateQuestionSet } from '@/lib/math';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';

export const usePracticeSession = (levelId: string | undefined, level: MathLevel | undefined) => {
  const navigate = useNavigate();
  const { user, updateDailyGoal } = useUser();
  
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [answerTime, setAnswerTime] = useState<number>(0);
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
      // Generate base question set
      const questionSet = generateQuestionSet(
        level.operation,
        5,
        level.range[0],
        level.range[1]
      );
      
      // Debug authentication state
      console.log('Current user state:', user);
      
      if (!user) {
        // If not logged in, just use the generated questions
        console.log('User object is completely missing. Performance tracking disabled.');
        toast.warning('Log in to track your progress and mastery');
        setQuestions(questionSet);
        return;
      }
      
      console.log('User ID:', user.id);
      
      // Check if user is authenticated with Supabase
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
        // For logged in users, fetch performance data
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
        
        // Merge performance data with questions
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
        
        // Set initial mastery info for first question
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
  
  // Reset the timer when moving to a new question
  useEffect(() => {
    setStartTime(Date.now());
    
    // Update mastery info for the current question
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
    // Double-check authentication before updating database
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
      
      // Check if we already have a record for this question
      const { data: existingData, error: fetchError } = await supabase
        .from('user_question_performance')
        .select('*')
        .eq('user_id', user.id)
        .eq('operation', question.operation)
        .eq('num1', question.num1)
        .eq('num2', question.num2)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the code for "no rows returned"
        console.error('Error fetching existing performance:', fetchError);
        return;
      }
      
      if (existingData) {
        // Update existing record
        console.log('Updating existing record:', existingData.id);
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
        // Insert new record
        console.log('Creating new performance record');
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
    
    // Update the questions array with user's answer
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
    
    // Update performance in database
    updateQuestionPerformance(currentQuestion, isCorrect, timeTaken);
    
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
    masteryInfo,
    handleNumberClick,
    handleResetInput,
    handleCheckAnswer
  };
};
