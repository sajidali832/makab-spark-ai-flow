
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Clock, MessageSquare, Wrench } from 'lucide-react';

interface LimitExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'chat' | 'tools';
}

const LimitExceededModal = ({ isOpen, onClose, type }: LimitExceededModalProps) => {
  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
            {type === 'chat' ? (
              <MessageSquare className="h-8 w-8 text-white" />
            ) : (
              <Wrench className="h-8 w-8 text-white" />
            )}
          </div>
          
          <AlertDialogTitle className="text-xl font-bold text-gray-800">
            Daily Limit Reached! 🚫
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-center space-y-3">
            <p className="text-gray-600">
              You've used all your {type === 'chat' ? 'chat messages (6)' : 'tool generations (3)'} for today.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Reset in: {getTimeUntilMidnight()}</span>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                Your limits will reset at midnight (12:00 AM)
              </p>
            </div>
            
            <p className="text-sm text-gray-500">
              Come back tomorrow to continue using Makab! ✨
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex justify-center mt-6">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
          >
            Got it!
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LimitExceededModal;
