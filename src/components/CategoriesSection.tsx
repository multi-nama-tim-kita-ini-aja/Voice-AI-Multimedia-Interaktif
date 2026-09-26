"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

import StarDoodle from "@/components/svg/StarDoodle";
import WaveDoodle from "@/components/svg/WaveDoodle";
import SpiralDoodle from "@/components/svg/SpiralDoodle";
import ZigzagDoodle from "@/components/svg/ZigzagDoodle";
import PaperPlaneDoodle from "@/components/svg/PaperPlaneDoodle";
import AbstractCloudDoodle from "@/components/svg/AbstractCloudDoodle";
import AbstractSwirlDoodle from "@/components/svg/AbstractSwirlDoodle";
import AbstractLightningDoodle from "@/components/svg/AbstractLightningDoodle";
import InteractiveCrossedEyes from "@/components/InteractiveCrossedEyes";

interface CategoriesSectionProps {
  onSelectCategory?: (id: string) => void;
}

interface CategoryItem {
  id: string;
  label: string;
  badgeText: string;
  badgeBg: string;
  badgeColor: string;
  bgImage: string;
  photo: string;
  accentBorder: string;
  // Posisi fan-out di desktop
  desktopPos: { x: number; y: number; rotate: number };
  // Posisi fan-out di mobile
  mobilePos: { x: number; y: number; rotate: number };
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "english",
    label: "ENGLISH",
    badgeText: "Language",
    badgeBg: "bg-[#F4EAF5]",
    badgeColor: "text-[#EC68FD]",
    bgImage: "/cardenglish.png",
    photo: "/photo-english.png",
    accentBorder: "border-[#EC68FD]",
    desktopPos: { x: 0, y: -120, rotate: 3 },
    mobilePos: { x: 0, y: -110, rotate: 4 },
  },
  {
    id: "ips",
    label: "IPS",
    badgeText: "Social",
    badgeBg: "bg-[#F4F8E8]",
    badgeColor: "text-[#93BA06]",
    bgImage: "/cardips.png",
    photo: "/photo-ips.png",
    accentBorder: "border-[#93BA06]",
    desktopPos: { x: -260, y: 35, rotate: -8 },
    mobilePos: { x: -70, y: 30, rotate: -9 },
  },
  {
    id: "matematika",
    label: "MATEMATIKA",
    badgeText: "Science",
    badgeBg: "bg-[#E5F2FA]",
    badgeColor: "text-[#039CFB]",
    bgImage: "/cardmatematika.png",
    photo: "/photo-matematika.png",
    accentBorder: "border-[#039CFB]",
    desktopPos: { x: 260, y: 55, rotate: 9 },
    mobilePos: { x: 70, y: 65, rotate: 9 },
  },
];

export default function CategoriesSection({ onSelectCategory }: CategoriesSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isExpanded = isHovered || isMobileExpanded;

  const handleSelect = (id: string) => {
    setSelectedCategory(id);
    console.log("Selected category:", id);
    // TODO: wire ke halaman/logic mulai quiz nanti
    if (onSelectCategory) {
      onSelectCategory(id);
    }
  };

  const toggleMobileExpand = () => {
    setIsMobileExpanded((prev) => !prev);
  };

  return (
    <section
      id="categories"
      className="relative w-full min-h-screen py-16 md:py-24 px-4 overflow-hidden flex flex-col justify-center items-center select-none"
    >
      {/* Background Image (Persis seperti HeroSection) */}
      <Image
        src="/categories-bg2.png"
        alt="Categories Background"
        fill
        priority
        className="object-cover -z-10"
      />

      {/* Doodles Dekoratif (hidden md:block) */}
      <StarDoodle className="hidden md:block w-20 h-20 text-yellow-400 absolute top-16 left-20 -rotate-12 pointer-events-none z-10" />
      <WaveDoodle className="hidden md:block w-24 h-12 text-sky-400 absolute top-28 right-24 rotate-6 pointer-events-none z-10" />
      <PaperPlaneDoodle className="hidden md:block w-16 h-12 text-white/90 absolute bottom-32 left-28 -rotate-12 pointer-events-none z-10" />
      <SpiralDoodle className="hidden md:block w-20 h-20 text-lime-400 absolute bottom-24 right-32 rotate-45 pointer-events-none z-10" />
      <ZigzagDoodle className="hidden md:block w-20 h-10 text-violet-400 absolute top-1/2 right-12 -rotate-12 pointer-events-none z-10" />

      {/* Abstract SVGs tambahan */}
      <AbstractCloudDoodle className="hidden md:block w-28 h-22 text-[#EC68FD]/80 absolute top-24 left-10 -rotate-6 pointer-events-none z-10" />
      <AbstractSwirlDoodle className="hidden md:block w-36 h-20 text-amber-300/85 absolute bottom-16 left-14 rotate-12 pointer-events-none z-10" />
      <AbstractLightningDoodle className="hidden md:block w-14 h-24 text-[#93BA06]/85 absolute top-36 right-16 rotate-12 pointer-events-none z-10" />

      {/* Header Content */}
      <div className="flex flex-col justify-center items-center gap-3 z-20 mb-12 md:mb-20 text-center max-w-[700px]">
        {/* Category Header Badge */}
        <div className="relative inline-flex items-center justify-center mb-1">
          <div className="flex py-1 px-3.5 justify-center items-center gap-2 rounded-[8px] bg-white/90 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/80 -rotate-2">
            <HugeiconsIcon icon={GridIcon} size={16} className="text-[#212121]" />
            <p className="text-[#212121] font-plusJakartaSans text-xs md:text-sm font-bold tracking-tight">
              GAME MODES
            </p>
          </div>
        </div>

        {/* Main Title */}
        <h2 className="text-[#FFF] font-monaSans text-[36px] sm:text-[48px] md:text-[56px] font-extrabold leading-[1.05] tracking-[-0.04em] drop-shadow-md">
          CHOOSE YOUR CATEGORY
        </h2>
        <p className="text-white/90 font-inter text-sm md:text-base font-medium tracking-tight max-w-[480px]">
          Hover or tap the window below to reveal available quiz categories & pick your challenge!
        </p>
      </div>

      {/* Interactive Window Picker Area */}
      <div
        className="relative w-full max-w-[1000px] h-[420px] md:h-[480px] flex items-center justify-center z-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* State 1: IDLE Window (Cover card "CATEGORY") */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.button
              type="button"
              onClick={toggleMobileExpand}
              aria-label="Buka pilihan kategori kuis"
              initial={{ scale: 0.9, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: -6 }}
              exit={{ scale: 0.85, opacity: 0, rotate: -12 }}
              whileHover={{ scale: 1.04, rotate: -4 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="absolute w-[240px] sm:w-[270px] md:w-[300px] h-[200px] sm:h-[220px] md:h-[240px] rounded-2xl bg-white shadow-[6px_6px_0_0_rgba(0,0,0,0.12)] md:shadow-[8px_8px_0_0_rgba(0,0,0,0.15)] border border-black/10 flex flex-col overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-white z-30"
            >
              {/* macOS Titlebar Header */}
              <div className="w-full h-8 sm:h-9 md:h-10 bg-neutral-100/90 border-b border-black/5 flex items-center px-3.5 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-inner" />
                <span className="ml-auto text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-widest">
                  VoxIQ macOS
                </span>
              </div>

              {/* Window Body */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-white to-neutral-50/50">
                <p className="text-[#212121] font-monaSans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.04em] uppercase">
                  CATEGORY
                </p>
                <div className="mt-4 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-semibold font-inter animate-pulse">
                  Hover / Tap to Expand ✨
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* State 2 & 3: FAN-OUT Cards (Categories Options) */}
        <AnimatePresence>
          {isExpanded && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Mata Interaktif Juling (Muncul tepat di tengah gap kartu saat hover/expand) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="hidden md:flex absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
              >
                <InteractiveCrossedEyes size={48} />
              </motion.div>

              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category.id;

                return (
                  <motion.button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelect(category.id)}
                    aria-label={`Pilih kategori ${category.label}`}
                    initial={{ scale: 0.5, opacity: 0, x: 0, y: 0, rotate: 0 }}
                    animate={{
                      scale: isSelected ? 1.08 : 1,
                      opacity: 1,
                      x: typeof window !== "undefined" && window.innerWidth < 768
                        ? category.mobilePos.x
                        : category.desktopPos.x,
                      y: typeof window !== "undefined" && window.innerWidth < 768
                        ? category.mobilePos.y
                        : category.desktopPos.y,
                      rotate: isSelected ? 0 : (
                        typeof window !== "undefined" && window.innerWidth < 768
                          ? category.mobilePos.rotate
                          : category.desktopPos.rotate
                      ),
                    }}
                    exit={{ scale: 0.5, opacity: 0, x: 0, y: 0, rotate: 0 }}
                    whileHover={{ scale: isSelected ? 1.12 : 1.06, zIndex: 40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={`absolute w-[260px] sm:w-[280px] md:w-[300px] h-[300px] sm:h-[320px] md:h-[340px] rounded-2xl bg-white flex flex-col overflow-hidden cursor-pointer text-left transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-white z-20 ${isSelected
                      ? `ring-4 ring-offset-2 ${category.accentBorder} shadow-[10px_10px_0_0_rgba(0,0,0,0.2)] border-2`
                      : "shadow-[6px_6px_0_0_rgba(0,0,0,0.12)] md:shadow-[8px_8px_0_0_rgba(0,0,0,0.15)] border border-black/10 hover:shadow-[10px_10px_0_0_rgba(0,0,0,0.18)]"
                      }`}
                  >
                    {/* LAYER -10: Background Skin (cardenglish.png / cardips.png / cardmatematika.png) */}
                    <Image
                      src={category.bgImage}
                      alt={`${category.label} skin`}
                      fill
                      priority
                      className="object-cover -z-10 rounded-2xl"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />

                    {/* LAYER z-20: macOS Titlebar Header */}
                    <div className="w-full h-7 sm:h-8 bg-white/80 backdrop-blur-sm border-b border-black/5 flex items-center px-3.5 gap-1.5 shrink-0 justify-between z-20">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                          <span>SELECTED</span>
                        </div>
                      )}
                    </div>

                    {/* LAYER z-20: Card Body Content */}
                    <div className="relative flex-1 flex flex-col items-center justify-between p-2.5 sm:p-3 text-center overflow-hidden z-20">
                      {/* Badge Tag Kategori */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-plusJakartaSans ${category.badgeBg} ${category.badgeColor}`}>
                        {category.badgeText}
                      </span>

                      {/* Slot Foto Tematik */}
                      <div className="relative w-full max-w-[250px] h-[135px] sm:h-[150px] md:h-[160px] rounded-xl overflow-hidden border border-black/10 shadow-sm bg-neutral-100/80 z-20 shrink-0 my-1">
                        <Image
                          src={category.photo}
                          alt={`${category.label} photo`}
                          fill
                          sizes="250px"
                          className="object-cover"
                        />
                      </div>

                      {/* Label Kategori */}
                      <p className="text-[#212121] font-monaSans text-lg sm:text-xl md:text-2xl font-extrabold tracking-[-0.03em] uppercase">
                        {category.label}
                      </p>

                      {/* Teks Instruksi */}
                      <p className="text-[10px] sm:text-[11px] text-neutral-500 font-inter">
                        {isSelected ? "Tap again to confirm" : "Click to select"}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
