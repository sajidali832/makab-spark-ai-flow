
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatLayout from "./components/chat/ChatLayout";
import MaintenanceScreen from "./components/maintenance/MaintenanceScreen";
import { useMaintenanceMode } from "./hooks/useMaintenanceMode";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Tools from "./pages/Tools";
import FreeCourse from "./pages/FreeCourse";
import History from "./pages/History";
import ChatHistory from "./pages/ChatHistory";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import Templates from "./pages/Templates";
import Analytics from "./pages/Analytics";
import ContentHub from "./pages/ContentHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isMaintenanceMode } = useMaintenanceMode();

  // Show maintenance screen for all routes when in maintenance mode
  if (isMaintenanceMode) {
    return <MaintenanceScreen />;
  }

  return (
    <ChatLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/free-course" element={<FreeCourse />} />
        <Route path="/history" element={<History />} />
        <Route path="/chat-history" element={<ChatHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/content-hub" element={<ContentHub />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ChatLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
