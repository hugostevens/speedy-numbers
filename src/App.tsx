
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import Layout from "@/components/layout/Layout";

// Pages
import Index from "@/pages/Index";
import Practice from "@/pages/Practice";
import PracticeSession from "@/pages/PracticeSession";
import Knowledge from "@/pages/Knowledge";
import Rewards from "@/pages/Rewards";
import Progress from "@/pages/Progress";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/practice/:levelId" element={<PracticeSession />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
