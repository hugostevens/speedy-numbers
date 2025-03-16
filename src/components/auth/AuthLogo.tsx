
import React from 'react';
import { Zap } from 'lucide-react';

const AuthLogo: React.FC = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-flex items-center justify-center mb-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <Zap size={48} className="text-primary animate-pulse-light" />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Speedy Numbers</h1>
      <p className="text-muted-foreground max-w-md">
        Master math skills through fun, quick practice sessions
      </p>
    </div>
  );
};

export default AuthLogo;
