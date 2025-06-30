
import { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import ChatInterface from '@/components/chat/ChatInterface';
import NotificationPrompt from '@/components/notifications/NotificationPrompt';
import PageLoader from '@/components/ui/PageLoader';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading animation for better UX
    const timer = setTimeout(() => {
      // Check if user is logged in (for now, using localStorage)
      const user = localStorage.getItem('makab_user');
      if (user) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }, 1500); // Show loading for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-white">
      {!isAuthenticated ? (
        <div className="animate-fade-in">
          <LoginForm onAuthSuccess={() => setIsAuthenticated(true)} />
        </div>
      ) : (
        <div className="animate-fade-in">
          <ChatInterface />
          <NotificationPrompt />
        </div>
      )}
    </div>
  );
};

export default Index;
