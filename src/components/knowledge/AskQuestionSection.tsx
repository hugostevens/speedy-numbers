
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircleQuestion } from 'lucide-react';

interface AskQuestionSectionProps {
  onAskQuestion: () => void;
}

const AskQuestionSection: React.FC<AskQuestionSectionProps> = ({ onAskQuestion }) => {
  return (
    <div className="math-card mb-6 bg-soft-blue">
      <h2 className="text-lg font-semibold mb-2">Need help with anything else?</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Have a question about a math problem or concept? Ask for help!
      </p>
      <Button 
        onClick={onAskQuestion}
        className="w-full"
        variant="default"
      >
        <MessageCircleQuestion className="mr-2" />
        Ask a Question
      </Button>
    </div>
  );
};

export default AskQuestionSection;
