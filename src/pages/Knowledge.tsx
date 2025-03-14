
import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import ResourceCard from '@/components/knowledge/ResourceCard';
import TopicCard from '@/components/knowledge/TopicCard';
import { KnowledgeItem } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircleQuestion } from 'lucide-react';
import { toast } from 'sonner';

const recommendedResources: KnowledgeItem[] = [
  {
    id: 'addition-strategies',
    title: 'Addition Strategies',
    description: 'Learn different ways to add numbers',
    type: 'video',
    tags: ['addition']
  }
];

const topics = [
  {
    id: 'addition-0-10',
    title: 'Addition (0-10)',
    description: 'Basic addition facts',
  },
  {
    id: 'subtraction-0-10',
    title: 'Subtraction (0-10)',
    description: 'Basic subtraction facts',
  },
  {
    id: 'number-bonds',
    title: 'Number Bonds',
    description: 'Understanding number relationships',
  }
];

const Knowledge: React.FC = () => {
  const navigate = useNavigate();
  
  const handleResourceSelect = (resource: KnowledgeItem) => {
    // In a real app, this would navigate to a resource page
    navigate(`/knowledge/resource/${resource.id}`);
  };

  const handleAskQuestion = () => {
    // In a real app, this would open a question form or chat interface
    toast.success("Question feature coming soon!");
  };
  
  return (
    <div className="page-container">
      <PageHeader title="Knowledge" showBackButton />
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Recommended for you</h2>
        
        {recommendedResources.map(resource => (
          <ResourceCard 
            key={resource.id}
            resource={resource}
            onSelect={handleResourceSelect}
          />
        ))}
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
        <h2 className="text-lg font-semibold mb-4">All Topics</h2>
        
        <div className="space-y-4">
          {topics.map(topic => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={topic.title}
              description={topic.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Knowledge;
