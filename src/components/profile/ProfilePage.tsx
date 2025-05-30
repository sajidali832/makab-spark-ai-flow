
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, LogOut, Crown, Sparkles, Star, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2 sm:p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2 py-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Star className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {userData.name || 'Amazing User'}
          </h2>
          <div className="flex items-center justify-center space-x-1 text-purple-600">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Makab Pro User</span>
            <Zap className="h-4 w-4" />
          </div>
        </div>
        
        {/* Main Profile Card */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Email Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Email Address</p>
                  <p className="font-bold text-gray-800 truncate">{userData.email || 'user@makab.ai'}</p>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">∞</div>
                <p className="text-xs text-blue-700 font-medium">Generations</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-1">7</div>
                <p className="text-xs text-purple-700 font-medium">AI Tools</p>
              </div>
            </div>

            {/* Premium Features */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Premium Access</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full flex items-center justify-center space-x-2 h-12 text-base font-semibold shadow-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 inline-block shadow-lg">
            Made with ❤️ by Sajid
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
