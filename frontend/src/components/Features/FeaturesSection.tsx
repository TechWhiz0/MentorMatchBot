import { Search, Calendar, MessageSquare, Award, Zap, Shield, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart AI Matching",
    description: "Our intelligent algorithm matches you with the perfect mentor based on your goals, skills, and industry preferences.",
    gradient: "from-amber-500 to-orange-500",
    delay: "0s"
  },
  {
    icon: Calendar,
    title: "Seamless Scheduling",
    description: "Book sessions effortlessly with integrated scheduling that handles time zones and availability automatically.",
    gradient: "from-emerald-500 to-teal-500",
    delay: "0.1s"
  },
  {
    icon: MessageSquare,
    title: "Structured Communication",
    description: "Connect through our advanced proposal system with real-time feedback and progress tracking.",
    gradient: "from-orange-500 to-red-500",
    delay: "0.2s"
  },
  {
    icon: Award,
    title: "Verified Experts",
    description: "Learn from industry leaders with proven track records in entrepreneurship, business, and STEM fields.",
    gradient: "from-amber-600 to-orange-600",
    delay: "0.3s"
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Your data and conversations are protected with enterprise-grade security and privacy controls.",
    gradient: "from-slate-600 to-slate-700",
    delay: "0.4s"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your growth with detailed analytics, milestone tracking, and personalized insights.",
    gradient: "from-emerald-600 to-green-600",
    delay: "0.5s"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-amber-100/50 relative overflow-hidden">
      {/* Elegant background decorations */}
      <div className="absolute inset-0 bg-grid-amber-200/[0.02] bg-grid" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-amber-300/10 to-orange-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-300/10 to-amber-300/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Elegant header */}
        <div className="text-center mb-20">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full border border-amber-500/20 mb-6">
              <Zap className="h-4 w-4 text-amber-600 mr-2" />
              <span className="text-amber-600 text-sm font-semibold">Platform Features</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
              <span className="text-slate-800">How It </span>
              <span className="animate-gradient-text text-gradient">Works</span>
            </h2>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Experience the future of mentorship with our cutting-edge platform designed to accelerate your growth
            </p>
          </div>
        </div>

        {/* Elegant features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-modern group bg-white/80 backdrop-blur-sm border border-amber-200/50"
              style={{ animationDelay: feature.delay }}
            >
              {/* Icon with elegant design */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold mb-4 text-slate-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all duration-300">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Elegant hover effect indicator */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;