
import { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import ChatInterface from '@/components/chat/ChatInterface';
import NotificationPrompt from '@/components/notifications/NotificationPrompt';
import PageLoader from '@/components/ui/PageLoader';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = localStorage.getItem('makab_user');
      if (user) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }, 800); // Shorter loading time

    return () => clearTimeout(timer);
  }, []);

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
