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
import { Filter, Send, UserCheck, MessageCircle, Eye } from "lucide-react";
import { api } from "@/lib/api";
import { Profile } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Mentee {
  id: string;
  name: string;
  title: string;
  interests: string[];
  bio: string;
}

const BrowseMentees = () => {
  const navigate = useNavigate();
  const { profile: currentUserProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);

  const isMentor = currentUserProfile?.role === "mentor";

  useEffect(() => {
    if (!isMentor) {
      navigate("/browse");
      return;
    }
    fetchMentees();
  }, [isMentor, navigate]);

  const fetchMentees = async () => {
    try {
      const menteesData = await api.getMentees();

      // Transform the data to match our interface
      const transformedMentees: Mentee[] = menteesData.map((profile) => ({
        id: profile.id,
        name: profile.name,
        title: "Mentee",
        interests: profile.industries || [],
        bio: "Looking for guidance and mentorship to grow professionally.",
      }));

      setMentees(transformedMentees);
    } catch (error) {
      console.error("Error fetching mentees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (mentee: Mentee) => {
    navigate(`/profile/${mentee.id}`);
  };

  const handleMessageMentee = (mentee: Mentee) => {
    // For mentors messaging mentees - could open a messaging interface
    navigate(`/chat?recipient=${mentee.id}`);
  };

  const filteredMentees = mentees.filter((mentee) => {
    const matchesSearch =
      mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentee.interests.some((interest) =>
        interest.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesInterest =
      !selectedInterest || mentee.interests.includes(selectedInterest);

    return matchesSearch && matchesInterest;
  });

  const allInterests = [
    ...new Set(mentees.flatMap((mentee) => mentee.interests)),
  ];

  if (!isMentor) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gradient">
              Find Potential Mentees
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate("/browse")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Browse Mentors
            </Button>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Discover mentees who are looking for guidance and mentorship in your
            areas of expertise
          </p>

          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search mentees by name or interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedInterest}
                  onChange={(e) => setSelectedInterest(e.target.value)}
                  className="px-4 py-3 border border-input rounded-md bg-background text-base"
                >
                  <option value="">All Interests</option>
                  {allInterests.map((interest) => (
                    <option key={interest} value={interest}>
                      {interest}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedInterest) && (
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
                {selectedInterest && (
                  <Badge variant="secondary" className="text-sm">
                    Interest: {selectedInterest}
                    <button
                      onClick={() => setSelectedInterest("")}
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
                    setSelectedInterest("");
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
            <p className="mt-4 text-muted-foreground">Loading mentees...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMentees.map((mentee) => (
              <Card key={mentee.id} className="hover-lift bg-gradient-card">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {mentee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{mentee.name}</CardTitle>
                      <CardDescription className="text-base">
                        {mentee.title}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{mentee.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentee.interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="bg-secondary/10 text-secondary-foreground"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewProfile(mentee)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleMessageMentee(mentee)}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredMentees.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No mentees found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseMentees;
