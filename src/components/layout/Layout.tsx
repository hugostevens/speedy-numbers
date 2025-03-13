
import React from 'react';
import BottomNav from './BottomNav';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showBottomNav = !location.pathname.includes('/practice/');
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;
