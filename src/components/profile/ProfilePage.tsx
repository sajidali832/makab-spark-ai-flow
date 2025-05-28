
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { toast } = useToast();
  
  // Get user data from localStorage (replace with Supabase)
  const userData = JSON.parse(localStorage.getItem('makab_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('makab_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{userData.name || 'User'}</p>
              <p className="text-sm text-gray-600">Makab User</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{userData.email || 'user@example.com'}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
