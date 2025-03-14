
import React from 'react';
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
  return (
    <div className="mt-6">
      <div className="flex justify-between gap-2 mb-6">
        {!showFeedback && userInput && (
          <button
            onClick={onResetInput}
            className="py-3 px-4 rounded-lg bg-muted/70 text-muted-foreground hover:bg-muted/90 transition-colors"
          >
            Clear
          </button>
        )}
        
        {!showFeedback && (
          <button
            onClick={onCheckAnswer}
            disabled={!userInput}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              userInput
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted/70 text-muted-foreground cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        )}
      </div>
      
      <NumberPad
        onNumberClick={onNumberClick}
        onDeleteClick={() => {}} // This is not used anymore but kept for compatibility
      />
    </div>
  );
};

export default AnswerInput;
