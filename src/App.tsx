import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import PaymentPage from "./pages/PaymentPage";
import { SovereignAICoursePage } from "./pages/SovereignAICoursePage";
import { ForgingFlameCoursePage } from "./pages/ForgingFlameCoursePage";
import { FlameErrorBoundary } from "./components/FlameErrorBoundary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/course/sovereign-ai" element={
              <FlameErrorBoundary>
                <SovereignAICoursePage />
              </FlameErrorBoundary>
            } />
            <Route path="/course/technical-mastery" element={
              <FlameErrorBoundary>
                <ForgingFlameCoursePage />
              </FlameErrorBoundary>
            } />
            <Route path="/sovereign-ai" element={
              <FlameErrorBoundary>
                <SovereignAICoursePage />
              </FlameErrorBoundary>
            } />
            <Route path="/forging-flame" element={
              <FlameErrorBoundary>
                <ForgingFlameCoursePage />
              </FlameErrorBoundary>
            } />
            <Route path="/payment" element={<PaymentPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
