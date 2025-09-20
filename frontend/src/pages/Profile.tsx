import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, User, Users, UserCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Profile } from "@/lib/api";
import ProfileView from "@/components/Profile/ProfileView";

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = await api.getCurrentUser();
      if (userData.profile) {
        setProfile(userData.profile);
      } else {
        // Redirect to signup if no profile exists
        navigate('/signup');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
            <p className="text-muted-foreground mb-4">
              Please complete your profile setup.
            </p>
            <Button onClick={() => navigate('/signup')}>
              Complete Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your profile and preferences
              </p>
            </div>
            <Button onClick={handleEditProfile}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile View */}
        <ProfileView 
          profile={profile} 
          showRequestButton={false}
        />

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your mentorship activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => navigate(getDashboardLink())}
                >
                  {getDashboardIcon()}
                  <span>{getDashboardText()}</span>
                </Button>
                
                {profile.role === 'mentee' && (
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/browse')}
                  >
                    <Users className="h-5 w-5 mb-1" />
                    <span>Browse Mentors</span>
                  </Button>
                )}
                
                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  function getDashboardLink() {
    return profile?.role === 'mentor' ? '/mentor-dashboard' : '/mentee-dashboard';
  }

  function getDashboardIcon() {
    return profile?.role === 'mentor' ? <Users className="h-5 w-5 mb-1" /> : <UserCheck className="h-5 w-5 mb-1" />;
  }

  function getDashboardText() {
    return profile?.role === 'mentor' ? 'Mentor Dashboard' : 'Mentee Dashboard';
  }
};

export default ProfilePage;
