import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";
import { Profile } from "@/lib/api";

interface ProfileViewProps {
  profile: Profile;
  onRequestMentorship?: () => void;
  showRequestButton?: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onRequestMentorship,
  showRequestButton = false,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gradient-card">
        <CardHeader>
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{profile.name}</CardTitle>
              <CardDescription className="text-xl mb-4">
                {profile.role === "mentor" ? "Professional Mentor" : "Mentee"}
              </CardDescription>
            </div>

            {showRequestButton && profile.role === "mentor" && (
              <Button
                size="lg"
                onClick={onRequestMentorship}
                className="bg-primary hover:bg-primary/90"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Request Mentorship
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* About Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {profile.about ||
                (profile.role === "mentor"
                  ? `Experienced ${profile.industries?.join(
                      ", "
                    )} professional with a passion for helping others grow and succeed. I believe in sharing knowledge and providing guidance to help mentees achieve their goals.`
                  : `Passionate learner seeking guidance and mentorship to accelerate my growth in ${profile.industries?.join(
                      ", "
                    )}. I'm committed to learning and applying new skills to achieve my career objectives.`)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileView;
