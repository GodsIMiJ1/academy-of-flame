import { useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { WhyReflectSection } from "@/components/WhyReflectSection";
import { CurriculumSection } from "@/components/CurriculumSection";
import { SwipeableTestimonials } from "@/components/SwipeableTestimonials";
import { UrgencyBanner } from "@/components/UrgencyElements";
import { LeadCaptureSection } from "@/components/LeadCaptureSection";
import { FooterSection } from "@/components/FooterSection";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

const Index = () => {
  // Set dark theme on load for the cyberpunk aesthetic
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <UrgencyBanner />
      <HeroSection />
      <WhyReflectSection />
      <CurriculumSection />
      <SwipeableTestimonials />
      <div id="lead-capture">
        <LeadCaptureSection />
      </div>
      <FooterSection />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
