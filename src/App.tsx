import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { Onboarding } from "@/components/Onboarding";
import { MainLayout } from "@/components/Navigation";
import { HomePage } from "@/pages/HomePage";
import { GlossaryPage } from "@/pages/GlossaryPage";
import { CompanionPage } from "@/pages/CompanionPage";
import { SymptomsPage } from "@/pages/SymptomsPage";
import { GoodDaysPage } from "@/pages/GoodDaysPage";
import { PeacePage } from "@/pages/PeacePage";
import { ResourcesPage } from "@/pages/ResourcesPage";
import { EmergencyPage } from "@/pages/EmergencyPage";
import { SettingsPage } from "@/pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isLoading, isOnboarded } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="text-4xl mb-4">🌿</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/companion" element={<CompanionPage />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/good-days" element={<GoodDaysPage />} />
        <Route path="/peace" element={<PeacePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
