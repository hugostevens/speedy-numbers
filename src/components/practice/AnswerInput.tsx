
import React, { useEffect } from 'react';
import NumberPad from '@/components/practice/NumberPad';

interface AnswerInputProps {
  userInput: string;
  showFeedback: boolean;
  onNumberClick: (num: number) => void;
  onResetInput: () => void;
  onCheckAnswer: () => void;
}

const AnswerInput: React.FC<AnswerInputProps> = ({
  userInput,
  showFeedback,
  onNumberClick,
  onResetInput,
  onCheckAnswer,
}) => {
  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent handling keyboard events when showing feedback
      if (showFeedback) return;
      
      // Handle numeric keys (0-9)
      if (/^[0-9]$/.test(e.key)) {
        onNumberClick(parseInt(e.key));
      } 
      // Handle Enter key for checking answer
      else if (e.key === 'Enter' && userInput) {
        onCheckAnswer();
      } 
      // Handle Backspace/Delete for clearing input
      else if ((e.key === 'Backspace' || e.key === 'Delete') && userInput) {
        onResetInput();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userInput, showFeedback, onNumberClick, onResetInput, onCheckAnswer]);

  return (
    <div className="mt-8">
      <NumberPad
        onNumberClick={onNumberClick}
        onDeleteClick={onResetInput}
        onCheckAnswer={onCheckAnswer}
        userInput={userInput}
      />
    </div>
  );
};

export default AnswerInput;
