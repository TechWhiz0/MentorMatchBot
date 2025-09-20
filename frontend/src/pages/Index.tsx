import Navbar from "@/components/Layout/Navbar";
import HeroSection from "@/components/Hero/HeroSection";
import FeaturesSection from "@/components/Features/FeaturesSection";
import QnASection from "@/components/QnA/QnASection";
import Footer from "@/components/Layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <QnASection />
      <Footer />
    </div>
  );
};

export default Index;
