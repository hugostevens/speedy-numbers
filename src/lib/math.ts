
import { MathOperation, MathQuestion } from '@/types';

export const generateQuestion = (
  operation: MathOperation, 
  min: number = 0, 
  max: number = 10
): MathQuestion => {
  let num1: number, num2: number, answer: number;
  
  switch (operation) {
    case 'addition':
      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
      answer = num1 + num2;
      break;
    case 'subtraction':
      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * (num1 - min + 1)) + min;
      answer = num1 - num2;
      break;
    case 'multiplication':
      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
      answer = num1 * num2;
      break;
    case 'division':
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
      // Ensure num2 is not zero
      if (num2 === 0) num2 = 1;
      // Generate a multiple of num2 for clean division
      const multiple = Math.floor(Math.random() * (max - min + 1)) + min;
      num1 = num2 * multiple;
      answer = multiple;
      break;
  }
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    operation,
    num1,
    num2,
    answer
  };
};

export const generateQuestionSet = (
  operation: MathOperation,
  count: number = 5,
  min: number = 0,
  max: number = 10
): MathQuestion[] => {
  return Array(count)
    .fill(null)
    .map(() => generateQuestion(operation, min, max));
};

export const checkAnswer = (question: MathQuestion, userAnswer: number): boolean => {
  return question.answer === userAnswer;
};

export const getOperationSymbol = (operation: MathOperation): string => {
  switch (operation) {
    case 'addition': return '+';
    case 'subtraction': return '-';
    case 'multiplication': return '×';
    case 'division': return '÷';
  }
};

export const formatOperation = (operation: MathOperation): string => {
  return operation.charAt(0).toUpperCase() + operation.slice(1);
};

export const getOperationColor = (operation: MathOperation): string => {
  switch (operation) {
    case 'addition': return 'text-blue-500';
    case 'subtraction': return 'text-purple-500';
    case 'multiplication': return 'text-orange-500';
    case 'division': return 'text-green-500';
  }
};
