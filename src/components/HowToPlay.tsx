"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon } from "@hugeicons/core-free-icons";

import BowTieDoodle from "@/components/svg/BowTieDoodle";
import DoubleCloudDoodle from "@/components/svg/DoubleCloudDoodle";
import PaperPlaneDoodle from "@/components/svg/PaperPlaneDoodle";
import SmileDoodle from "@/components/svg/SmileDoodle";
import SpiralDoodle from "@/components/svg/SpiralDoodle";
import StarDoodle from "@/components/svg/StarDoodle";
import WaveDoodle from "@/components/svg/WaveDoodle";
import ZigzagDoodle from "@/components/svg/ZigzagDoodle";

import GridIcon from "@/components/svg/GridIcon";
import VolumeHighIcon from "@/components/svg/VolumeHighIcon";
import Mic01Icon from "@/components/svg/Mic01Icon";
import CpuIcon from "@/components/svg/CpuIcon";
import Trophy01Icon from "@/components/svg/Trophy01Icon";
import { CustomWaveButton } from "@/components/ui/wave-button";

interface StepItem {
  id: string;
  stepNum: string;
  title: string;
  description: string;
  icon: React.ElementType;
  desktopMt: string;
}

const STEPS: StepItem[] = [
  {
    id: "step-1",
    stepNum: "01",
    title: "Select Category",
    description:
      "Choose your favorite quiz topic on the homepage to start an exciting challenge.",
    icon: GridIcon,
    desktopMt: "md:mt-0",
  },
  {
    id: "step-2",
    stepNum: "02",
    title: "Listen to Question",
    description:
      "The AI system will read out the quiz questions clearly via audio.",
    icon: VolumeHighIcon,
    desktopMt: "md:mt-9",
  },
  {
    id: "step-3",
    stepNum: "03",
    title: "Answer by Voice",
    description:
      "Simply speak your answer directly into the microphone without typing.",
    icon: Mic01Icon,
    desktopMt: "md:mt-[72px]",
  },
  {
    id: "step-4",
    stepNum: "04",
    title: "Smart AI Evaluation",
    description:
      "AI instantly and automatically matches the meaning of your answer.",
    icon: CpuIcon,
    desktopMt: "md:mt-[108px]",
  },
  {
    id: "step-5",
    stepNum: "05",
    title: "Earn Points & Rank",
    description:
      "Achieve high scores, build your combo streak, and dominate the leaderboard!",
    icon: Trophy01Icon,
    desktopMt: "md:mt-[144px]",
  },
];

export default function HowToPlay() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  // Derajat kemiringan rotasi kartu (tetap aktif di mobile & desktop)
  const cardRotations = [-5, 3.5, -4, 4.5, -2.5];

  return (
    <section
      id="how-to-play"
      className="relative w-full pt-20 pb-32 md:pt-28 md:pb-48 px-4 overflow-hidden flex flex-col justify-center items-center"
      onClick={() => setActiveStep(null)}
    >
      <div className="absolute inset-0 bg-[url('/garis-kotak.png')] bg-repeat bg-top pointer-events-none -z-10 opacity-70" />

      {/* Decorative SVG Doodles */}
      <SmileDoodle className="hidden md:block w-14 h-10 text-yellow-400 absolute top-12 left-10 -rotate-12 pointer-events-none z-10" />
      <PaperPlaneDoodle className="hidden md:block w-18 h-12 text-violet-400 absolute top-32 right-12 rotate-45 pointer-events-none z-10" />
      <StarDoodle className="absolute top-10 right-6 md:top-20 md:left-1/4 w-12 h-12 text-amber-400 rotate-12 pointer-events-none z-10" />
      <SpiralDoodle className="hidden md:block w-18 h-18 text-[#75C4AA] absolute top-[42%] left-6 -rotate-12 pointer-events-none z-10" />
      <DoubleCloudDoodle className="hidden md:block w-24 h-12 text-pink-400 absolute top-[58%] right-8 rotate-12 pointer-events-none z-10" />
      <WaveDoodle className="hidden md:block w-28 h-14 text-sky-400 absolute bottom-32 left-12 -rotate-6 pointer-events-none z-10" />
      <BowTieDoodle className="absolute bottom-6 right-6 w-16 h-12 text-lime-400 rotate-12 pointer-events-none z-10" />
      <ZigzagDoodle className="hidden md:block w-20 h-8 text-indigo-400 absolute bottom-10 left-1/3 -rotate-12 pointer-events-none z-10" />

      {/* Decorative Assets */}
      <Image
        src="/plane.png"
        alt="Plane"
        width={85}
        height={85}
        className="absolute top-12 left-4 md:top-16 md:left-20 -rotate-12 pointer-events-none select-none z-10 mix-blend-multiply"
      />
      <Image
        src="/dinosour.png"
        alt="Dino"
        width={90}
        height={90}
        className="absolute bottom-8 right-4 md:bottom-16 md:right-16 rotate-6 pointer-events-none select-none z-10 mix-blend-multiply"
      />

      <div className="relative w-full max-w-[1360px] flex flex-col items-center z-20">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-10 md:mb-14 relative select-none pt-4">
          <div className="relative inline-block">
            {/* Tag Rules: Skala pas di mobile, tidak menutupi huruf "HOW" */}
            <div className="w-[88px] sm:w-[96px] md:w-[113px] h-[42px] sm:h-[46px] md:h-[54px] absolute -top-9 -left-2 sm:-top-9 sm:-left-4 md:-top-11 md:-left-12 -rotate-[10deg] md:-rotate-[12deg] z-30 pointer-events-none select-none scale-75 sm:scale-85 md:scale-100 origin-bottom-right">
              {/* Box Tag */}
              <div className="flex py-[2px] md:py-[3px] px-1.5 md:px-2 justify-center items-center gap-[3px] rounded-[5.2px] bg-[#E8F3FA] shadow-[0_0_7px_0_rgba(0,0,0,0.06)] w-full h-[26px] sm:h-[28px] md:h-[34px] absolute left-0 top-3.5 sm:top-4 md:top-5 overflow-hidden">
                <div className="flex flex-col items-center shrink-0 w-[68px] sm:w-[76px] md:w-[98px]">
                  <p className="text-[#212121] font-plusJakartaSans text-[10px] sm:text-[11px] md:text-[13px] font-semibold leading-tight w-fit">
                    Rules
                  </p>
                </div>
                <Image
                  src="/paper-blue.png"
                  alt="Clip"
                  width={11}
                  height={11}
                  className="absolute -right-px -top-0.5"
                />
              </div>

              {/* Circle Icon Badge */}
              <div className="flex justify-center items-center rounded-full bg-[#0088FF] shadow-[-1.4px_2.1px_1.4px_0_rgba(0,0,0,0.24)] w-5 h-5 sm:w-6 sm:h-6 md:w-[29px] md:h-[29px] absolute left-1 top-px border-[0.93px] border-[#FFF]">
                <HugeiconsIcon
                  icon={Book02Icon}
                  size={11}
                  className="text-white shrink-0 sm:hidden"
                />
                <HugeiconsIcon
                  icon={Book02Icon}
                  size={13}
                  className="text-white shrink-0 hidden sm:block md:hidden"
                />
                <HugeiconsIcon
                  icon={Book02Icon}
                  size={15}
                  className="text-white shrink-0 hidden md:block"
                />
              </div>
            </div>

            <h2 className="text-[#0D121C] font-monaSans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-center leading-tight">
              HOW TO PLAY VOXIQ®
            </h2>
          </div>

          <p className="text-gray-600 font-medium text-sm md:text-base mt-2 text-center max-w-[500px]">
            Follow these simple steps to get started with VOXIQ® and enjoy a seamless quiz experience.
          </p>

          {/* Aksesoris Badge Start Quiz */}
          <div className="mt-4 px-4 py-1.5 rotate-[3deg] relative">
            <Image
              src="/pin.png"
              alt="Pin"
              width={16}
              height={16}
              className="absolute -top-0 right-2 mix-blend-multiply z-10"
            />
            <CustomWaveButton size="sm">
              Start Quiz
            </CustomWaveButton>
          </div>
        </div>

        {/* Step Cards Container */}
        {/* Step Cards Container: Muat Pas di Layar Desktop Tanpa Kepotong */}
        <div className="w-full flex justify-center pb-16 pt-4 px-4 overflow-visible">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-9 md:gap-0 w-full max-w-[1180px]">
            {STEPS.map((step, idx) => {
              const rotate = cardRotations[idx % cardRotations.length];
              const isActive = activeStep === step.id;
              const IconComponent = step.icon;

              return (
                <div
                  key={step.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStep(step.id);
                  }}
                  style={{
                    transform: `rotate(${rotate}deg)`,
                    zIndex: isActive ? 50 : idx + 1,
                  }}
                  className={`group relative cursor-pointer select-none transition-all duration-300 ${step.desktopMt} ${idx > 0 ? "md:-ml-14 lg:-ml-16" : ""
                    } ${isActive
                      ? "!z-50 scale-105 rotate-0 -translate-y-3"
                      : "hover:!z-50 hover:scale-105 hover:rotate-0 hover:-translate-y-3"
                    }`}
                >
                  {/* Shadow Layer Tebal di Bawah (Offset Kanan-Bawah Khas Kertas) */}
                  <div className="absolute inset-0 bg-[#000000]/[0.08] rounded-[24px] md:rounded-[28px] translate-x-2.5 translate-y-2.5 pointer-events-none -z-10 transition-transform duration-300 group-hover:translate-x-3.5 group-hover:translate-y-3.5" />

                  {/* Card Utama: Proporsi Landscape Pas Layar */}
                  <div className="relative rounded-[22px] md:rounded-[26px] bg-white p-5 md:p-5 lg:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/90 w-[290px] sm:w-[310px] md:w-[270px] lg:w-[290px] h-[175px] md:h-[180px] lg:h-[190px] flex flex-col justify-between ">
                    {/* Pin Hiasan Kiri Atas */}
                    <Image
                      src="/pin.png"
                      alt="Pin"
                      width={18}
                      height={18}
                      className="absolute -top-3 left-3 select-none pointer-events-none mix-blend-multiply z-30 group-hover:scale-110 transition-transform"
                    />

                    {/* Lipatan Sudut Kanan Atas (Tape) */}
                    <div className="absolute -top-2 -right-2 w-14 h-14 md:w-16 md:h-16 pointer-events-none z-20 select-none">
                      <Image
                        src="/Container(4).png"
                        alt="Corner Tape"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain object-top-right select-none"
                      />
                    </div>

                    {/* Konten Card */}
                    <div className="flex flex-col h-full justify-center pl-1 pr-1.5 pt-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-[#0D121C] group-hover:bg-[#0D121C] group-hover:text-white transition-colors duration-300 shrink-0">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase">
                          STEP {step.stepNum}
                        </span>
                      </div>

                      <h3 className="text-[#0D121C] font-monaSans text-sm md:text-[15px] lg:text-base font-bold tracking-tight leading-snug">
                        {step.title}
                      </h3>

                      <p className="text-gray-500 font-inter text-[11px] lg:text-xs leading-relaxed mt-1 line-clamp-3">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}