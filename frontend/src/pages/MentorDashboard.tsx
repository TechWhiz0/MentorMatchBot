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
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  Video,
  MessageSquare,
} from "lucide-react";
import { api } from "@/lib/api";
import { Profile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import AddMeetingLinkModal from "@/components/MeetingLink/AddMeetingLinkModal";

interface MentorshipRequest {
  id: string;
  proposal: string;
  purpose: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string;
  mentee: {
    name: string;
    interests: string[];
    goals: string | null;
  };
  session?: {
    meeting_link: string | null;
    meeting_platform: string | null;
    scheduled_time: string | null;
  };
}

const MentorDashboard = () => {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(
    null
  );
  const { toast } = useToast();

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
          preferred_time: request.preferred_time,
          status: request.status,
          created_at: request.created_at,
          mentee: {
            name:
              typeof request.mentee_id === "object"
                ? request.mentee_id.name
                : "Unknown",
            interests: [], // Not available in new API
            goals: null, // Not available in new API
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

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: "accepted" | "declined"
  ) => {
    try {
      if (newStatus === "accepted") {
        await api.acceptMentorshipRequest(requestId);
      } else {
        await api.declineMentorshipRequest(requestId);
      }

      toast({
        title: "Success",
        description: `Request ${newStatus} successfully.`,
      });

      fetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddMeetingLink = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowMeetingModal(true);
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
            Welcome back, {currentUserProfile?.name || "Mentor"}!
          </h1>
          <p className="text-muted-foreground">
            Manage your mentorship requests and sessions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Total Requests</h3>
              <p className="text-2xl font-bold text-primary">
                {requests.length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {requests.filter((r) => r.status === "pending").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Accepted</h3>
              <p className="text-2xl font-bold text-green-600">
                {requests.filter((r) => r.status === "accepted").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Mentorship Requests
            </CardTitle>
            <CardDescription>
              Review and manage incoming mentorship requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
                <p className="text-muted-foreground">
                  Mentorship requests will appear here when mentees reach out to
                  you.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-semibold text-lg mr-3">
                            {request.mentee.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className={getStatusColor(request.status)}
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Submitted on {formatDate(request.created_at)}
                        </p>
                        {request.preferred_time && (
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Preferred time: {formatDate(request.preferred_time)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mentee Info */}
                    <div className="mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        {request.mentee.interests.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Interests:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {request.mentee.interests.map(
                                (interest, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {interest}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {request.mentee.goals && (
                          <div>
                            <p className="text-sm font-medium mb-1">Goals:</p>
                            <p className="text-sm text-muted-foreground">
                              {request.mentee.goals}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Proposal */}
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Proposal:</p>
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

                    {/* Meeting Link Section */}
                    {request.status === "accepted" && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                        {request.session?.meeting_link ? (
                          <div>
                            <p className="text-sm font-medium text-green-800 mb-2">
                              Meeting Link Shared:
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-green-700">
                                  Platform: {request.session.meeting_platform}
                                </p>
                                <a
                                  href={request.session.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  {request.session.meeting_link}
                                </a>
                                {request.session.scheduled_time && (
                                  <p className="text-sm text-green-700">
                                    Scheduled:{" "}
                                    {formatDate(request.session.scheduled_time)}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddMeetingLink(request.id)}
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Update Link
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Request Accepted!
                              </p>
                              <p className="text-sm text-green-700">
                                Add a meeting link to schedule your session.
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddMeetingLink(request.id)}
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Add Meeting Link
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            handleStatusUpdate(request.id, "accepted")
                          }
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleStatusUpdate(request.id, "declined")
                          }
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedRequestId && (
          <AddMeetingLinkModal
            isOpen={showMeetingModal}
            onClose={() => setShowMeetingModal(false)}
            requestId={selectedRequestId}
            onSuccess={fetchRequests}
          />
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
