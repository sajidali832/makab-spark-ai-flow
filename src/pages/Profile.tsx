import { useState } from 'react';
import ProfilePage from '@/components/profile/ProfilePage';
import Sidebar from '@/components/chat/Sidebar';
import Button from '@/components/ui/Button';
import Menu from '@/components/ui/Menu';

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col lg:ml-0">
        <div className="flex items-center p-3 sm:p-4 border-b border-gray-200 lg:hidden bg-gradient-to-r from-blue-50 to-indigo-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-3 sm:ml-4 text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">Profile</h1>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-2 sm:p-4">
            <ProfilePage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
