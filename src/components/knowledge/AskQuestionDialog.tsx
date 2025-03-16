
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AskQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AskQuestionDialog: React.FC<AskQuestionDialogProps> = ({ open, onOpenChange }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    try {
      setStatus('loading');
      setError('');
      
      const { data, error } = await supabase.functions.invoke('ask-math-question', {
        body: { question },
      });
      
      if (error) throw error;
      
      setAnswer(data.answer);
      setStatus('success');
    } catch (err) {
      console.error('Error asking question:', err);
      setError('Failed to get an answer. Please try again.');
      setStatus('error');
    }
  };
  
  const handleReset = () => {
    setQuestion('');
    setAnswer('');
    setStatus('idle');
    setError('');
  };
  
  const handleClose = () => {
    onOpenChange(false);
    // Reset the form after the dialog close animation completes
    setTimeout(handleReset, 300);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ask a Math Question</DialogTitle>
        </DialogHeader>
        
        {status === 'idle' || status === 'error' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Enter your math question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px]"
            />
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                Ask Question
              </Button>
            </DialogFooter>
          </form>
        ) : status === 'loading' ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Thinking about your question...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <p className="font-medium mb-2">Your question:</p>
              <p className="text-muted-foreground">{question}</p>
            </div>
            
            <div className="rounded-md bg-muted/50 p-4 max-h-[200px]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="font-medium mb-2">Answer:</p>
                  <ScrollArea className="h-[140px] w-full pr-4">
                    <p className="text-muted-foreground whitespace-pre-line">{answer}</p>
                  </ScrollArea>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleReset}>
                Ask Another Question
              </Button>
              <Button onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionDialog;
