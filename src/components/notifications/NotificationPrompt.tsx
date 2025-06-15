
import { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { isSupported, isSubscribed, subscribe, permission, requestPermission } = usePushNotifications();

  // Show prompt immediately for logged in users
  useEffect(() => {
    const hasBeenPrompted = localStorage.getItem('notification_prompted');
    const user = localStorage.getItem('makab_user');
    
    if (user && !hasBeenPrompted && !isSubscribed && isSupported && permission !== 'denied') {
      // Show after a very short delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000); // 2 seconds after login
      return () => clearTimeout(timer);
    }
  }, [isSubscribed, isSupported, permission]);

  const handleSubscribe = async () => {
    console.log('Requesting notification permission...');
    const granted = await requestPermission();
    console.log('Permission granted:', granted);
    
    if (granted) {
      const success = await subscribe();
      console.log('Subscription success:', success);
      
      if (success) {
        setShowPrompt(false);
        localStorage.setItem('notification_prompted', 'true');
        
        // Send immediate test notification
        setTimeout(() => {
          if (window.Notification && Notification.permission === 'granted') {
            new Notification('Makab AI - Welcome! 🎉', {
              body: 'Notifications are now enabled! You\'ll receive daily AI tips and updates.',
              icon: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
              badge: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
            });
          }
        }, 1000);

        // Send another test notification after 10 seconds
        setTimeout(() => {
          if (window.Notification && Notification.permission === 'granted') {
            new Notification('Makab AI - Test Success! ✅', {
              body: 'Perfect! Your notifications are working. Expect daily tips at 9 AM and 7 PM.',
              icon: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
              badge: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
            });
          }
        }, 10000);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('notification_prompted', 'true');
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Don't mark as prompted so it shows again later
  };

  if (!showPrompt || dismissed || isSubscribed || !isSupported) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center animate-fade-in">
      <Card className="max-w-sm shadow-xl border-0 bg-white">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Get Daily AI Tips! 🚀</h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Enable notifications to receive 2 daily tips with AI insights, creative ideas, and feature updates.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Enable Notifications
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLater}
                  className="text-gray-600"
                >
                  Later
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
