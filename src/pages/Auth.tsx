import React, { useState, useEffect } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();
  
  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
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
          password: password.padEnd(6, '0'), // Pad to meet min 6 char requirement
          options: {
            data: {
              original_pin: password // Store the original 4-digit PIN for reference
            }
          }
        });
        
        if (error) throw error;
        
        toast.success('Account created! Please check your email to verify your account.');
      } else {
        // For sign in, we need to also pad the password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: password.padEnd(6, '0') // Pad to meet min 6 char requirement
        });
        
        if (error) throw error;
        
        toast.success('Logged in successfully!');
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };
  
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
