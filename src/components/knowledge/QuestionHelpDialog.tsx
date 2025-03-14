
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MathOperation } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { getOperationSymbol } from '@/lib/math';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface QuestionHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operation: MathOperation;
  num1: number;
  num2: number;
  answer: number;
}

const QuestionHelpDialog: React.FC<QuestionHelpDialogProps> = ({
  open,
  onOpenChange,
  operation,
  num1,
  num2,
  answer
}) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchHelp = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-question-help', {
        body: { operation, num1, num2 }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to get help');
      }
      
      setExplanation(data.explanation);
    } catch (err) {
      console.error('Error getting help:', err);
      setError('Sorry, we could not get help for this question right now. Please try again later.');
      toast({
        title: 'Error',
        description: 'Could not load help for this question',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  React.useEffect(() => {
    if (open && !explanation && !isLoading) {
      fetchHelp();
    }
  }, [open]);
  
  const operationSymbol = getOperationSymbol(operation);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Help with {num1} {operationSymbol} {num2}</DialogTitle>
          <DialogDescription>
            Let's learn how to solve this problem.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Getting help for you...</span>
            </div>
          ) : error ? (
            <div className="text-destructive py-2">
              {error}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-xl font-bold mb-4 text-center">
                {num1} {operationSymbol} {num2} = {answer}
              </p>
              {explanation && (
                <div className="markdown-content">
                  <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between mt-6">
          <Button 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {!isLoading && (
            <Button 
              variant="outline"
              onClick={fetchHelp}
              disabled={isLoading}
            >
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionHelpDialog;
