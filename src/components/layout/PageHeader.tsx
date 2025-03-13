
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  showBackButton = false,
  rightElement 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between py-4 mb-4">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)}
            className="btn-icon text-foreground/80 hover:text-foreground mr-1"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="font-bold">{title}</h1>
      </div>
      {rightElement && (
        <div>
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
