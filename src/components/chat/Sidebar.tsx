
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, MessageSquare, Wrench, User, History, Info } from 'lucide-react';
import ProfilePage from '../profile/ProfilePage';
import ToolsSection from '../tools/ToolsSection';
import HistorySection from '../history/HistorySection';
import AboutPage from '../about/AboutPage';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState<'chat' | 'tools' | 'profile' | 'history' | 'about'>('chat');

  const menuItems = [
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
    { id: 'tools' as const, label: 'Tools', icon: Wrench },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'about' as const, label: 'About', icon: Info },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfilePage />;
      case 'tools':
        return <ToolsSection />;
      case 'history':
        return <HistorySection />;
      case 'about':
        return <AboutPage />;
      default:
        return (
          <div className="p-6 text-center text-gray-600">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Continue your conversation in the main chat area.</p>
          </div>
        );
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:block
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MAKAB
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="p-4 border-b border-gray-200">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(item.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
