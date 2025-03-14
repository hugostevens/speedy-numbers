
import React from 'react';
import NumberPad from '@/components/practice/NumberPad';
import { Button } from '@/components/ui/button';
import { CheckCircle, RotateCcw } from 'lucide-react';

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
    <div className="mt-8">
      <div className="flex justify-between gap-3 mb-6">
        {!showFeedback && userInput && (
          <Button
            onClick={onResetInput}
            variant="outline"
            className="py-6 px-5 rounded-xl bg-muted/70 text-muted-foreground hover:bg-muted/90 transition-all duration-200 transform hover:scale-105"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Clear
          </Button>
        )}
        
        {!showFeedback && (
          <Button
            onClick={onCheckAnswer}
            disabled={!userInput}
            className={`flex-1 py-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
              userInput
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted/70 text-muted-foreground cursor-not-allowed'
            }`}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Check Answer
          </Button>
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
