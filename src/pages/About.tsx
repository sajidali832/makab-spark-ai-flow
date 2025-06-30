
import { useState } from 'react';
import AboutPage from '@/components/about/AboutPage';
import Sidebar from '@/components/chat/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import PageLoader from '@/components/ui/PageLoader';

const About = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading with animation
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <div className="flex items-center p-3 sm:p-4 border-b border-gray-200 lg:hidden bg-gradient-to-r from-blue-50 to-indigo-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="h-8 w-8 p-0 animate-fade-in"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-3 text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent animate-fade-in">
            About
          </h1>
        </div>
        <div className="flex-1 overflow-auto smooth-scroll">
          <div className="w-full animate-fade-in">
            <AboutPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
