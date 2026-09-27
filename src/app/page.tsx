import HeroSection from "@/components/HeroSection";
import Leaderboard from "@/components/Leaderboard";
import Cloud from "@/components/ui/cloud";
import FaqSection from "@/components/FaqSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
    return (
        <main className="relative w-full min-h-screen overflow-x-hidden">
            <HeroSection />
            <Leaderboard />
            <Cloud />
            <FaqSection />
            <FooterSection />
        </main>
    );
}