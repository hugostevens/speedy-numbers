
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ 
  icon, 
  label, 
  value, 
  onClick 
}) => {
  return (
    <button
      className="w-full flex items-center justify-between py-3 px-1 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">
          {icon}
        </div>
        <span>{label}</span>
      </div>
      
      <div className="flex items-center">
        {value && (
          <span className="text-muted-foreground mr-2">{value}</span>
        )}
        <ChevronRight size={18} className="text-muted-foreground" />
      </div>
    </button>
  );
};

export default SettingsItem;
