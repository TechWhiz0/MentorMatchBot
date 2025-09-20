import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";
import { useAuth } from "@/lib/auth";

const Footer = () => {
  const { profile } = useAuth();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-amber-100/80 border-t border-amber-200/50 relative overflow-hidden">
      {/* Elegant background decorations */}
      <div className="absolute inset-0 bg-grid-amber-200/[0.02] bg-grid" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="animate-fade-in-up">
              <h3 className="text-3xl font-bold mb-4 font-serif">
                <span className="text-gradient">MentorConnect</span>
              </h3>
              <p className="text-slate-600 mb-6 max-w-lg leading-relaxed font-medium">
                Revolutionizing mentorship with AI-powered matching, seamless
                scheduling, and comprehensive progress tracking. Join thousands
                of professionals accelerating their growth.
              </p>

              {/* Social links with elegant hover effects */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Platform links */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h4 className="font-bold text-lg mb-6 text-slate-800">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/browse"
                  className="text-slate-600 hover:text-amber-600 transition-colors duration-300 hover:translate-x-1 inline-block font-medium"
                >
                  Find Mentors
                </Link>
              </li>
              <li>
                <Link
                  to="/signup?role=mentor"
                  className="text-slate-600 hover:text-amber-600 transition-colors duration-300 hover:translate-x-1 inline-block font-medium"
                >
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link
                  to={
                    profile?.role === "mentor"
                      ? "/mentor-dashboard"
                      : "/mentee-dashboard"
                  }
                  className="text-slate-600 hover:text-amber-600 transition-colors duration-300 hover:translate-x-1 inline-block font-medium"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-slate-600 hover:text-amber-600 transition-colors duration-300 hover:translate-x-1 inline-block font-medium"
                >
                  How it Works
                </a>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-slate-600 hover:text-amber-600 transition-colors duration-300 hover:translate-x-1 inline-block font-medium"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support links */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h4 className="font-bold text-lg mb-6 text-slate-800">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#faq"
                  className="text-slate-600 hover:text-amber-600 transition-colors duration-300 hover:translate-x-1 inline-block font-medium"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-amber-600 transition-colors duration-300 hover:translate-x-1 inline-block font-medium"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-amber-600 transition-colors duration-300 hover:translate-x-1 inline-block font-medium"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-amber-600 transition-colors duration-300 hover:translate-x-1 inline-block font-medium"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-amber-600 transition-colors duration-300 hover:translate-x-1 inline-block font-medium"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-amber-200/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-center md:text-left mb-4 md:mb-0 font-medium">
            © 2024 MentorConnect. All rights reserved. Built with{" "}
            <Heart className="inline h-4 w-4 text-amber-500 animate-pulse" /> for
            learning and growth.
          </p>

          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 hover:shadow-lg"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
