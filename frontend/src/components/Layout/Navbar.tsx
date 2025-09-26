import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  LogOut,
  Settings,
  Home,
  Users,
  UserCheck,
  Bot,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const Navbar = () => {
  const { isAuthenticated, user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!profile) return "/mentee-dashboard";
    return profile.role === "mentor"
      ? "/mentor-dashboard"
      : "/mentee-dashboard";
  };

  const getDashboardIcon = () => {
    if (!profile) return <Home className="h-4 w-4" />;
    return profile.role === "mentor" ? (
      <Users className="h-4 w-4" />
    ) : (
      <UserCheck className="h-4 w-4" />
    );
  };

  const getDashboardText = () => {
    if (!profile) return "Dashboard";
    return profile.role === "mentor" ? "Mentor Dashboard" : "Mentee Dashboard";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-amber-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl">
              <Link
                to="/"
                className="text-amber-600 hover:text-amber-700 transition-colors font-semibold"
              >
                Connect
              </Link>
              
            </span>
          </div>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              {profile?.role === "mentee" && (
                <Link
                  to="/mentee-dashboard"
                  className="text-slate-600 hover:text-amber-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
              )}
              {profile?.role === "mentor" && (
                <Link
                  to="/mentor-dashboard"
                  className="text-slate-600 hover:text-amber-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/chatbot"
                className="text-slate-600 hover:text-amber-600 transition-colors flex items-center gap-2 font-medium"
              >
                <Bot className="h-4 w-4" />
                Study Assistant
              </Link>
              {profile?.role === "mentee" && (
                <Link
                  to="/browse"
                  className="text-slate-600 hover:text-amber-600 transition-colors font-medium"
                >
                  Browse Mentors
                </Link>
              )}
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {profile?.name?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.name || user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {profile?.role === "mentee" && (
                    <DropdownMenuItem asChild>
                      <Link to="/mentee-dashboard">
                        <UserCheck className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {profile?.role === "mentor" && (
                    <DropdownMenuItem asChild>
                      <Link to="/mentor-dashboard">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/chatbot">
                      <Bot className="mr-2 h-4 w-4" />
                      <span>Study Assistant</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-slate-600 hover:text-amber-600">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="elegant" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
