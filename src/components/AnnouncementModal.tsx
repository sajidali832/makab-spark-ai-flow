
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-scale-in">
        {/* Close button in corner */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with logo and title */}
        <div className="text-center p-6 pb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-10 h-10 rounded-xl" />
          </div>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            MAKAB AI Enhanced! ✨
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            We've made amazing improvements to provide you with a better AI experience!
          </p>
        </div>

        {/* Features grid */}
        <div className="px-6 space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Chat Messages</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="line-through text-red-500">6 messages</span> → <span className="text-green-600 font-bold">10 messages per day!</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">AI Tools</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="line-through text-red-500">3 generations</span> → <span className="text-green-600 font-bold">6 generations per day!</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Enhanced Intelligence</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Smarter responses & better understanding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team message */}
        <div className="px-6 py-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              💝 Our team is working hard day and night to provide you quality AI experience for free
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 font-medium">
              — CEO Sajid
            </p>
          </div>
        </div>

        {/* Get Started button */}
        <div className="p-6 pt-2">
          <Button
            onClick={handleGetStarted}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started! 🚀
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
