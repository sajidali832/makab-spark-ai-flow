
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, LogOut, Crown, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { toast } = useToast();
  
  // Get user data from localStorage (replace with Supabase)
  const userData = JSON.parse(localStorage.getItem('makab_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('makab_user');
    toast({
      title: "Logged out ✅",
      description: "You have been successfully logged out.",
    });
    window.location.reload();
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Profile 👤
        </h2>
      </div>
      
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
            {userData.name || 'Amazing User'}
          </CardTitle>
          <p className="text-sm sm:text-base text-gray-600 flex items-center justify-center space-x-1">
            <Sparkles className="h-4 w-4" />
            <span>Makab Pro User</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-semibold text-gray-800">{userData.email || 'user@makab.ai'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">∞</p>
                <p className="text-xs text-gray-600">Generations</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">7</p>
                <p className="text-xs text-gray-600">Tools Available</p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full flex items-center space-x-2 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-xs text-gray-500 bg-gray-100 rounded-full px-4 py-2 inline-block">
          Made with ❤️ by Sajid
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
