import HeroSection from '@/components/layout/HeroSection';
import FeaturesSection from '@/components/layout/FeaturesSection';
import CTASection from '@/components/layout/CTASection';
import StatsSection from "@/components/layout/StatsSection";

export default function Home() {


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />
      {/* Stats Section */}
      <StatsSection />
      {/* Features Section */}
      <FeaturesSection />
      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
