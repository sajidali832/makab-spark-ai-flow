import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Edit3, Save, X } from 'lucide-react';
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
        // Wait for supabase to restore session.
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

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Create profile if it doesn't exist
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

    // Show error if supabase is taking too long
    timeout = setTimeout(() => {
      if (isInitialLoading) {
        setAuthError("Loading is taking longer than usual. Please try refreshing or logging in again.");
        setIsInitialLoading(false);
      }
    }, 10000); // 10 seconds

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
      // Update profile
      if (profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username: editData.username })
          .eq('user_id', user.id);

        if (profileError) {
          throw profileError;
        }
      }

      // Update email if changed
      if (editData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: editData.email
        });

        if (emailError) {
          throw emailError;
        }
      }

      // Refetch data after save
      setIsInitialLoading(true);
      setAuthError(null);
      // Call the effect again to reload data
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <p className="text-gray-600 mb-4">{authError}</p>
          <Button onClick={() => navigate('/')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    // Defensive user check (shouldn't happen with above logic)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <Button onClick={() => navigate('/')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" alt="Makab" className="w-20 h-20 rounded-full" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your Makab AI account settings</p>
        </div>

        {/* Profile Information */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Profile Information</span>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="ml-auto text-blue-600 hover:text-blue-700"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <Input
                  id="username"
                  value={editData.username}
                  onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                  className="border-gray-300 focus:border-blue-500"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  {profile?.username || 'No username set'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  className="border-gray-300 focus:border-blue-500"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border">
                  {user.email}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-red-600">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center pt-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 mb-2">Made with ❤️ by</p>
            <p className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sajid
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
