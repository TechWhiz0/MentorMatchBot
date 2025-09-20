import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MessageSquare,
  Search,
  Star,
  Clock,
  Users,
  Video,
  ExternalLink,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Profile } from "@/lib/api";

interface MentorshipRequest {
  id: string;
  proposal: string;
  purpose: string | null;
  status: string;
  created_at: string;
  mentor: {
    id: string;
    name: string;
    expertise: string[];
  };
  session?: {
    meeting_link: string | null;
    meeting_platform: string | null;
    scheduled_time: string | null;
  };
}

const MenteeDashboard = () => {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    fetchCurrentUserProfile();
  }, []);

  const fetchRequests = async () => {
    try {
      const [requests, sessions] = await Promise.all([
        api.getMentorshipRequests(),
        api.getSessions(),
      ]);

      // Create a map of request ID to session
      const sessionMap = new Map();
      sessions.forEach((session) => {
        const requestId =
          typeof session.request_id === "object"
            ? session.request_id.id
            : session.request_id;
        sessionMap.set(requestId, session);
      });

      // Transform the data to match our interface
      const transformedRequests: MentorshipRequest[] = requests.map(
        (request) => ({
          id: request.id,
          proposal: request.proposal,
          purpose: null, // Not available in new API
          status: request.status,
          created_at: request.created_at,
          mentor: {
            id:
              typeof request.mentor_id === "object"
                ? request.mentor_id.id
                : request.mentor_id,
            name:
              typeof request.mentor_id === "object"
                ? request.mentor_id.name
                : "Unknown",
            expertise:
              typeof request.mentor_id === "object"
                ? request.mentor_id.industries
                : [],
          },
          session: sessionMap.get(request.id)
            ? {
                meeting_link: sessionMap.get(request.id).meeting_link,
                meeting_platform: "Meeting Platform", // Generic for now
                scheduled_time: sessionMap.get(request.id).scheduled_time,
              }
            : undefined,
        })
      );

      setRequests(transformedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUserProfile = async () => {
    try {
      const userData = await api.getCurrentUser();
      if (userData.profile) {
        setCurrentUserProfile(userData.profile);
      }
    } catch (error) {
      console.error("Error fetching current user profile:", error);
    }
  };

  const handleMentorClick = (mentorId: string) => {
    navigate(`/profile/${mentorId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200";
      case "declined":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if current user is a mentor
  const isMentor = currentUserProfile?.role === "mentor";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
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
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {currentUserProfile?.name || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey with expert mentors
          </p>
        </div>

        {/* Quick Actions - Only show for mentees */}
        {!isMentor && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link to="/browse">
              <Card className="hover-lift cursor-pointer bg-gradient-card">
                <CardContent className="p-6 text-center">
                  <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Find Mentors</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse and connect with expert mentors
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover-lift cursor-pointer bg-gradient-card">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Session Statistics</h3>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {requests.filter((r) => r.status === "accepted").length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Accepted
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">
                      {requests.filter((r) => r.status === "pending").length}
                    </div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {requests.filter((r) => r.status === "declined").length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rejected
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mentorship Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              My Mentorship Requests
            </CardTitle>
            <CardDescription>
              Track your mentorship requests and sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by browsing mentors and sending your first request.
                </p>
                {!isMentor && (
                  <Link to="/browse">
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Browse Mentors
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <button
                            className="font-semibold text-lg mr-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 rounded-md px-3 py-1 cursor-pointer transition-all duration-200 flex items-center text-gray-700 hover:text-gray-900"
                            onClick={() => handleMentorClick(request.mentor.id)}
                          >
                            {request.mentor.name}
                            <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                          </button>
                          <Badge
                            variant="outline"
                            className={getStatusColor(request.status)}
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Sent on {formatDate(request.created_at)}
                        </p>
                        {request.mentor.expertise.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {request.mentor.expertise
                              .slice(0, 3)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Proposal */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Your Proposal:</p>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                        {request.proposal}
                      </p>
                      {request.purpose && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Purpose:</p>
                          <p className="text-sm text-muted-foreground">
                            {request.purpose}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Meeting Link Section for Accepted Requests */}
                    {request.status === "accepted" &&
                      request.session?.meeting_link && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-800 mb-1">
                                Meeting Link Available! 🎉
                              </p>
                              <p className="text-sm text-green-700 mb-2">
                                Platform: {request.session.meeting_platform}
                              </p>
                              {request.session.scheduled_time && (
                                <p className="text-sm text-green-700 mb-2">
                                  Scheduled:{" "}
                                  {formatDate(request.session.scheduled_time)}
                                </p>
                              )}
                            </div>
                            <a
                              href={request.session.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="sm">
                                <Video className="h-4 w-4 mr-2" />
                                Join Meeting
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      )}

                    {/* Status Messages */}
                    {request.status === "accepted" &&
                      !request.session?.meeting_link && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            🎉 Your request was accepted! Your mentor will share
                            a meeting link soon.
                          </p>
                        </div>
                      )}

                    {request.status === "declined" && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-800">
                          This request was declined. You can try reaching out to
                          other mentors.
                        </p>
                      </div>
                    )}

                    {request.status === "pending" && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">
                          Your request is pending review by the mentor.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {requests.length > 0 && !isMentor && (
              <div className="mt-6 pt-4 border-t">
                <Link to="/browse">
                  <Button variant="outline" className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Browse More Mentors
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MenteeDashboard;
