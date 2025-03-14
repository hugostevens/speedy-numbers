
import React, { useState } from 'react';
import { KnowledgeItem, MathOperation } from '@/types';
import { Video, BookOpen, Play, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionHelpDialog from './QuestionHelpDialog';

interface ResourceCardProps {
  resource: KnowledgeItem;
  onSelect: (resource: KnowledgeItem) => void;
  num1?: number;
  num2?: number;
  operation?: MathOperation;
  answer?: number;
  showHelpButton?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  onSelect,
  num1,
  num2,
  operation,
  answer,
  showHelpButton = false
}) => {
  const { title, description, type } = resource;
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  
  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Video size={20} />;
      case 'interactive':
        return <Play size={20} />;
      default:
        return <BookOpen size={20} />;
    }
  };
  
  const handleHelpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHelpDialogOpen(true);
  };
  
  return (
    <>
      <div 
        className="math-card card-hover cursor-pointer relative"
        onClick={() => onSelect(resource)}
      >
        <div className="flex items-start gap-3">
          <div className="math-icon-container h-10 w-10">
            {getIcon()}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            
            <div className="flex mt-2">
              <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded-full">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          </div>
          
          {showHelpButton && num1 !== undefined && num2 !== undefined && operation && (
            <div className="ml-auto">
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                onClick={handleHelpClick}
              >
                <HelpCircle className="mr-1 h-4 w-4" />
                Help
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {showHelpButton && num1 !== undefined && num2 !== undefined && operation && answer !== undefined && (
        <QuestionHelpDialog
          open={helpDialogOpen}
          onOpenChange={setHelpDialogOpen}
          operation={operation}
          num1={num1}
          num2={num2}
          answer={answer}
        />
      )}
    </>
  );
};

export default ResourceCard;
