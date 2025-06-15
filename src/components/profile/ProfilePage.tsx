
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Edit3, Save, X, Bell, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [editData, setEditData] = useState({
    username: '',
    email: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const checkAuthAndFetchData = async () => {
      try {
        setAuthError(null);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setAuthError("Something went wrong loading your session. Please try logging in again.");
          return;
        }
        if (!session || !session.user) {
          setAuthError("You are not logged in. Please log in to view your profile.");
          return;
        }
        const currentUser = session.user;
        setUser(currentUser);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          if (profileError.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{ user_id: currentUser.id, username: 'User' }])
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
            } else {
              setProfile(newProfile);
              setEditData({
                username: newProfile?.username || '',
                email: currentUser.email || ''
              });
            }
          }
        } else {
          setProfile(profileData);
          setEditData({
            username: profileData?.username || '',
            email: currentUser.email || ''
          });
        }
      } catch (error) {
        console.error('Error in checkAuthAndFetchData:', error);
        setAuthError("Failed to load your profile. Try again.");
      } finally {
        setIsInitialLoading(false);
      }
    };

    timeout = setTimeout(() => {
      if (isInitialLoading) {
        setAuthError("Loading is taking longer than usual. Please try refreshing or logging in again.");
        setIsInitialLoading(false);
      }
    }, 10000);

    checkAuthAndFetchData();

    return () => clearTimeout(timeout);
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      username: profile?.username || '',
      email: user?.email || ''
    });
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      if (profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username: editData.username })
          .eq('user_id', user.id);

        if (profileError) {
          throw profileError;
        }
      }

      if (editData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: editData.email
        });

        if (emailError) {
          throw emailError;
        }
      }

      setIsInitialLoading(true);
      setAuthError(null);
      const event = new Event('reloadProfile');
      window.dispatchEvent(event);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        localStorage.removeItem('makab_user');
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-gray-600 mb-4">{authError}</p>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-600 to-purple-600">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-6">
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-600 to-purple-600">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Mobile-first responsive container */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <img 
                src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" 
                alt="Makab" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/20" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg">
              <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            Manage your Makab AI account settings and preferences
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          
          {/* Profile Information Card */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 lg:col-span-2">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Profile Information
                  </span>
                </div>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>Username</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      value={editData.username}
                      onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      placeholder="Enter your username"
                    />
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <span className="text-gray-800 font-medium">
                        {profile?.username || 'No username set'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Email</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <span className="text-gray-800 font-medium">
                        {user.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center space-x-3 text-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Quick Actions
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start text-left border-green-200 hover:bg-green-50 hover:border-green-300"
              >
                <Bell className="h-4 w-4 mr-3 text-green-600" />
                <div>
                  <div className="font-medium text-green-700">Notifications</div>
                  <div className="text-xs text-green-600">Manage your alerts</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start text-left border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              >
                <User className="h-4 w-4 mr-3 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-700">Privacy Settings</div>
                  <div className="text-xs text-blue-600">Control your data</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions Card */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center space-x-3 text-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-white" />
                </div>
                <span className="text-red-600">Account Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <img 
                  src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" 
                  alt="Makab" 
                  className="w-8 h-8 rounded-lg" 
                />
              </div>
              <p className="text-sm text-gray-500 mb-2">Made with ❤️ by</p>
              <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sajid
              </p>
            </div>
            <div className="text-xs text-gray-400">
              © 2024 Makab AI. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
