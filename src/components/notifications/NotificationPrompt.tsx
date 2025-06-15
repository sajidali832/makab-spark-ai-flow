import { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { isSupported, isSubscribed, subscribe, permission, requestPermission } = usePushNotifications();
  const testNotificationTimer = useRef<NodeJS.Timeout | null>(null);

  /** Enhancement: Show prompt as soon as user logs in (not just after user interactions) **/
  useEffect(() => {
    // Run ASAP on mount for logged in users.
    const hasBeenPrompted = localStorage.getItem('notification_prompted');
    if (!hasBeenPrompted && !isSubscribed && isSupported && permission !== 'denied') {
      // Show after a short delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1200); // 1.2s delay for good UX
      return () => clearTimeout(timer);
    }
  }, [isSubscribed, isSupported, permission]);

  // Track interactions, but now prompt immediately anyway (above).
  useEffect(() => {
    const trackInteraction = () => {
      const current = parseInt(localStorage.getItem('user_interactions') || '0');
      localStorage.setItem('user_interactions', (current + 1).toString());
    };
    document.addEventListener('click', trackInteraction);
    document.addEventListener('keydown', trackInteraction);
    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('keydown', trackInteraction);
    };
  }, []);

  // Schedule up to 2 notifications every 30 seconds after subscribing (for testing)
  const handleSubscribe = async () => {
    const granted = await requestPermission();
    if (granted) {
      const success = await subscribe();
      if (success) {
        setShowPrompt(false);
        localStorage.setItem('notification_prompted', 'true');
        // ---- TEST NOTIFICATION: Every 30 seconds, up to 2 times ----
        localStorage.setItem('notification_test_count', '0');
        let count = 0;
        const sendTestNotification = () => {
          if (count < 2) {
            sendLocalNotification(
              'Makab AI',
              `Test notification #${count + 1}! You will now receive daily AI tips. 🚀`
            );
            count++;
            localStorage.setItem('notification_test_count', count.toString());
            if (count < 2) {
              testNotificationTimer.current = setTimeout(sendTestNotification, 30000); // 30 sec
            }
          }
        };
        sendTestNotification();
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
    // Will re-show in future.
  };

  // Helper to send a browser notification using the permission the user just gave
  const sendLocalNotification = (title: string, body: string) => {
    if (window.Notification && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
        badge: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
      });
    }
  };

  // Reset test count if user disables and re-enables
  useEffect(() => {
    if (!isSubscribed) {
      localStorage.setItem('notification_test_count', '0');
      if (testNotificationTimer.current) clearTimeout(testNotificationTimer.current);
    }
  }, [isSubscribed]);

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
