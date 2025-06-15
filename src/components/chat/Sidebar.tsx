
import { Button } from '@/components/ui/button';
import { X, MessageSquare, Wrench, User, History, MessageCircle, Info, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/chat' },
    { id: 'tools', label: 'Tools', icon: Wrench, path: '/tools' },
    { id: 'free-course', label: 'Free Course', icon: BookOpen, path: '/free-course' },
    { id: 'history', label: 'Tools History', icon: History, path: '/history' },
    { id: 'chat-history', label: 'Chats History', icon: MessageCircle, path: '/chat-history' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'about', label: 'About', icon: Info, path: '/about' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full w-72 sm:w-80 bg-white border-r border-gray-200 z-50 shadow-lg
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:block
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-8 h-8 rounded-lg" />
              </div>
              <div>
                <span className="font-bold text-xl text-white">
                  MAKAB
                </span>
                <p className="text-sm text-white/80 mt-1">AI Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden h-10 w-10 p-0 rounded-lg text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.id}
                    variant={active ? "default" : "ghost"}
                    className={`w-full justify-start text-base h-12 rounded-xl transition-all duration-200 ${
                      active 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:shadow-md' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${active ? 'text-white' : 'text-gray-600'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-center bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 mb-2">Made with ❤️ by</p>
              <p className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sajid
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
