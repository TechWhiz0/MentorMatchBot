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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Send } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface RequestMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  mentorName: string;
  onSuccess: () => void;
}

const RequestMentorModal: React.FC<RequestMentorModalProps> = ({
  isOpen,
  onClose,
  mentorId,
  mentorName,
  onSuccess,
}) => {
  const [proposal, setProposal] = useState("");
  const [purpose, setPurpose] = useState("");
  const [preferredTime, setPreferredTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proposal.trim()) {
      toast({
        title: "Error",
        description: "Please write a proposal to connect with the mentor.",
        variant: "destructive",
      });
      return;
    }

    if (!preferredTime) {
      toast({
        title: "Error",
        description: "Please select a preferred meeting time.",
        variant: "destructive",
      });
      return;
    }

    if (!mentorId) {
      toast({
        title: "Error",
        description: "Mentor ID is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mentorship request using the new API
      await api.createMentorshipRequest(
        mentorId,
        proposal.trim(),
        preferredTime.toISOString()
      );

      toast({
        title: "Request Sent!",
        description: `Your mentorship request has been sent to ${mentorName}.`,
      });

      // Reset form
      setProposal("");
      setPurpose("");
      setPreferredTime(null);
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Request Mentorship</DialogTitle>
          <DialogDescription>
            Send a mentorship request to {mentorName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="proposal" className="text-base font-medium">
              Proposal *
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Write a detailed proposal explaining your goals, what you want to
              learn, and why you chose this mentor.
            </p>
            <Textarea
              id="proposal"
              placeholder="Hi! I'm interested in learning [specific skill/topic] and I believe you could help me because [reason]. My goals are [your goals] and I'm looking for guidance on [specific areas]. I'm particularly interested in [specific questions or challenges you have]..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="mt-1 min-h-[120px] text-base"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              A well-written proposal increases your chances of being accepted.
              Be specific about your goals and why you chose this mentor.
            </p>
          </div>

          <div>
            <Label htmlFor="purpose">Purpose (Optional)</Label>
            <Input
              id="purpose"
              placeholder="e.g., Career guidance, Technical skills, Business advice"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="preferredTime">Preferred Time *</Label>
            <div className="relative mt-1">
              <DatePicker
                selected={preferredTime}
                onChange={(date: Date) => setPreferredTime(date)}
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
              Select your preferred meeting time. This helps mentors schedule
              sessions effectively.
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
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestMentorModal;
