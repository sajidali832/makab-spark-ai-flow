
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, LogOut, Sparkles, Star, Zap, Brain, Rocket } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-1 sm:p-2">
      <div className="max-w-sm mx-auto space-y-2 sm:space-y-3">
        {/* Header */}
        <div className="text-center space-y-1 py-2 sm:py-3">
          <div className="flex justify-center mb-2 sm:mb-3">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Star className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {userData.name || 'Amazing User'}
          </h2>
          <div className="flex items-center justify-center space-x-1 text-purple-600">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">Makab User</span>
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
        </div>
        
        {/* Main Profile Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            {/* Email Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Email Address</p>
                  <p className="font-bold text-gray-800 truncate text-sm sm:text-base">{userData.email || 'user@makab.ai'}</p>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-lg sm:text-xl font-bold text-blue-600 mb-0.5">∞</div>
                <p className="text-xs text-blue-700 font-medium">Generations</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-lg sm:text-xl font-bold text-purple-600 mb-0.5">9</div>
                <p className="text-xs text-purple-700 font-medium">AI Tools</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-800 text-sm">Full Access</span>
                </div>
                <div className="flex items-center space-x-0.5">
                  <Star className="h-3 w-3 text-green-500 fill-green-500" />
                  <Star className="h-3 w-3 text-green-500 fill-green-500" />
                  <Star className="h-3 w-3 text-green-500 fill-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Model Information */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-center flex items-center justify-center space-x-2 text-sm">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                AI Model Information
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-inner">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
                  <h3 className="font-bold text-blue-700 text-lg">Makab O1</h3>
                  <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
                </div>
                
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-semibold text-blue-600">⚡ Lightning Fast & Completely Free</p>
                  <p>Developed by Makab, led by CEO Sajid, providing cutting-edge AI technology at no cost to empower creators worldwide.</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200 mt-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Rocket className="h-4 w-4 text-purple-600" />
                    <p className="font-bold text-purple-700 text-sm">Coming Soon</p>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-purple-600">Makab O2 Pro</span> - Our fastest, most intelligent, and most powerful model is under development. We're committed to keeping it free for all users!
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 mt-3">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span>Powered by Innovation</span>
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full flex items-center justify-center space-x-2 h-10 sm:h-12 text-sm sm:text-base font-semibold shadow-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300"
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Logout</span>
        </Button>

        {/* Footer */}
        <div className="text-center py-2 sm:py-3">
          <p className="text-xs text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 inline-block shadow-lg">
            Made with ❤️ by Sajid
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
