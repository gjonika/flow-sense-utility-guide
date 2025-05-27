
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from '@/pages/Index';
import NewSurvey from '@/pages/NewSurvey';
import SurveyDetails from '@/pages/SurveyDetails';
import DevPanel from '@/pages/DevPanel';
import DevDiagnosticsPanel from '@/pages/DevDiagnosticsPanel';
import Dashboard from '@/pages/Dashboard';
import SurveyProjects from '@/pages/SurveyProjects';
import Analytics from '@/pages/Analytics';
import AIAssistant from '@/pages/AIAssistant';
import HowToUse from '@/pages/HowToUse';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/projects",
    element: <SurveyProjects />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/analytics",
    element: <Analytics />,
  },
  {
    path: "/how-to-use",
    element: <HowToUse />,
  },
  {
    path: "/new-survey",
    element: <NewSurvey />,
  },
  {
    path: "/survey/:id",
    element: <SurveyDetails />,
  },
  {
    path: "/survey/:id/edit",
    element: <NewSurvey />,
  },
  {
    path: "/dev-panel",
    element: <DevPanel />,
  },
  {
    path: "/dev",
    element: <DevDiagnosticsPanel />,
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
