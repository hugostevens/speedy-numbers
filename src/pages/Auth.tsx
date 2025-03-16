
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const sessionCheckTimeoutRef = useRef<number | null>(null);
  
  // Enhanced session check with timeout
  useEffect(() => {
    const checkSession = async () => {
      setCheckingSession(true);
      
      // Create a promise that will resolve after 5 seconds
      const timeoutPromise = new Promise(resolve => {
        sessionCheckTimeoutRef.current = window.setTimeout(() => {
          console.warn("Session check timed out after 5 seconds");
          resolve(null);
        }, 5000);
      });
      
      try {
        console.log("Checking session on Auth page");
        
        // Race between the session check and the timeout
        const result = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise
        ]);
        
        // Clear the timeout if the session check resolved first
        if (sessionCheckTimeoutRef.current) {
          clearTimeout(sessionCheckTimeoutRef.current);
          sessionCheckTimeoutRef.current = null;
        }
        
        // If the session check resolved (not the timeout)
        if (result && 'data' in result) {
          const { data, error } = result;
          
          if (error) {
            console.error("Session check error:", error);
            // Clear potentially corrupted session data
            await supabase.auth.signOut();
            localStorage.removeItem('math-app-auth-token');
          } else if (data.session) {
            console.log("Valid session found, redirecting to home");
            navigate('/');
            return;
          }
        } else {
          // The timeout won, clear any session data to be safe
          console.warn("Session check timed out, clearing session");
          await supabase.auth.signOut();
          localStorage.removeItem('math-app-auth-token');
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
        // Clear potentially corrupted session data
        await supabase.auth.signOut();
        localStorage.removeItem('math-app-auth-token');
      } finally {
        setCheckingSession(false);
      }
    };
    
    if (user) {
      navigate('/');
    } else {
      checkSession();
    }
    
    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (sessionCheckTimeoutRef.current) {
        clearTimeout(sessionCheckTimeoutRef.current);
      }
    };
  }, [user, navigate]);

  // Handle pin input for password - restrict to 4 digits
  const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit to 4 characters
    if (/^\d{0,4}$/.test(value)) {
      setPassword(value);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (password.length !== 4) {
      setError('Password must be exactly 4 digits');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        // For signup, we need to add custom password validation
        // by using the signUp method with custom options
        const { error } = await supabase.auth.signUp({
          email,
          password: password + '00', // Pad to meet min 6 char requirement
          options: {
            data: {
              original_pin: password // Store the original 4-digit PIN for reference
            }
          }
        });
        
        if (error) throw error;
        
        toast.success('Account created! Please check your email to verify your account.');
        setLoading(false);
      } else {
        // For sign in, we need to also pad the password
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password + '00' // Pad to meet min 6 char requirement
        });
        
        if (error) throw error;
        
        // If we successfully logged in, we should have data with a session
        if (data && data.session) {
          toast.success('Logged in successfully!');
          navigate('/');
        } else {
          // This should rarely happen, but just in case
          setError('Login successful but session not created. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // More specific error messages
      if (err.message.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before logging in.');
      } else if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'An error occurred during authentication');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const cancelSessionCheck = () => {
    if (sessionCheckTimeoutRef.current) {
      clearTimeout(sessionCheckTimeoutRef.current);
      sessionCheckTimeoutRef.current = null;
    }
    setCheckingSession(false);
  };
  
  if (checkingSession) {
    return (
      <div className="page-container flex items-center justify-center py-10">
        <div className="math-card w-full max-w-md p-6 text-center">
          <p className="mb-4">Checking login status...</p>
          <Button 
            variant="outline" 
            onClick={cancelSessionCheck}
            className="mt-2"
          >
            Cancel and proceed to login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container flex items-center justify-center py-10">
      <div className="math-card w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Create an Account' : 'Welcome Back!'}
        </h1>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">4-Digit Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter 4 digits"
              value={password}
              onChange={handlePinInput}
              maxLength={4}
              pattern="\d{4}"
              inputMode="numeric"
              required
            />
            <p className="text-xs text-muted-foreground">
              {isSignUp ? 'Create a 4-digit PIN' : 'Enter your 4-digit PIN'}
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading 
              ? 'Loading...' 
              : isSignUp 
                ? 'Create Account' 
                : 'Log In'
            }
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp 
              ? 'Already have an account? Log in' 
              : 'Need an account? Sign up'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
