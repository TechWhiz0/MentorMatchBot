import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
import { UserCheck, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState(
    searchParams.get("role") || ""
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [industriesInput, setIndustriesInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Register user using auth context
      await register(email, password);

      // Create profile using API directly since it's not in auth context
      await api.createProfile(
        name,
        selectedRole as "mentor" | "mentee",
        industries
      );

      toast({
        title: "Account created successfully",
        description: "Welcome to MentorMatch!",
      });

      // Redirect to role-specific dashboard
      const dashboardRoute =
        selectedRole === "mentor" ? "/mentor-dashboard" : "/mentee-dashboard";
      navigate(dashboardRoute);
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Join MentorMatch
          </h1>
          <p className="text-white/80">Start your mentorship journey today</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Create Account</CardTitle>
            <CardDescription className="text-white/70">
              Choose your role to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedRole && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline-white"
                  className="h-24 flex-col"
                  onClick={() => setSelectedRole("mentee")}
                >
                  <UserCheck className="h-8 w-8 mb-2" />
                  <span>I'm a Mentee</span>
                </Button>
                <Button
                  variant="outline-white"
                  className="h-24 flex-col"
                  onClick={() => setSelectedRole("mentor")}
                >
                  <Users className="h-8 w-8 mb-2" />
                  <span>I'm a Mentor</span>
                </Button>
              </div>
            )}

            {selectedRole && (
              <>
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-primary rounded-full text-white text-sm">
                    {selectedRole === "mentee" ? (
                      <UserCheck className="h-4 w-4 mr-2" />
                    ) : (
                      <Users className="h-4 w-4 mr-2" />
                    )}
                    Signing up as{" "}
                    {selectedRole === "mentee" ? "Mentee" : "Mentor"}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-white/60 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  {selectedRole === "mentor" && (
                    <div>
                      <Label htmlFor="industries" className="text-white">
                        Industries
                      </Label>
                      <Input
                        id="industries"
                        placeholder="Type an industry and press Enter (e.g., JavaScript)"
                        value={industriesInput}
                        onChange={(e) => setIndustriesInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const trimmedInput = industriesInput.trim();
                            if (
                              trimmedInput &&
                              !industries.includes(trimmedInput)
                            ) {
                              setIndustries([...industries, trimmedInput]);
                              setIndustriesInput("");
                            }
                          }
                        }}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                      <p className="text-xs text-white/60 mt-1">
                        Type an industry and press Enter to add it
                      </p>
                      {industries.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {industries.map((industry, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-sm rounded-full border border-white/30"
                            >
                              {industry}
                              <button
                                type="button"
                                onClick={() => {
                                  setIndustries(
                                    industries.filter((_, i) => i !== index)
                                  );
                                }}
                                className="ml-2 text-white/70 hover:text-white text-xs"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-primary hover:bg-white/90"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-white/70 hover:text-white"
                  onClick={() => setSelectedRole("")}
                >
                  ← Change Role
                </Button>
              </>
            )}

            <div className="text-center text-white/70 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
