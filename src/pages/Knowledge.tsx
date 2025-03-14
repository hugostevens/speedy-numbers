
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import ResourceCard from '@/components/knowledge/ResourceCard';
import TopicCard from '@/components/knowledge/TopicCard';
import AskQuestionDialog from '@/components/knowledge/AskQuestionDialog';
import { KnowledgeItem, MathQuestion } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircleQuestion, Video, Headphones, Eye } from 'lucide-react';
import { levels } from '@/data/mathLevels';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { getOperationSymbol } from '@/lib/math';

interface StruggleQuestion {
  id: string;
  operation: string;
  num1: number;
  num2: number;
  answer: number;
  consecutive_incorrect: number;
}

const Knowledge: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useUser();
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [strugglingQuestions, setStrugglingQuestions] = useState<StruggleQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStrugglingQuestions = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching struggling questions for user:', user.id);
        
        const { data, error } = await supabase
          .from('user_question_performance')
          .select('*')
          .eq('user_id', user.id)
          .gt('consecutive_incorrect', 0)
          .order('consecutive_incorrect', { ascending: false })
          .limit(3);
          
        if (error) {
          console.error('Error fetching struggling questions:', error);
          setIsLoading(false);
          return;
        }
        
        console.log('Found struggling questions:', data);
        setStrugglingQuestions(data as StruggleQuestion[]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error processing struggling questions:', error);
        setIsLoading(false);
      }
    };
    
    fetchStrugglingQuestions();
  }, [user]);
  
  const handleResourceSelect = (resource: KnowledgeItem) => {
    // In a real app, this would navigate to a resource page
    navigate(`/knowledge/resource/${resource.id}`);
  };

  const handleAskQuestion = () => {
    setQuestionDialogOpen(true);
  };
  
  // Create a knowledge item from a struggling question
  const createResourceFromQuestion = (question: StruggleQuestion): KnowledgeItem => {
    const operationSymbol = getOperationSymbol(question.operation);
    
    // Find which level this question belongs to
    const matchingLevel = Object.values(levels).find(level => 
      level.operation === question.operation && 
      Math.max(question.num1, question.num2) >= level.range[0] && 
      Math.max(question.num1, question.num2) <= level.range[1]
    );
    
    return {
      id: question.id,
      title: `${question.num1} ${operationSymbol} ${question.num2} = ${question.answer}`,
      description: `Learn strategies for ${matchingLevel?.name || question.operation} problems`,
      type: 'video',
      tags: [question.operation]
    };
  };
  
  return (
    <div className="page-container">
      <PageHeader title="Knowledge" showBackButton />
      
      <div className="mb-6">
        {isLoading ? (
          <p className="text-center py-4">Loading personalized recommendations...</p>
        ) : strugglingQuestions.length > 0 ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Would you like some help with the following questions?</h2>
            
            {strugglingQuestions.map(question => (
              <ResourceCard 
                key={question.id}
                resource={createResourceFromQuestion(question)}
                onSelect={handleResourceSelect}
              />
            ))}
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4">Great job! You're not struggling with any questions.</h2>
            <p className="text-sm text-muted-foreground mb-4">
              As you practice more, we'll recommend resources for questions you find challenging.
            </p>
          </>
        )}
      </div>
      
      <div className="math-card mb-6 bg-soft-blue">
        <h2 className="text-lg font-semibold mb-2">Need help?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Have a question about a math problem or concept? Ask for help!
        </p>
        <Button 
          onClick={handleAskQuestion}
          className="w-full"
          variant="default"
        >
          <MessageCircleQuestion className="mr-2" />
          Ask a Question
        </Button>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">All Topics</h2>
        <div className="flex flex-wrap items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Learn different ways to add, subtract, multiply, and divide
          </p>
          
          <div className="flex items-center gap-2 mt-1 md:mt-0">
            <div className="flex items-center">
              <div className="math-icon-container h-6 w-6 mr-1">
                <Video size={16} />
              </div>
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                Video
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="math-icon-container h-6 w-6 mr-1">
                <Headphones size={16} />
              </div>
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                Audio
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="math-icon-container h-6 w-6 mr-1">
                <Eye size={16} />
              </div>
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                Visual
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(levels).map(level => (
            <TopicCard
              key={level.id}
              id={level.id}
              title={level.name}
              description={level.description}
            />
          ))}
        </div>
      </div>

      <AskQuestionDialog 
        open={questionDialogOpen} 
        onOpenChange={setQuestionDialogOpen} 
      />
    </div>
  );
};

export default Knowledge;
