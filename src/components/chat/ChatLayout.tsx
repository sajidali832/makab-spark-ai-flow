
import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';

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
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <div className="flex-1 flex flex-col">
        <ChatHeader onMenuClick={handleMenuClick} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
