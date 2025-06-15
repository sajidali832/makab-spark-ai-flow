
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

  // TODO: Implement logout logic below.
  const handleSignOut = () => {
    // Remove user info, tokens, etc. Replace with your actual logout logic if needed.
    localStorage.removeItem('makab_user');
    // Optionally navigate to login or main page
    navigate('/');
    window.location.reload();
  };

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
          {/* --- Sidebar header: match chat header, smaller, blurry, soft --- */}
          <div className="flex items-center justify-between py-4 px-6 border-b border-blue-100 bg-white/60 relative" style={{ minHeight: '48px', height: '48px' }}>
            {/* Blurry overlay like chat */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-18px] left-[-8px] w-20 h-10 bg-blue-100/18 blur-2xl rounded-xl opacity-25" />
              <div className="absolute top-1 right-[-12px] w-16 h-8 bg-purple-100/18 blur-xl rounded-xl opacity-14" />
              <div className="absolute bottom-[-8px] left-4 w-14 h-3 bg-white/18 blur-md rounded-full opacity-12" />
            </div>
            <div className="relative z-10 flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow relative"
                   style={{ backdropFilter: 'blur(4px)' }}>
                <img src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" alt="Makab" className="w-10 h-10 rounded-full relative z-10" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-extrabold bg-gradient-to-r from-blue-300 via-purple-300 to-blue-400 bg-clip-text text-transparent tracking-wide">
                  MAKAB
                </span>
                <span className="text-[11px] font-medium text-blue-500 mt-[0.5px]" style={{ lineHeight: '13px', marginTop: '2px' }}>
                  AI Assistant
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden h-9 w-9 p-0 rounded-lg text-blue-600 hover:bg-blue-50"
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
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

