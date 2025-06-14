
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
      <div className="relative w-80 h-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content Container */}
        <div className="p-5 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-5 h-5 rounded-lg" />
            </div>
            
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              MAKAB AI Enhanced! ✨
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Amazing improvements for better AI experience!
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">Messages</span>
              </div>
              <div className="text-xs">
                <span className="line-through text-red-500">6</span> → <span className="text-green-600 font-bold">10!</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <Wrench className="h-3 w-3 text-purple-500" />
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">Tools</span>
              </div>
              <div className="text-xs">
                <span className="line-through text-red-500">3</span> → <span className="text-green-600 font-bold">6!</span>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-3 w-3 text-green-500" />
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">Enhanced Intelligence</span>
              </div>
            </div>
          </div>

          {/* Team message */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              💝 Our team is working hard day and night to provide you quality AI experience for free
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-medium">
              — CEO Sajid
            </p>
          </div>

          {/* Get Started button */}
          <Button
            onClick={handleGetStarted}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm py-2"
          >
            Get Started! 🚀
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
