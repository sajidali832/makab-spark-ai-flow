
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface ChatHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const ChatHeader = ({ onMenuClick, isSidebarOpen }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white lg:hidden">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <img src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" alt="Makab" className="w-6 h-6 rounded-full" />
          </div>
          <span className="text-lg font-bold text-blue-600">MAKAB</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
