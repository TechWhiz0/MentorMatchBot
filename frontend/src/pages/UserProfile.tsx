import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Users, UserCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Profile } from "@/lib/api";
import ProfileView from "@/components/Profile/ProfileView";
import RequestMentorModal from "@/components/MentorshipRequest/RequestMentorModal";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProfile(id);
      fetchCurrentUserProfile();
    }
  }, [id]);

  const fetchProfile = async (profileId: string) => {
    try {
      const profileData = await api.getProfileById(profileId);
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      navigate("/browse");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUserProfile = async () => {
    try {
      const currentProfile = await api.getProfile();
      setCurrentUserProfile(currentProfile);
    } catch (error) {
      console.error("Error fetching current user profile:", error);
    }
  };

  const handleRequestMentorship = () => {
    setShowRequestModal(true);
  };

  // Check if current user is viewing their own profile
  const isOwnProfile = currentUserProfile?.id === profile?.id;

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
              The profile you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/browse")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
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
          <Button
            variant="ghost"
            onClick={() => navigate("/browse")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-muted-foreground">
                {profile.role === "mentor" ? "Professional Mentor" : "Mentee"}
              </p>
            </div>
            {profile.role === "mentor" &&
              currentUserProfile?.role === "mentee" && (
                <Button
                  size="lg"
                  onClick={handleRequestMentorship}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Request Mentorship
                </Button>
              )}
          </div>
        </div>

        {/* Profile View */}
        <ProfileView profile={profile} showRequestButton={false} />

        {/* Request Modal */}
        {showRequestModal && (
          <RequestMentorModal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            mentorId={profile.id}
            mentorName={profile.name}
            onSuccess={() => {
              setShowRequestModal(false);
              navigate("/mentee-dashboard");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
