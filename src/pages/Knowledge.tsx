
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { KnowledgeItem, MathOperation } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Import our components
import StrugglingQuestions from '@/components/knowledge/StrugglingQuestions';
import AskQuestionSection from '@/components/knowledge/AskQuestionSection';
import TopicsSection from '@/components/knowledge/TopicsSection';
import AskQuestionDialog from '@/components/knowledge/AskQuestionDialog';

interface StruggleQuestion {
  id: string;
  operation: MathOperation;
  num1: number;
  num2: number;
  answer: number;
  consecutive_incorrect: number;
}

const Knowledge: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [strugglingQuestions, setStrugglingQuestions] = useState<StruggleQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("");
  
  useEffect(() => {
    const fetchStrugglingQuestions = async () => {
      if (!user?.id) {
        console.log('No user ID found, skipping fetch of struggling questions');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching struggling questions for user:', user.id);
        
        // Get ALL user questions first to debug what's in the database
        const { data: allData, error: allError } = await supabase
          .from('user_question_performance')
          .select('*')
          .eq('user_id', user.id);
          
        if (allError) {
          console.error('Error fetching all questions:', allError);
          setDebugInfo(`Error fetching all questions: ${allError.message}`);
        } else {
          console.log('All user questions:', allData);
          const strugglingCount = allData?.filter(q => q.consecutive_incorrect >= 1).length || 0;
          setDebugInfo(`Found ${allData?.length || 0} total questions, ${strugglingCount} with consecutive_incorrect >= 1`);
        }
        
        // Now get only the struggling questions
        const { data, error } = await supabase
          .from('user_question_performance')
          .select('*')
          .eq('user_id', user.id)
          .gte('consecutive_incorrect', 1) // Using gte(1) as discussed
          .order('consecutive_incorrect', { ascending: false })
          .limit(3);
          
        if (error) {
          console.error('Error fetching struggling questions:', error);
          toast({
            title: 'Error',
            description: 'Could not load your struggling questions',
            variant: 'destructive'
          });
          setIsLoading(false);
          return;
        }
        
        console.log('Found struggling questions:', data);
        
        if (data && data.length > 0) {
          const typedData = data.map(item => ({
            ...item,
            operation: item.operation as MathOperation
          })) as StruggleQuestion[];
          
          setStrugglingQuestions(typedData);
        } else {
          setStrugglingQuestions([]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error processing struggling questions:', error);
        toast({
          title: 'Error',
          description: 'Could not process your struggling questions',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };
    
    fetchStrugglingQuestions();
  }, [user, toast]);
  
  const handleResourceSelect = (resource: KnowledgeItem) => {
    navigate(`/knowledge/resource/${resource.id}`);
  };

  const handleAskQuestion = () => {
    setQuestionDialogOpen(true);
  };
  
  const handleStruggleQuestionSelect = (resource: KnowledgeItem) => {
    console.log('Struggling question selected, navigating to help view', resource);
    // In the future we could navigate to a dedicated help page
  };
  
  return (
    <div className="page-container">
      <PageHeader title="Tips & Tricks" showBackButton />
      
      <div className="mb-6">
        <StrugglingQuestions 
          isLoading={isLoading}
          user={user}
          strugglingQuestions={strugglingQuestions}
          onSelectQuestion={handleStruggleQuestionSelect}
          debugInfo={debugInfo}
        />
      </div>
      
      <AskQuestionSection onAskQuestion={handleAskQuestion} />
      
      <TopicsSection />

      <AskQuestionDialog 
        open={questionDialogOpen} 
        onOpenChange={setQuestionDialogOpen} 
      />
    </div>
  );
};

export default Knowledge;
