
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 p-4 relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl border-4 border-white/20 backdrop-blur-sm">
            <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-16 h-16 rounded-2xl" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            MAKAB AI
          </h1>
          <p className="text-red-200 drop-shadow-lg">Your intelligent AI companion</p>
        </div>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl backdrop-saturate-150">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center space-x-2 text-white">
              <Sparkles className="h-5 w-5 text-red-400" />
              <span>Get Started</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/20 border border-white/20">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-red-600 data-[state=active]:text-white">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-red-600 data-[state=active]:text-white">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-red-200">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-red-300 focus:border-red-400 focus:ring-red-400 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-red-200">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 bg-black/20 border-white/20 text-white placeholder:text-red-300 focus:border-red-400 focus:ring-red-400 backdrop-blur-sm"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-red-400 hover:text-red-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg border border-white/20"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-red-200">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                      <Input
                        id="signup-username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-red-300 focus:border-red-400 focus:ring-red-400 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-red-200">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-red-300 focus:border-red-400 focus:ring-red-400 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-red-200">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 bg-black/20 border-white/20 text-white placeholder:text-red-300 focus:border-red-400 focus:ring-red-400 backdrop-blur-sm"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-red-400 hover:text-red-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg border border-white/20"
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
  );
};

export default LoginForm;
