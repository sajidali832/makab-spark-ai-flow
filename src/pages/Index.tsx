
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import ChatInterface from '@/components/chat/ChatInterface';
import FreeCourseSection from '@/components/course/FreeCourseSection';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCourseSection, setShowCourseSection] = useState(true);

  useEffect(() => {
    // Check if user is logged in (for now, using localStorage)
    const user = localStorage.getItem('makab_user');
    if (user) {
      setIsAuthenticated(true);
      setShowCourseSection(false); // Hide course section when logged in
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show course section for non-authenticated users
  if (!isAuthenticated && showCourseSection) {
    return <FreeCourseSection />;
  }

  return (
    <div className="min-h-screen bg-white">
      {!isAuthenticated ? (
        <LoginForm onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <ChatInterface />
      )}
    </div>
  );
};

export default Index;
