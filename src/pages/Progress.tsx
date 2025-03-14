
import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import ProgressContent from '@/components/rewards/ProgressContent';

const Progress: React.FC = () => {
  return (
    <div className="page-container">
      <PageHeader title="Progress" showBackButton />
      <ProgressContent />
    </div>
  );
};

export default Progress;
