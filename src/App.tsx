import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import Layout from "@/components/layout/Layout";
import { useUser } from "@/context/UserContext";
import { Suspense, lazy, useEffect, useState } from "react";
import { getSession } from "@/integrations/supabase/client";

// Pages
import Index from "@/pages/Index";
import Practice from "@/pages/Practice";
import PracticeSession from "@/pages/PracticeSession";
import Knowledge from "@/pages/Knowledge";
import KnowledgeDetail from "@/pages/KnowledgeDetail";
import Rewards from "@/pages/Rewards";
import Progress from "@/pages/Progress";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      // If user context is still loading, wait
      if (isLoading) return;
      
      // If user exists in context, we're good
      if (user) {
        setChecking(false);
        return;
      }
      
      // No user in context, try to get session directly
      try {
        const session = await getSession();
        if (!session) {
          // No session, we need to redirect
          setChecking(false);
        } else {
          // We have a session but no user data
          // The UserContext should handle this case through its auth listener
          // Just wait a bit longer for it to catch up
          setTimeout(() => setChecking(false), 500);
        }
      } catch (err) {
        console.error("Error checking session in ProtectedRoute:", err);
        setChecking(false);
      }
    };
    
    checkAuth();
  }, [user, isLoading]);
  
  // Show loading state while checking
  if (checking || isLoading) {
    return <div className="page-container flex items-center justify-center">Loading...</div>;
  }
  
  // If no user, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // User exists, render protected content
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<Layout />}>
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/practice" element={
                <ProtectedRoute>
                  <Practice />
                </ProtectedRoute>
              } />
              <Route path="/practice/:levelId" element={
                <ProtectedRoute>
                  <PracticeSession />
                </ProtectedRoute>
              } />
              <Route path="/knowledge" element={
                <ProtectedRoute>
                  <Knowledge />
                </ProtectedRoute>
              } />
              <Route path="/knowledge/:topicId" element={
                <ProtectedRoute>
                  <KnowledgeDetail />
                </ProtectedRoute>
              } />
              <Route path="/rewards" element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              } />
              <Route path="/progress" element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
