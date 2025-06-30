
import { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import ChatInterface from '@/components/chat/ChatInterface';
import NotificationPrompt from '@/components/notifications/NotificationPrompt';
import PageLoader from '@/components/ui/PageLoader';
import MaintenanceScreen from '@/components/maintenance/MaintenanceScreen';
import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isMaintenanceMode } = useMaintenanceMode();

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = localStorage.getItem('makab_user');
      if (user) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Show maintenance screen if in maintenance mode
  if (isMaintenanceMode) {
    return <MaintenanceScreen />;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-white">
      {!isAuthenticated ? (
        <LoginForm onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <div>
          <ChatInterface />
          <NotificationPrompt />
        </div>
      )}
    </div>
  );
};

export default Index;
