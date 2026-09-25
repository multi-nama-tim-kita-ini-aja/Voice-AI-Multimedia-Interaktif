import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FaqSection from "@/components/FaqSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <HeroSection />
      {/* TODO: HowToPlaySection & LeaderboardSection belum dibuat, urutan final: Hero -> HowToPlay -> Categories -> Leaderboard -> Faq -> Footer */}
      <CategoriesSection />
      <FaqSection />
      <FooterSection />
    </main>
  );
}