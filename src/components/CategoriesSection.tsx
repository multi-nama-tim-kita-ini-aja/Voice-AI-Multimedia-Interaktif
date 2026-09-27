"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Grid02Icon } from "@hugeicons/core-free-icons";
import CaseStudyModal, { ModalCardItem } from "./CaseStudyModal";

interface CategoryCardItem extends ModalCardItem {
  categoryTag: string;
  categoryTag2: string;
  categoryTag3: string;
  tilt: string;
}

const CATEGORIES: CategoryCardItem[] = [
  {
    id: "mtk",
    title: "Mathematics",
    image: "/bukit-hero.png",
    categoryTag: "Algebra",
    categoryTag2: "Logic",
    categoryTag3: "Calculus",
    tilt: "rotate-[6deg]",
    detail: {
      totalQuestions: "10 Questions",
      timeperQ: "20 Seconds",
      difficultyLevel: "Hard",
      micStatus: "Active & Required",
      description:
        "Sharpen your mental calculation and logical thinking! Speak your numerical answers or formulas aloud before time ticks away.",
      previewUrl: "https://figma.com",
    },
  },
  {
    id: "ipa",
    title: "Science",
    image: "/bukit-hero.png",
    categoryTag: "Physics",
    categoryTag2: "Lab Equipment",
    categoryTag3: "Space",
    tilt: "-rotate-[5deg]",
    detail: {
      totalQuestions: "10 Questions",
      timeperQ: "15 Seconds",
      difficultyLevel: "Medium",
      micStatus: "Active & Required",
      description:
        "Test your knowledge of the universe, physics, and biology! Speak clearly to answer questions before the timer runs out and earn streak points.",
      previewUrl: "https://figma.com",
    },
  },
  {
    id: "ips",
    title: "Social Studies",
    image: "/bukit-hero.png",
    categoryTag: "History",
    categoryTag2: "Geo",
    categoryTag3: "Politics",
    tilt: "-rotate-[3deg]",
    detail: {
      totalQuestions: "12 Questions",
      timeperQ: "15 Seconds",
      difficultyLevel: "Easy-Medium",
      micStatus: "Active & Required",
      description:
        "Journey through world history, geography, and cultural trivia. Voice your answers quickly to unlock bonus combo points!",
      previewUrl: "https://framer.com",
    },
  },
];

export default function CategorySection() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [selectedModalCard, setSelectedModalCard] = useState<CategoryCardItem | null>(null);

  return (
    <section
      id="categories"
      className="relative w-full py-20 md:py-28 px-4 overflow-hidden flex flex-col justify-center items-center select-none"
      onClick={() => setActiveCard(null)}
    >
      {/* Background Gambar Bukit: Redup & Matte */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden">
        <Image
          src="/categories-bg.png"
          alt="Hill Background"
          fill
          priority
          className="object-cover object-center brightness-[0.78] contrast-[0.9] saturate-[0.88]"
        />
        <div className="absolute inset-0 bg-[#1e293b]/10 mix-blend-multiply" />
      </div>

      <div className="relative w-full max-w-[1240px] flex flex-col items-center z-20">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 md:mb-20 relative select-none pt-4">
          <div className="relative inline-block">
            {/* Tag Badge Category */}
            <div className="w-[104px] md:w-[118px] h-[48px] md:h-[54px] absolute -top-11 left-80 -translate-x-1/2 md:translate-x-0 md:left-[-45px] md:-top-10 rotate-[12deg] md:-rotate-[12deg] z-30 pointer-events-none select-none scale-90 md:scale-100">
              <div className="flex py-[2px] md:py-[3px] px-2 justify-center items-center gap-[3px] rounded-[5.2px] bg-[#E5F2FA] shadow-[0_0_7px_0_rgba(0,0,0,0.06)] w-full h-[30px] md:h-[34px] absolute left-0 top-4 md:top-5 overflow-hidden">
                <div className="flex flex-col items-center shrink-0 w-[80px] md:w-[98px]">
                  <p className="text-[#212121] font-plusJakartaSans text-[11px] md:text-[13px] font-semibold leading-[15.62px] w-fit">
                    Categories
                  </p>
                </div>
              <Image
                src="/paper-blue2.png"
                alt="Paper Blue"
                width={13}
                height={13}
                className="absolute -right-px -top-0.5"
              />
            </div>

            {/* Circle Icon Badge */}
            <div className="flex justify-center items-center rounded-full bg-[#039CFB] shadow-[-1.4px_2.1px_1.4px_0_rgba(0,0,0,0.24)] w-[26px] h-[26px] md:w-[29px] md:h-[29px] absolute left-1 top-px border-[0.93px] border-[#FFF]">
              <HugeiconsIcon
                icon={Grid02Icon}
                size={14}
                className="text-white shrink-0"
              />
            </div>
          </div>

          <h2 className="text-[#252525] font-monaSans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-center leading-tight">
            CHOOSE WHAT YOU KNOW
          </h2>
        </div>
      </div>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-16 w-full max-w-[720px] justify-items-center">
        {CATEGORIES.map((item, index) => {
          const isActive = activeCard === item.id;
          const isLast = index === 2;

          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveCard(item.id);
                setSelectedModalCard(item);
              }}
              className={`group relative cursor-pointer transition-all duration-300 w-[305px] h-[275px] rounded-[16px] bg-white border border-white/90 p-1 flex flex-col justify-between shadow-[0_14px_30px_rgba(0,0,0,0.2)] ${item.tilt
                } ${isLast ? "md:col-span-2 md:justify-self-center -translate-y-2" : ""
                } ${isActive
                  ? "scale-105 z-30 shadow-[0_22px_44px_rgba(0,0,0,0.3)]"
                  : "hover:shadow-[0_18px_36px_rgba(0,0,0,0.25)]"
                }`}
            >
              {/* Paperclip */}
              <div className="absolute -top-3.5 right-12 w-6 h-10 pointer-events-none z-30 select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] -rotate-[30deg]">
                <svg viewBox="0 0 24 40" fill="none" className="w-full h-full">
                  <path
                    d="M7 10V27C7 29.5 9 31.5 11.5 31.5C14 31.5 16 29.5 16 27V7C16 4.5 14 2.5 11.5 2.5C9 2.5 7 4.5 7 7V25C7 26.5 8 27.5 9.5 27.5C11 27.5 12 26.5 12 25V10"
                    stroke="#4B91E2"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Background Garis Gelombang Halus */}
              <div className="absolute inset-0 pointer-events-none select-none z-0 opacity-15 overflow-hidden rounded-[16px]">
                <svg viewBox="0 0 295 262" fill="none" className="w-full h-full">
                  <path d="M-20 80 C60 120, 100 200, 110 280" stroke="#38BDF8" strokeWidth="1.2" />
                  <path d="M100 -20 C110 40, 180 80, 310 50" stroke="#38BDF8" strokeWidth="1.2" />
                  <path d="M220 280 C230 220, 280 200, 320 210" stroke="#38BDF8" strokeWidth="1.2" />
                </svg>
              </div>

              {/* macOS Dots */}
              <div className="relative z-10 flex items-center gap-1 px-1 pt-1 pb-2 shrink-0">
                <span className="w-[8px] h-[8px] rounded-full bg-[#FD5D5C] inline-block shadow-sm" />
                <span className="w-[8px] h-[8px] rounded-full bg-[#FAC900] inline-block shadow-sm" />
                <span className="w-[8px] h-[8px] rounded-full bg-[#34C75A] inline-block shadow-sm" />
              </div>

              {/* Kontainer Preview Gambar */}
              <div className="relative z-10 w-full h-[200px] rounded-[10px] overflow-hidden border border-black/10 bg-black/5 shadow-inner">
                {/* Gambar: Zoom halus + menggelap perlahan */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-top transition-all duration-300 ease-out group-hover:scale-105 group-hover:brightness-[0.82]"
                />
                {/* Lapisan halus tambahan untuk nuansa sinematik */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors duration-700 pointer-events-none" />
              </div>

              {/* Footer: Title & Tag Badges */}
              <div className="relative z-10 flex items-center justify-between px-1.5 pt-2 pb-0.5 shrink-0">
                <p className="text-[#252525] font-monaSans text-2xl font-bold tracking-tight">
                  {item.title}
                </p>

                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded-[5px] bg-black/[0.04] text-[#444] font-monaSans text-[9px] font-medium tracking-tight">
                    {item.categoryTag}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-[4px] bg-black/[0.04] text-[#444] font-monaSans text-[9px] font-medium tracking-tight">
                    {item.categoryTag2}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-[4px] bg-black/[0.04] text-[#444] font-monaSans text-[9px] font-medium tracking-tight">
                    {item.categoryTag3}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

      {/* Komponen Modal Terpisah */ }
  <CaseStudyModal
    card={selectedModalCard}
    onClose={() => setSelectedModalCard(null)}
  />
    </section >
  );
}