
import { Button } from '@/components/ui/button';
import { X, MessageSquare, Wrench, User, History, MessageCircle, Info, BookOpen, LogOut, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLoader from '@/components/ui/PageLoader';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuClick: () => void;
}

const Sidebar = ({ isOpen, onClose, onMenuClick }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

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
    if (location.pathname !== path) {
      setLoading(true);
      setTimeout(() => {
        navigate(path);
        onClose();
        setTimeout(() => setLoading(false), 150);
      }, 100);
    } else {
      onClose();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('makab_user');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      {loading && <PageLoader />}
      
      {/* Mobile menu button - visible only on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="h-10 w-10 p-0 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200"
        >
          {isOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          lg:hidden
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-md border-r border-gray-200/80 shadow-xl
          transform transition-all duration-300 ease-out will-change-transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:sticky lg:left-0 lg:top-0 lg:translate-x-0 lg:shadow-lg lg:bg-white lg:w-72
        `}
        style={{ maxWidth: '100vw' }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200/80 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <img src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" alt="Makab" className="w-7 h-7 rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MAKAB</span>
                <span className="text-xs text-gray-500 font-medium">AI Assistant</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden h-8 w-8 p-0 text-gray-500 hover:bg-white/70 hover:text-gray-700 transition-all duration-200 rounded-lg"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-5 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.id}
                    variant={active ? "default" : "ghost"}
                    className={`
                      w-full justify-start h-12 transition-all duration-300 ease-out transform group
                      ${active 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg scale-[1.02]' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:translate-x-1 hover:shadow-sm hover:border-blue-200/50 border border-transparent'
                      }
                      rounded-xl font-medium
                    `}
                    onClick={() => handleNavigation(item.path)}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animation: isOpen ? 'fade-in 0.3s ease-out forwards' : undefined
                    }}
                  >
                    <Icon className={`h-5 w-5 mr-3 transition-all duration-300 ${
                      active 
                        ? 'text-white' 
                        : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'
                    }`} />
                    <span className="font-semibold">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
          
          {/* Footer */}
          <div className="p-5 border-t border-gray-200/80 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 h-12 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 hover:border-red-200 transition-all duration-300 ease-out hover:shadow-md rounded-xl font-semibold border-red-200/50"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
