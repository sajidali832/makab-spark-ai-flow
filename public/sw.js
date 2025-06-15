
// Makab AI Push Notification Service Worker
const CACHE_NAME = 'makab-notifications-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'Makab AI',
        body: event.data.text() || 'New notification from Makab AI',
        icon: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
        badge: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png'
      };
    }
  }

  const notificationOptions = {
    title: notificationData.title || 'Makab AI',
    body: notificationData.body || 'Your AI assistant has something for you!',
    icon: notificationData.icon || '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
    badge: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
    tag: 'makab-notification',
    requireInteraction: false,
    silent: false,
    data: {
      url: notificationData.url || '/',
      timestamp: Date.now(),
      ...notificationData.data
    },
    actions: [
      {
        action: 'open',
        title: 'Open Makab AI',
        icon: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationOptions.title, notificationOptions)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );

  // Track notification click (send to backend)
  if (event.notification.data?.notificationId) {
    fetch('/api/notifications/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notificationId: event.notification.data.notificationId,
        clickedAt: new Date().toISOString()
      })
    }).catch(console.error);
  }
});

// Background sync for offline notification clicks
self.addEventListener('sync', (event) => {
  if (event.tag === 'notification-click') {
    event.waitUntil(
      // Handle offline notification clicks when connection is restored
      console.log('Background sync: notification-click')
    );
  }
});
