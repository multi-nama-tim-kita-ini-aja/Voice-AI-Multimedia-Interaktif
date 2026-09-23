"use client";

import { useState } from "react";
import HowToPlay from "@/components/HowToPlay";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiMicIcon, SpeedTrain02Icon, RankingIcon } from "@hugeicons/core-free-icons";
import { CustomWaveButton } from "@/components/ui/wave-button";

// Structuring Nav Items 
const NAV_ITEMS = [
  { id: "categories", title: "CATEGORIES", targetId: "categories" },
  { id: "how-to-play", title: "HOW TO PLAY" }, // Khusus Modal
  { id: "leaderboard", title: "LEADERBOARD", targetId: "leaderboard" },
  { id: "audio-setup", title: "AUDIO SETUP", targetId: "audio-setup" },
  { id: "faqs", title: "FAQS", targetId: "faqs" },
  { id: "support", title: "SUPPORT", targetId: "support" },
];

export default function FooterSection() {
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Handler klik 
  const handleItemClick = (item: (typeof NAV_ITEMS)[0]) => {
    console.log("CLICKED NAV:", item.title);

    if (item.id === "how-to-play") {
      setIsHowToPlayOpen(true);
      return;
    }

    if (item.targetId) {
      const targetElement = document.getElementById(item.targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer id="footer" className="relative w-full">
      {/* Container Utama */}
      <div className="relative w-full overflow-hidden">
        {/* Gambar Background Footer Luar */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <Image
            src="/lets-quiz.png"
            alt="Footer Outer Background"
            fill
            className="object-cover"
          />
        </div>

        {/* Banner Card Container */}
        <div className="flex p-6 justify-center items-center w-full h-[752px] relative max-md:p-4 max-md:h-auto">
          <div className="shrink-0 rounded-[18px] w-full max-w-[1232px] h-[704px] relative overflow-hidden max-md:h-[430px] max-md:rounded-[20px] max-md:p-4">
            {/* Card Background */}
            <div className="absolute inset-0 pointer-events-none -z-10">
              <Image
                src="/bukit-footer.png"
                alt="Footer Card Background"
                fill
                className="rounded-[18px] max-md:rounded-[20px] object-cover"
              />
            </div>

            {/* CTA Button Desktop & Mobile (Tengah) */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="pointer-events-auto">
                <CustomWaveButton className="h-12 px-8 text-base md:h-14 md:px-10 md:text-xl">
                  Start Quiz
                </CustomWaveButton>
              </div>
            </div>

            {/* Header Kanan Atas */}
            <div className="flex flex-col justify-center items-start gap-1 w-[262px] h-[95px] absolute right-6 top-6 max-md:right-3.5 max-md:top-3.5 max-md:w-[210px] max-md:h-auto max-md:items-end max-md:gap-1.5 z-20">
              <div className="flex items-center gap-1.5 shrink-0 w-[auto] h-[18px]">
                <div className="shrink-0 bg-[#FFF] w-6 h-0.5 max-md:w-4"></div>
                <p className="text-[#FFF] font-monaSans text-lg font-semibold leading-[18px] w-fit tracking-[-0.0556em] max-md:text-[13px] max-md:leading-tight">
                  Ready to speak?
                </p>
              </div>
              <div className="flex flex-col items-end w-full">
                <p className="text-[#FFF] font-monaSans text-lg font-semibold leading-[18px] w-[262px] text-right tracking-[-0.0556em] max-md:text-[11px] max-md:leading-tight max-md:w-full">
                  Test your knowledge without touching a screen.
                </p>
              </div>
            </div>

            {/* Bottom Left Title & Badges */}
            <div className="w-[436px] h-[212px] absolute left-6 top-[468px] max-md:left-3.5 max-md:bottom-3 max-md:top-auto max-md:w-[calc(100%-28px)] max-md:h-auto z-20">
              <p className="text-[#FFF] font-monaSans text-[56px] font-extrabold leading-[50.4px] w-[436px] h-[152px] absolute left-0 top-[68px] tracking-[-0.0357em] max-md:static max-md:w-[270px] max-md:h-auto max-md:text-[34px] max-md:leading-[0.95] max-md:tracking-[-0.04em]">
                SPEAK UP AND CLAIM THE VICTORY
              </p>

              {/* Tag 1 (Pink / Fast Answers) */}
              <div className="w-[97px] h-[46px] absolute -left-[3px] top-[34px] -rotate-[9deg] max-md:-top-7 max-md:left-0 max-md:scale-[0.75] max-md:origin-bottom-left z-30">
                <div className="flex py-0.5 px-[7px] justify-center items-center gap-0.5 rounded-[4.5px] bg-[#F4EAF5] shadow-[0_0_6px_0_rgba(0,0,0,0.04)] w-[97px] h-[29px] absolute left-0 top-[17px] overflow-hidden border border-white/60">
                  <p className="text-[#212121] font-plusJakartaSans text-[11px] font-semibold leading-[13.39px] w-fit">
                    Fast Answers
                  </p>
                  <Image
                    src="/paper-purple.png"
                    alt="Mic Icon"
                    width={13}
                    height={13}
                    className="absolute -right-px -top-0.5"
                  />
                </div>
                <div className="flex justify-center items-center rounded-full bg-[#EC68FD] shadow-[-1.4px_2.1px_1.4px_0_rgba(0,0,0,0.24)] w-[29px] h-[29px] absolute left-1 top-px border-[0.93px] border-[#FFF]">
                  <HugeiconsIcon
                    icon={SpeedTrain02Icon}
                    size={15}
                    className="text-white shrink-0"
                  />
                </div>
              </div>

              {/* Tag 2 (Ungu / Rank Points) */}
              <div className="w-[97px] h-[46px] absolute left-[356px] top-[135px] -rotate-[-11deg] max-md:left-[-2px] max-md:bottom-[-2px] max-md:top-auto max-md:-rotate-[6deg] max-md:scale-[0.75] max-md:origin-bottom-left z-30">
                <div className="flex py-0.5 px-[7px] justify-center items-center gap-0.5 rounded-[4.5px] bg-[#F1EEFC] shadow-[0_0_6px_0_rgba(0,0,0,0.04)] w-[97px] h-[29px] absolute left-0 top-[17px] overflow-hidden border border-white/60 max-md:-top-4.25">
                  <p className="text-[#212121] font-plusJakartaSans text-[11px] font-semibold leading-[13.39px] w-fit">
                    Rank Points
                  </p>
                  <Image
                    src="/paper-blue.png"
                    alt="Rank Icon"
                    width={11}
                    height={11}
                    className="absolute -right-px -top-0.5"
                  />
                </div>
                <div className="flex justify-center items-center rounded-full bg-[#8168FD] shadow-[-1.4px_2.1px_1.4px_0_rgba(0,0,0,0.24)] w-[29px] h-[29px] absolute left-1 top-px border-[0.93px] border-[#FFF] max-md:-top-8">
                  <HugeiconsIcon
                    icon={RankingIcon}
                    size={15}
                    className="text-white shrink-0"
                  />
                </div>
              </div>

              {/* Tag 3 (Hijau / Voice Duel) */}
              <div className="w-[97px] h-[46px] absolute left-[294px] top-[27px] -rotate-[-9deg] max-md:left-auto max-md:-right-1 max-md:top-3 max-md:rotate-[8deg] max-md:scale-[0.75] max-md:origin-center z-30">
                <div className="flex py-0.5 px-[7px] justify-center items-center gap-0.5 rounded-[4.5px] bg-[#F4F8E8] shadow-[0_0_6px_0_rgba(0,0,0,0.04)] w-[97px] h-[29px] absolute left-0 top-[17px] overflow-hidden border border-white/60">
                  <p className="text-[#212121] font-plusJakartaSans text-[11px] font-semibold leading-[13.39px] w-fit">
                    Voice Duel
                  </p>
                  <Image
                    src="/paper-green.png"
                    alt="Duel Icon"
                    width={11}
                    height={11}
                    className="absolute -right-px -top-0.5"
                  />
                </div>
                <div className="flex justify-center items-center rounded-full bg-[#93BA06] shadow-[-1.4px_2.1px_1.4px_0_rgba(0,0,0,0.24)] w-[29px] h-[29px] absolute left-1 top-px border-[0.93px] border-[#FFF]">
                  <HugeiconsIcon
                    icon={AiMicIcon}
                    size={15}
                    className="text-white shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar - Ditaruh paling atas dengan z-[99999] & pointer-events-auto */}
      <div className="relative z-[99999] flex px-[30px] pb-6 justify-between items-center w-full h-12 max-md:flex-col max-md:h-auto max-md:gap-3 max-md:px-4 max-md:pb-12 bg-transparent pointer-events-auto">
        <p className="text-[#1A1A1A] font-monaSans text-2xl font-semibold leading-6 tracking-[-0.0417em]">
          VoxIQ®
        </p>

        <nav className="flex items-center gap-[18px] max-md:flex-wrap max-md:justify-center max-md:gap-x-3 max-md:gap-y-1.5 relative z-[100000]">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(item);
              }}
              className="text-[#1A1A1A] font-monaSans text-base font-medium leading-[20.8px] tracking-[-0.0125em] hover:opacity-75 transition-opacity max-md:text-[11px] cursor-pointer select-none py-1 px-1.5 relative z-[100001] pointer-events-auto"
            >
              {item.title}
            </div>
          ))}
        </nav>
      </div>

      {/* Render Modal How To Play */}
      <HowToPlay
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </footer>
  );
}