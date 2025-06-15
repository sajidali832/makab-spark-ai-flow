
import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { isSupported, isSubscribed, subscribe, permission } = usePushNotifications();

  useEffect(() => {
    // Check if user has already been prompted or subscribed
    const hasBeenPrompted = localStorage.getItem('notification_prompted');
    const userInteractions = parseInt(localStorage.getItem('user_interactions') || '0');
    
    // Show prompt after user has made 3 interactions and hasn't been prompted
    if (!hasBeenPrompted && !isSubscribed && userInteractions >= 3 && isSupported && permission !== 'denied') {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000); // Show after 2 seconds of activity
      
      return () => clearTimeout(timer);
    }
  }, [isSubscribed, isSupported, permission]);

  // Track user interactions
  useEffect(() => {
    const trackInteraction = () => {
      const current = parseInt(localStorage.getItem('user_interactions') || '0');
      localStorage.setItem('user_interactions', (current + 1).toString());
    };

    // Add event listeners for user interactions
    document.addEventListener('click', trackInteraction);
    document.addEventListener('keydown', trackInteraction);
    
    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('keydown', trackInteraction);
    };
  }, []);

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setShowPrompt(false);
      localStorage.setItem('notification_prompted', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('notification_prompted', 'true');
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Don't mark as prompted so it can show again later
  };

  if (!showPrompt || dismissed || isSubscribed || !isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center animate-fade-in">
      <Card className="max-w-sm shadow-xl border-0 bg-white">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Stay Inspired Daily! 🚀</h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Get 2 daily notifications with free AI tips, creative inspiration, and new feature updates from Makab AI.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Enable Free Notifications
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLater}
                  className="text-gray-600"
                >
                  Maybe Later
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-gray-500 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPrompt;
