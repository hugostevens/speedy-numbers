
import React from 'react';

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({ title, children }) => {
  return (
    <div className="math-card mb-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default SettingsGroup;
