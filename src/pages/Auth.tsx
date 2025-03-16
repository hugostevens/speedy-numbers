
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import AuthLogo from '@/components/auth/AuthLogo';
import AuthForm from '@/components/auth/AuthForm';
import LoadingState from '@/components/auth/LoadingState';

const Auth: React.FC = () => {
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { user, session } = useUser();
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      setCheckingSession(true);
      
      try {
        if (user && session) {
          console.log("User already in context, redirecting to home");
          navigate('/');
          return;
        }
        
        const activeSession = await getSession();
        if (activeSession) {
          console.log("Session found, redirecting to home");
          navigate('/');
          return;
        }
        
        console.log("No active session found, showing login form");
      } catch (err) {
        console.error("Error checking auth status:", err);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkAuthStatus();
  }, [user, session, navigate]);
  
  if (checkingSession) {
    return <LoadingState onCancel={() => setCheckingSession(false)} />;
  }
  
  return (
    <div className="page-container flex flex-col items-center justify-center py-10">
      <AuthLogo />
      <AuthForm />
    </div>
  );
};

export default Auth;
