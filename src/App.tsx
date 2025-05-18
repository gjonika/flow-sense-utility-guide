
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddReading from "./pages/AddReading";
import MonthlyReadingsPage from "./pages/monthly";
import AddMonthlyReadings from "./pages/AddMonthlyReadings";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Suppliers from "./pages/Suppliers";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Profile from "./pages/Profile";
import './i18n';
import { useTranslation } from 'react-i18next';
// main.tsx or App.tsx
const searchParams = new URLSearchParams(window.location.search);
const accessCode = searchParams.get("code");
if (accessCode !== "letmein123") {
  document.body.innerHTML = "<h1>Unauthorized Access</h1><p>You need a valid code.</p>";
  throw new Error("Unauthorized");
}


const queryClient = new QueryClient();
const { t } = useTranslation();

<h1>{t("addMonthly.title")}</h1>

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              <Route path="/" element={<Layout />}>
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="add-reading"
                  element={
                    <ProtectedRoute>
                      <AddReading />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="add-monthly-readings"
                  element={
                    <ProtectedRoute>
                      <AddMonthlyReadings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="monthly"
                  element={
                    <ProtectedRoute>
                      <MonthlyReadingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="suppliers"
                  element={
                    <ProtectedRoute>
                      <Suppliers />
                    </ProtectedRoute>
                  }
                />
              </Route>



              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
console.log("Loaded URL:", window.location.href);
console.log("Access code is:", accessCode);

if (typeof window !== "undefined") {
  const searchParams = new URLSearchParams(window.location.search);
  const accessCode = searchParams.get("code");

  if (accessCode !== "letmein123") {
    document.body.innerHTML = "<h1>Unauthorized Access</h1><p>You need a valid code.</p>";
    throw new Error("Unauthorized");
  }
}
