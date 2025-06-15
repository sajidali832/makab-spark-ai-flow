
import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const NotificationSettings = () => {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe
  } = usePushNotifications();

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BellOff className="h-5 w-5 text-gray-500" />
            <span>Push Notifications</span>
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in this browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className={`h-5 w-5 ${isSubscribed ? 'text-green-500' : 'text-gray-500'}`} />
          <span>Daily AI Notifications</span>
        </CardTitle>
        <CardDescription>
          Get 2 daily notifications with free AI tips, creative inspiration, and tool updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Status: {isSubscribed ? 'Active' : 'Inactive'}
            </p>
            <p className="text-xs text-gray-600">
              {isSubscribed 
                ? '🌅 Morning (9 AM) & 🌙 Evening (7 PM) notifications enabled'
                : 'Enable to receive daily creative inspiration'
              }
            </p>
          </div>
          <Button
            onClick={handleToggleNotifications}
            disabled={isLoading}
            variant={isSubscribed ? "outline" : "default"}
            className={isSubscribed 
              ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200" 
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            }
          >
            {isLoading ? 'Loading...' : isSubscribed ? 'Disable' : 'Enable'}
          </Button>
        </div>
        
        {permission === 'denied' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Notifications are blocked. Please enable them in your browser settings to receive updates.
            </p>
          </div>
        )}
        
        {isSubscribed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" alt="Makab" className="w-6 h-6 rounded-full" />
              <span className="text-sm font-medium text-green-800">Notifications Active!</span>
            </div>
            <p className="text-xs text-green-700">
              You'll receive inspiring messages and updates about new free AI tools.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
