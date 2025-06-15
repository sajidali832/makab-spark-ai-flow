
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    // Check if push notifications are supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          checkSubscriptionStatus(registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const checkSubscriptionStatus = async (registration: ServiceWorkerRegistration) => {
    try {
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || permission !== 'granted') {
      return false;
    }

    setIsLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID public key (you'll need to generate this)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI2PacGgOgjJqkUCzpjOj7Fs9fZ-1VZAU47zZTI3bJ5HBAmwDJM6X8jHXU';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Store subscription in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      const subscriptionData = subscription.toJSON() as PushSubscription;
      
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: subscriptionData.endpoint,
          p256dh_key: subscriptionData.keys.p256dh,
          auth_key: subscriptionData.keys.auth,
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error storing subscription:', error);
        return false;
      }

      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error('Error subscribing:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Remove subscription from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('push_subscriptions')
          .update({ is_active: false })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing subscription:', error);
        }
      }

      setIsSubscribed(false);
      toast({
        title: "Unsubscribed",
        description: "You will no longer receive push notifications.",
      });
      
      return true;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast({
        title: "Error",
        description: "Failed to unsubscribe from notifications.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    requestPermission
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
