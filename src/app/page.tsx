import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import HowToPlay from "@/components/HowToPlay";
import Leaderboard from "@/components/Leaderboard";
import Cloud from "@/components/ui/cloud";
import FaqSection from "@/components/FaqSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <HeroSection />
      <HowToPlay />
      <CategoriesSection />
      <Leaderboard />
      <Cloud />
      <FaqSection />
      <FooterSection />
    </main>
  );
}