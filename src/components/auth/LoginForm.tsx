import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface LoginFormProps {
  onAuthSuccess: () => void;
}

const LoginForm = ({ onAuthSuccess }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const { toast } = useToast();
  const { requestPermission, subscribe } = usePushNotifications();

  const requestNotificationPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      await subscribe();
    }
  };

  const sendWelcomeNotification = (username: string) => {
    if (window.Notification && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification('Welcome to Makab AI! 🎉', {
          body: `Hi ${username}! Your account has been successfully registered. Welcome to your AI journey!`,
          icon: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
          badge: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
        });
      }, 30000); // 30 seconds delay
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        localStorage.setItem('makab_user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: formData.username || 'User'
        }));
        
        toast({
          title: "Welcome back! 🎉",
          description: "Successfully logged in to Makab AI",
        });

        setTimeout(() => {
          requestNotificationPermission();
        }, 1000);

        onAuthSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username
          }
        }
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        localStorage.setItem('makab_user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: formData.username
        }));
        
        toast({
          title: "Welcome to Makab! 🚀",
          description: "Your account has been created successfully",
        });

        // Request notification permission and send welcome notification
        setTimeout(async () => {
          const granted = await requestPermission();
          if (granted) {
            await subscribe();
            sendWelcomeNotification(formData.username);
          }
        }, 1000);

        onAuthSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Make logo smaller and card more compact / lifted up */}
      {/* Background blur effects */}
      <div className="absolute inset-0 bg-black/20"></div>
      {/* Shrink blur backgrounds for less visual clutter */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-[12%] right-1/4 w-60 h-60 bg-purple-500/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl"></div>
      
      <div className="w-full max-w-sm relative z-10 mt-[-48px]">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg relative">
            <img src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" alt="Makab" className="w-12 h-12 rounded-full relative z-10" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 drop-shadow-lg">
            MAKAB AI
          </h1>
          <p className="text-blue-200 text-xs drop-shadow-lg">Your intelligent AI companion</p>
        </div>

        {/* Card is smaller/tighter with padding reduction, tabs/buttons visible */}
        <div className="w-full">
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl backdrop-saturate-150 px-1">
            <CardHeader className="px-2 py-2">
              <CardTitle className="text-center flex items-center justify-center space-x-2 text-white text-base">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>Get Started</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4 px-2">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/20 border border-white/20">
                  <TabsTrigger value="login" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-3 pt-3">
                  <form onSubmit={handleLogin} className="space-y-3">
                    {/* Email */}
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-blue-200 text-xs">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2 h-4 w-4 text-blue-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm py-2 text-sm"
                          required
                        />
                      </div>
                    </div>
                    {/* Password */}
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-blue-200 text-xs">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2 h-4 w-4 text-blue-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10 bg-black/20 border-white/20 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm py-2 text-sm"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-2 py-2 hover:bg-transparent text-blue-400 hover:text-blue-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    {/* Login Button */}
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg border border-white/20 py-2 text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-3 pt-3">
                  <form onSubmit={handleSignup} className="space-y-3">
                    {/* Username */}
                    <div className="space-y-1">
                      <Label htmlFor="signup-username" className="text-blue-200 text-xs">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2 h-4 w-4 text-blue-400" />
                        <Input
                          id="signup-username"
                          name="username"
                          type="text"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm py-2 text-sm"
                          required
                        />
                      </div>
                    </div>
                    {/* Email */}
                    <div className="space-y-1">
                      <Label htmlFor="signup-email" className="text-blue-200 text-xs">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2 h-4 w-4 text-blue-400" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm py-2 text-sm"
                          required
                        />
                      </div>
                    </div>
                    {/* Password */}
                    <div className="space-y-1">
                      <Label htmlFor="signup-password" className="text-blue-200 text-xs">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2 h-4 w-4 text-blue-400" />
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10 bg-black/20 border-white/20 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm py-2 text-sm"
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-2 py-2 hover:bg-transparent text-blue-400 hover:text-blue-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    {/* Signup button */}
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg border border-white/20 py-2 text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
