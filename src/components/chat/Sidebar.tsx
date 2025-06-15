
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
      {/* Enhanced Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Enhanced Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full w-72 sm:w-80 bg-white/10 backdrop-blur-2xl border-r border-white/20 z-50 shadow-2xl
        transform transition-all duration-500 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:block
      `}>
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-glass border border-white/30">
                <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-8 h-8 rounded-xl" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MAKAB
                </span>
                <p className="text-sm text-gray-600 mt-1">AI Assistant</p>
              </div>
            </div>
            <Button
              variant="frosted"
              size="sm"
              onClick={onClose}
              className="lg:hidden h-10 w-10 p-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Enhanced Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.id}
                    variant={active ? "liquid" : "frosted"}
                    className={`w-full justify-start text-base h-14 rounded-2xl transition-all duration-300 ${
                      active 
                        ? 'shadow-xl hover:shadow-2xl transform hover:scale-[1.02]' 
                        : 'hover:shadow-lg hover:scale-[1.01] text-gray-700 hover:text-gray-900'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className={`h-6 w-6 mr-4 ${active ? 'text-white' : 'text-gray-600'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Enhanced Footer */}
          <div className="p-6 border-t border-white/20 bg-gradient-to-r from-gray-50/20 to-white/10 backdrop-blur-xl">
            <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-glass">
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
