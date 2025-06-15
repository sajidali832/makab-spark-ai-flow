
import { Button } from '@/components/ui/button';
import { X, MessageSquare, Wrench, User, History, MessageCircle, Info, BookOpen, LogOut } from 'lucide-react';
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

  const handleSignOut = () => {
    localStorage.removeItem('makab_user');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      {/* Simplified overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Optimized sidebar with GPU acceleration */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full w-72 sm:w-80 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-200 ease-out gpu-accelerated
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:block
      `}>
        <div className="flex flex-col h-full">
          {/* Simplified header */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <img src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" alt="Makab" className="w-8 h-8 rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-blue-600">MAKAB</span>
                <span className="text-xs text-gray-500">AI Assistant</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Optimized navigation with smooth scroll */}
          <nav className="flex-1 p-4 smooth-scroll overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.id}
                    variant={active ? "default" : "ghost"}
                    className={`w-full justify-start h-10 transition-colors duration-150 ${
                      active 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className={`h-4 w-4 mr-3 ${active ? 'text-white' : 'text-gray-600'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Simplified footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
