
import { useState } from 'react';
import ProfilePage from '@/components/profile/ProfilePage';
import Sidebar from '@/components/chat/Sidebar';

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-0">
        <div className="flex items-center p-4 border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-4 text-xl font-semibold">Profile</h1>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4">
            <ProfilePage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
