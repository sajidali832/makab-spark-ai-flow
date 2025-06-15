
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ToolsSection from '@/components/tools/ToolsSection';
import Sidebar from '@/components/chat/Sidebar';
import NotificationPrompt from '@/components/notifications/NotificationPrompt';

const Tools = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar – Make menu btn exactly flush to top/left and visually pleasing */}
        <div className="flex items-center p-3 sm:p-4 border-b border-gray-200 lg:hidden bg-gradient-to-r from-blue-50 to-indigo-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="h-8 w-8 p-0"
            style={{ marginLeft: 0 }}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-3 sm:ml-4 text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">Tools</h1>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-purple-50">
          <ToolsSection />
        </div>
      </div>
      <NotificationPrompt />
    </div>
  );
};

export default Tools;
