
import React from 'react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  onCancel: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ onCancel }) => {
  return (
    <div className="page-container flex items-center justify-center py-10">
      <div className="math-card w-full max-w-md p-6 text-center">
        <p className="mb-4">Checking login status...</p>
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="mt-2"
        >
          Cancel and proceed to login
        </Button>
      </div>
    </div>
  );
};

export default LoadingState;
