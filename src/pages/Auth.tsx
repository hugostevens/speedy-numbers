import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getSession } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Zap } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
        const { error } = await supabase.auth.signUp({
          email,
          password: password + '00',
          options: {
            data: {
              original_pin: password
            }
          }
        });
        
        if (error) throw error;
        
        toast.success('Account created! Please check your email to verify your account.');
      } else {
        console.log("Attempting to log in with email:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password + '00'
        });
        
        if (error) throw error;
        
        if (data && data.session) {
          console.log("Login successful, got session:", data.session.user.id);
          toast.success('Logged in successfully!');
          navigate('/');
        } else {
          setError('Login successful but session not created. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
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
  
  if (checkingSession) {
    return (
      <div className="page-container flex items-center justify-center py-10">
        <div className="math-card w-full max-w-md p-6 text-center">
          <p className="mb-4">Checking login status...</p>
          <Button 
            variant="outline" 
            onClick={() => setCheckingSession(false)}
            className="mt-2"
          >
            Cancel and proceed to login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container flex flex-col items-center justify-center py-10">
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

      <div className="math-card w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-6 text-center">
          {isSignUp ? 'Create an Account' : 'Welcome Back!'}
        </h2>
        
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

