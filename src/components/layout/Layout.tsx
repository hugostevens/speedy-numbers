
import React from 'react';
import BottomNav from './BottomNav';
import { useLocation, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  const showBottomNav = !location.pathname.includes('/practice/');
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;
