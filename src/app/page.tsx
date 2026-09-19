import HeroSection from "@/components/HeroSection";
import FaqSection from "@/components/FaqSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <HeroSection />
      <FaqSection />
      <FooterSection />
    </main>
  );
}