
import { useState } from 'react';
import Sidebar from './Sidebar';

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleSidebarClose} 
        onMenuClick={handleMenuClick}
      />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;
