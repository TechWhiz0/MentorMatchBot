import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video, Calendar, Link2, CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AddMeetingLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  onSuccess: () => void;
}

const MEETING_PLATFORMS = [
  {
    id: "zoom",
    name: "Zoom",
    icon: Video,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
    homepage: "https://zoom.us",
  },
  {
    id: "google-meet",
    name: "Google Meet",
    icon: Video,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
    borderColor: "border-green-200",
    homepage: "https://meet.google.com",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    icon: Video,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
    borderColor: "border-purple-200",
    homepage: "https://teams.microsoft.com",
  },
  {
    id: "calendly",
    name: "Calendly",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
    borderColor: "border-orange-200",
    homepage: "https://calendly.com",
  },
];

const AddMeetingLinkModal: React.FC<AddMeetingLinkModalProps> = ({
  isOpen,
  onClose,
  requestId,
  onSuccess,
}) => {
  const [meetingLink, setMeetingLink] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePlatformClick = (platform: (typeof MEETING_PLATFORMS)[0]) => {
    window.open(platform.homepage, "_blank");
    setSelectedPlatform(platform.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!meetingLink.trim() || !selectedPlatform) {
      toast({
        title: "Error",
        description: "Please select a platform and provide a meeting link.",
        variant: "destructive",
      });
      return;
    }

    if (!scheduledTime) {
      toast({
        title: "Error",
        description: "Please select a scheduled meeting time.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create session using the new API
      await api.createSession(
        requestId,
        meetingLink.trim(),
        scheduledTime.toISOString()
      );

      toast({
        title: "Meeting Link Added!",
        description: "The meeting link has been shared with the mentee.",
      });

      // Reset form
      setMeetingLink("");
      setSelectedPlatform("");
      setScheduledTime(null);
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Meeting Link</DialogTitle>
          <DialogDescription>
            Choose a platform and provide the meeting link for your mentee
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">
              Select Meeting Platform
            </Label>
            <p className="text-sm text-muted-foreground mb-4">
              Click on a platform to open it in a new tab, then create your
              meeting and copy the link.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {MEETING_PLATFORMS.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    type="button"
                    variant="outline"
                    className={`h-16 flex-col space-y-2 border-2 transition-all ${
                      selectedPlatform === platform.id
                        ? `${platform.bgColor} ${platform.borderColor} border-2`
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => handlePlatformClick(platform)}
                  >
                    <IconComponent className={`h-5 w-5 ${platform.color}`} />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="meetingLink">Meeting Link *</Label>
              <div className="relative mt-1">
                <Input
                  id="meetingLink"
                  type="url"
                  placeholder="Paste your meeting link here..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="pl-10"
                  required
                />
                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="scheduledTime">Scheduled Time *</Label>
              <div className="relative mt-1">
                <DatePicker
                  selected={scheduledTime}
                  onChange={(date: Date) => setScheduledTime(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  placeholderText="Select date and time"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Select the scheduled meeting time. This helps mentees prepare for the session.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedPlatform || !scheduledTime}
                className="flex-1"
              >
                {isSubmitting ? "Saving..." : "Save Link"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeetingLinkModal;
