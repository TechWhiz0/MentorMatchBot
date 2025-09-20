import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Star,
  Users,
  Calendar,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const HeroSection = () => {
  const { isAuthenticated, profile } = useAuth();

  return (
    <section className="pt-24 pb-20 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 relative overflow-hidden min-h-screen flex items-center">
      {/* Elegant background decorations */}
      <div className="absolute inset-0 bg-grid-amber-200/[0.03] bg-grid" />

      {/* Warm floating orbs with elegant animations */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-300/20 to-orange-300/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-orange-300/20 to-red-300/20 rounded-full blur-2xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-amber-200/15 to-orange-200/15 rounded-full blur-3xl animate-pulse-slow" />

      {/* Elegant animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-20 w-2 h-2 bg-amber-400/40 rounded-full animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-40 right-32 w-1 h-1 bg-orange-400/50 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-amber-300/35 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-orange-300/45 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main heading with elegant animations */}
          <div className="animate-fade-in-up mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-slate-800 mb-6 leading-tight font-serif">
              Connect with{" "}
              <span className="animate-gradient-text text-gradient">Expert Mentors</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto font-medium">
              Transform your career with personalized guidance from industry
              experts. Find your perfect mentor and accelerate your growth with
              our intelligent matching system.
            </p>
          </div>

          {/* Enhanced CTA buttons */}
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {isAuthenticated && profile ? (
              // User is authenticated and has profile - show role-specific dashboard
              <Link
                to={
                  profile.role === "mentor"
                    ? "/mentor-dashboard"
                    : "/mentee-dashboard"
                }
              >
                <Button variant="elegant" size="lg" className="group">
                  <Target className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              // User is not authenticated - show login link
              <Link to="/login">
                <Button variant="elegant" size="lg" className="group">
                  <Target className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}

            {isAuthenticated && profile ? (
              // User is authenticated and has profile - show browse mentors link for mentees
              profile.role === "mentee" ? (
                <Link to="/browse">
                  <Button variant="outline-elegant" size="lg" className="group">
                    <Zap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Browse Mentors
                  </Button>
                </Link>
              ) : (
                <Link to="/chatbot">
                  <Button variant="outline-elegant" size="lg" className="group">
                    <Zap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Study Assistant
                  </Button>
                </Link>
              )
            ) : (
              // User is not authenticated or doesn't have profile - show signup link
              <Link to="/signup">
                <Button variant="outline-elegant" size="lg" className="group">
                  <Zap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Sign Up
                </Button>
              </Link>
            )}
          </div>

          {/* Elegant stats with warm design */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-scale-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="card-modern text-center group bg-white/80 backdrop-blur-sm border border-amber-200/50">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-slate-800">500+</span>
              </div>
              <p className="text-slate-600 font-semibold">Expert Mentors</p>
              <p className="text-slate-500 text-sm mt-1">
                Verified professionals
              </p>
            </div>

            <div className="card-modern text-center group bg-white/80 backdrop-blur-sm border border-amber-200/50">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-slate-800">4.9</span>
              </div>
              <p className="text-slate-600 font-semibold">Average Rating</p>
              <p className="text-slate-500 text-sm mt-1">From 10k+ reviews</p>
            </div>

            <div className="card-modern text-center group bg-white/80 backdrop-blur-sm border border-amber-200/50">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-slate-800">10k+</span>
              </div>
              <p className="text-slate-600 font-semibold">Sessions Completed</p>
              <p className="text-slate-500 text-sm mt-1">Successful matches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-amber-400/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-amber-500/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
