
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/chat/Sidebar';
import FreeCourseSection from '@/components/course/FreeCourseSection';

const FreeCourse = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top Navigation Bar for Mobile */}
        <div className="lg:hidden flex items-center justify-between p-3 sm:p-4 bg-white border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" alt="Makab" className="w-8 h-8 rounded-full" />
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MAKAB
            </span>
          </div>
        </div>

        {/* Free Course Content - ensure scroll */}
        <div className="flex-1 overflow-y-auto">
          <FreeCourseSection />
        </div>
      </div>
    </div>
  );
};

export default FreeCourse;
