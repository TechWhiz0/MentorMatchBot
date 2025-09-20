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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Save, ArrowLeft } from "lucide-react";
import { api, Profile } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const EditProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "mentee" as "mentor" | "mentee",
    industries: [] as string[],
    about: "",
  });
  const [newIndustry, setNewIndustry] = useState("");

  const availableIndustries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Design",
    "Engineering",
    "Business",
    "Science",
    "Arts",
    "Sports",
    "Law",
    "Media",
    "Non-profit",
    "Government",
    "JavaScript",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "TypeScript",
    "Angular",
    "Vue.js",
    "Django",
    "Flask",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "DevOps",
    "Machine Learning",
    "Artificial Intelligence",
    "Data Science",
    "Cybersecurity",
    "Mobile Development",
    "Web Development",
    "Game Development",
    "UI/UX Design",
    "Product Management",
    "Agile",
    "Scrum",
    "Project Management",
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await api.getProfile();
      setProfile(profileData);
      setFormData({
        name: profileData.name,
        role: profileData.role,
        industries: profileData.industries || [],
        about: profileData.about || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (formData.role === "mentor" && formData.industries.length === 0) {
      alert("Please select at least one industry for mentors");
      return;
    }

    try {
      setSaving(true);
      const updatedProfile = await api.updateProfile(
        formData.name,
        formData.role,
        formData.role === "mentor" ? formData.industries : [],
        formData.about
      );

      // Refresh user data in auth context
      await refreshUser();

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addIndustry = () => {
    if (
      newIndustry.trim() &&
      !formData.industries.includes(newIndustry.trim())
    ) {
      setFormData({
        ...formData,
        industries: [...formData.industries, newIndustry.trim()],
      });
      setNewIndustry("");
    }
  };

  const removeIndustry = (industry: string) => {
    setFormData({
      ...formData,
      industries: formData.industries.filter((i) => i !== industry),
    });
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Button>
              <div>
                <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
                <p className="text-muted-foreground">
                  Update your profile information
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              </div>

              {/* Role (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                  <Badge variant="secondary" className="capitalize">
                    {formData.role}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Role cannot be changed
                  </span>
                </div>
              </div>

              {/* About */}
              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) =>
                    setFormData({ ...formData, about: e.target.value })
                  }
                  placeholder="Tell us about yourself, your goals, and what you're looking for..."
                  rows={4}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.about.length}/1000 characters
                </p>
              </div>

              {/* Industries (for mentors only) */}
              {formData.role === "mentor" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Industries/Expertise</Label>
                    <p className="text-sm text-muted-foreground">
                      Select the industries you have expertise in
                    </p>
                  </div>

                  {/* Selected Industries */}
                  {formData.industries.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.industries.map((industry) => (
                        <Badge
                          key={industry}
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          {industry}
                          <button
                            onClick={() => removeIndustry(industry)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Add Industry */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Select
                        value={newIndustry}
                        onValueChange={setNewIndustry}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select from predefined list" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIndustries
                            .filter(
                              (industry) =>
                                !formData.industries.includes(industry)
                            )
                            .map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={addIndustry}
                        disabled={!newIndustry.trim()}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>

                    {/* Custom Industry Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Or type a custom industry..."
                        value={newIndustry}
                        onChange={(e) => setNewIndustry(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addIndustry()}
                      />
                      <Button
                        onClick={addIndustry}
                        disabled={!newIndustry.trim()}
                        variant="outline"
                      >
                        Add Custom
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-3">Preview</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium">{formData.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {formData.role}
                  </p>
                  {formData.about && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {formData.about}
                    </p>
                  )}
                  {formData.role === "mentor" &&
                    formData.industries.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.industries.map((industry) => (
                          <Badge
                            key={industry}
                            variant="outline"
                            className="text-xs"
                          >
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
