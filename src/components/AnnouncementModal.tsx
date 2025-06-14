
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Sparkles, MessageSquare, Wrench } from 'lucide-react';

const AnnouncementModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen this announcement
    const hasSeenAnnouncement = localStorage.getItem('makab_announcement_v1');
    if (!hasSeenAnnouncement) {
      // Show modal after a short delay for better UX
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem('makab_announcement_v1', 'true');
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem('makab_announcement_v1', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xs bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <X className="h-3 w-3" />
        </button>

        {/* Header */}
        <div className="text-center p-4 pb-2">
          <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-6 h-6 rounded-md" />
          </div>
          
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            MAKAB AI Enhanced! ✨
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
            Amazing improvements for better AI experience!
          </p>
        </div>

        {/* Compact Features */}
        <div className="px-4 space-y-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">Chat Messages</span>
              </div>
              <div className="text-xs">
                <span className="line-through text-red-500">6</span> → <span className="text-green-600 font-bold">10 per day!</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wrench className="h-3 w-3 text-purple-500" />
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">AI Tools</span>
              </div>
              <div className="text-xs">
                <span className="line-through text-red-500">3</span> → <span className="text-green-600 font-bold">6 per day!</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-green-200 dark:border-green-700">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-3 w-3 text-green-500" />
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">Enhanced Intelligence</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Smarter responses & better understanding</p>
          </div>
        </div>

        {/* Team message */}
        <div className="px-4 py-2">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              💝 Our team is working hard day and night to provide you quality AI experience for free
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-medium">
              — CEO Sajid
            </p>
          </div>
        </div>

        {/* Get Started button */}
        <div className="p-4 pt-2">
          <Button
            onClick={handleGetStarted}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
          >
            Get Started! 🚀
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
