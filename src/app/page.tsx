import HeroSection from "@/components/HeroSection";
import HowToPlay from "@/components/HowToPlay";
import FaqSection from "@/components/FaqSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <HeroSection />
      <HowToPlay />
      <FaqSection />
      <FooterSection />
    </main>
  );
}