
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has already been prompted
    const hasBeenPrompted = localStorage.getItem('pwa_install_prompted');
    const hasInteractedBefore = localStorage.getItem('pwa_install_interacted');
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after user has sent at least 2 messages and hasn't been prompted before
      if (!hasBeenPrompted && !hasInteractedBefore) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 10000); // Show after 10 seconds of activity
      }
    };

    // Track user interaction
    const handleUserInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        localStorage.setItem('pwa_install_interacted', 'true');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    // Show prompt for engaged users (after 3 minutes if they haven't been prompted)
    if (!hasBeenPrompted && !hasInteractedBefore) {
      const engagementTimer = setTimeout(() => {
        setShowPrompt(true);
      }, 180000); // 3 minutes

      return () => {
        clearTimeout(engagementTimer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [hasInteracted]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        localStorage.setItem('pwa_install_prompted', 'true');
      }
      
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
    localStorage.setItem('pwa_install_prompted', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_install_prompted', 'true');
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Don't mark as prompted, allow it to show again later
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center animate-fade-in">
      <Card className="max-w-sm shadow-xl border-0 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">Install Makab App</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                Get instant access with our mobile app! Faster loading, offline support, and native experience.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Install Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLater}
                  className="text-gray-600 dark:text-gray-400"
                >
                  Maybe Later
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-gray-500 dark:text-gray-500 p-1"
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

export default PWAInstallPrompt;
