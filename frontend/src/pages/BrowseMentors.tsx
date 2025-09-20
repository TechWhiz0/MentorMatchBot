import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Filter, Send, Users, MessageCircle, Handshake } from "lucide-react";
import { api } from "@/lib/api";
import { Profile } from "@/lib/api";
import RequestMentorModal from "@/components/MentorshipRequest/RequestMentorModal";
import { useAuth } from "@/lib/auth";

interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
}

const BrowseMentors = () => {
  const navigate = useNavigate();
  const { profile: currentUserProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [currentUserProfileData, setCurrentUserProfileData] =
    useState<Profile | null>(null);

  const isMentor = currentUserProfile?.role === "mentor";

  useEffect(() => {
    fetchMentors();
    fetchCurrentUserProfile();
  }, []);

  const fetchMentors = async () => {
    try {
      const mentorsData = await api.getMentors();

      // Transform the data to match our interface
      const transformedMentors: Mentor[] = mentorsData.map((profile) => ({
        id: profile.id,
        name: profile.name,
        title: "Mentor",
        expertise: profile.industries || [],
        bio: "Experienced mentor ready to help you grow.",
      }));

      // Filter out current user if they are a mentor
      const filteredMentors = isMentor
        ? transformedMentors.filter(
            (mentor) => mentor.id !== currentUserProfile?.id
          )
        : transformedMentors;

      setMentors(filteredMentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUserProfile = async () => {
    try {
      const userData = await api.getCurrentUser();
      if (userData.profile) {
        setCurrentUserProfileData(userData.profile);
      }
    } catch (error) {
      console.error("Error fetching current user profile:", error);
    }
  };

  const handleRequestMentorship = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowRequestModal(true);
  };

  const handleConnectWithMentor = (mentor: Mentor) => {
    // For mentors connecting with other mentors - could open a collaboration modal
    // or navigate to a collaboration page
    navigate(`/profile/${mentor.id}?tab=collaboration`);
  };

  const handleMessageMentor = (mentor: Mentor) => {
    // For mentors messaging other mentors - could open a messaging interface
    navigate(`/chat?recipient=${mentor.id}`);
  };

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesExpertise =
      !selectedExpertise || mentor.expertise.includes(selectedExpertise);

    return matchesSearch && matchesExpertise;
  });

  const allExpertise = [
    ...new Set(mentors.flatMap((mentor) => mentor.expertise)),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gradient">
              {isMentor
                ? "Connect with Fellow Mentors"
                : "Find Your Perfect Mentor"}
            </h1>
            {isMentor && (
              <Button
                variant="outline"
                onClick={() => navigate("/browse-mentees")}
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Browse Mentees
              </Button>
            )}
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            {isMentor
              ? "Build your network, share knowledge, and collaborate with other experienced mentors"
              : "Connect with industry experts who can accelerate your growth"}
          </p>

          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder={
                    isMentor
                      ? "Search mentors by name or expertise..."
                      : "Search by name, title, or expertise..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedExpertise}
                  onChange={(e) => setSelectedExpertise(e.target.value)}
                  className="px-4 py-3 border border-input rounded-md bg-background text-base"
                >
                  <option value="">All Expertise</option>
                  {allExpertise.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedExpertise) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {searchTerm && (
                  <Badge variant="secondary" className="text-sm">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedExpertise && (
                  <Badge variant="secondary" className="text-sm">
                    Expertise: {selectedExpertise}
                    <button
                      onClick={() => setSelectedExpertise("")}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedExpertise("");
                  }}
                  className="text-sm"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              {isMentor ? "Loading fellow mentors..." : "Loading mentors..."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="hover-lift bg-gradient-card">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{mentor.name}</CardTitle>
                      <CardDescription className="text-base">
                        {mentor.title}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{mentor.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {isMentor ? (
                      // Mentor-specific actions
                      <>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleConnectWithMentor(mentor)}
                        >
                          <Handshake className="w-4 h-4 mr-2" />
                          Collaborate
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleMessageMentor(mentor)}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => navigate(`/profile/${mentor.id}`)}
                        >
                          View Profile
                        </Button>
                      </>
                    ) : (
                      // Mentee-specific actions
                      <>
                        {currentUserProfileData?.role === "mentee" && (
                          <Button
                            className="flex-1"
                            onClick={() => handleRequestMentorship(mentor)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Request Mentorship
                          </Button>
                        )}
                        <Button
                          variant={
                            currentUserProfileData?.role === "mentee"
                              ? "outline"
                              : "default"
                          }
                          className={
                            currentUserProfileData?.role === "mentee"
                              ? ""
                              : "flex-1"
                          }
                          onClick={() => navigate(`/profile/${mentor.id}`)}
                        >
                          View Profile
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">
              {isMentor ? "No fellow mentors found" : "No mentors found"}
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}

        {selectedMentor && (
          <RequestMentorModal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            mentorId={selectedMentor.id}
            mentorName={selectedMentor.name}
            onSuccess={fetchMentors}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseMentors;
