
import React from 'react';
import PageHeader from '@/components/layout/PageHeader';

const Progress: React.FC = () => {
  return (
    <div className="page-container">
      <PageHeader title="Progress" showBackButton />
      
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-2">Coming Soon!</h2>
        <p className="text-muted-foreground">
          Detailed progress tracking and analytics will be available soon.
        </p>
      </div>
    </div>
  );
};

export default Progress;
