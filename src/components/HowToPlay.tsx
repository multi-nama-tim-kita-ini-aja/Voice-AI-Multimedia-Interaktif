"use client";

import { useState } from "react";
import Image from "next/image";

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

interface StepItem {
  id: string;
  stepNum: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  {
    id: "step-1",
    stepNum: "01",
    title: "Select Category",
    description:
      "Choose your favorite quiz topic on the homepage to start an exciting challenge.",
    icon: GridIcon,
  },
  {
    id: "step-2",
    stepNum: "02",
    title: "Listen to Question",
    description:
      "The AI system will read out the quiz questions clearly via audio.",
    icon: VolumeHighIcon,
  },
  {
    id: "step-3",
    stepNum: "03",
    title: "Answer by Voice",
    description:
      "Simply speak your answer directly into the microphone without typing.",
    icon: Mic01Icon,
  },
  {
    id: "step-4",
    stepNum: "04",
    title: "Smart AI Evaluation",
    description:
      "AI instantly and automatically matches the meaning of your answer.",
    icon: CpuIcon,
  },
  {
    id: "step-5",
    stepNum: "05",
    title: "Earn Points & Rank",
    description:
      "Achieve high scores, build your combo streak, and dominate the leaderboard!",
    icon: Trophy01Icon,
  },
];

export default function HowToPlay() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  // Rotation angles for layout variation
  const cardRotations = [-5, 3.5, -4, 4.5, -2.5];

  return (
    <section
      id="how-to-play"
      className="relative w-full pt-20 pb-32 md:pt-28 md:pb-40 px-4 overflow-hidden flex flex-col justify-center items-center"
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

      <div className="relative w-full max-w-[1280px] flex flex-col items-center z-20">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-6 md:mb-8 relative select-none pt-4">
          <div className="relative inline-block">
            {/* Tag Rules: Dibuat persis dengan style Tag FAQs */}
            <div className="absolute -top-3 -left-5 md:-top-4 md:-left-9 z-30 flex items-center gap-2 pl-1 pr-3.5 py-1 bg-[#E8F5E9] border border-white/80 shadow-md rounded-2xl -rotate-[16deg] origin-bottom-left pointer-events-none">
              {/* Pin Hiasan */}
              <Image
                src="/pin.png"
                alt="Pin"
                width={16}
                height={16}
                className="absolute -top-2 right-1 mix-blend-multiply z-40"
              />
              {/* Icon Circle */}
              <div className="w-6 h-6 rounded-full bg-[#0088FF] flex items-center justify-center text-white shadow-sm shrink-0">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              {/* Teks Tag */}
              <span className="text-xs md:text-sm font-bold text-[#0D121C] tracking-tight">
                Rules
              </span>
            </div>

            <h2 className="text-[#0D121C] font-monaSans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-center leading-tight">
              HOW TO PLAY VOXIQ®
            </h2>
          </div>

          <p className="text-gray-600 font-medium text-sm md:text-base mt-2 text-center max-w-[500px]">
            Follow these simple steps to get started with VOXIQ® and enjoy a seamless quiz experience.
          </p>

          {/* Aksesoris Badge (Non-clickable) */}
          <div className="mt-4 px-4 py-1.5 bg-white border border-gray-200 shadow-sm rounded-md rotate-[3deg] relative pointer-events-none">
            <Image
              src="/pin.png"
              alt="Pin"
              width={16}
              height={16}
              className="absolute -top-2 right-2 mix-blend-multiply"
            />
            <span className="text-xs font-bold text-gray-700">Start Quiz</span>
          </div>
        </div>

        {/* Step Cards Container */}
        <div className="w-full overflow-x-auto md:overflow-visible pb-8 pt-2 px-2">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center min-w-[920px] md:min-w-0">
            {STEPS.map((step, idx) => {
              const rotate = cardRotations[idx % cardRotations.length];
              const marginTopStep = idx * 32;
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
                    marginTop: `${marginTopStep}px`,
                    zIndex: isActive ? 50 : idx + 1,
                  }}
                  className={`group relative cursor-pointer rounded-[20px] bg-white p-4 lg:p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-200/80 hover:!z-50 hover:scale-105 hover:rotate-0 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 w-[220px] lg:w-[240px] h-[175px] lg:h-[185px] shrink-0 select-none flex flex-col ${
                    idx > 0 ? "-ml-1 md:-ml-2" : ""
                  } ${isActive ? "!z-50 scale-105 rotate-0 shadow-2xl -translate-y-3" : ""}`}
                >
                  <Image
                    src="/pin.png"
                    alt="Pin"
                    width={18}
                    height={18}
                    className="absolute -top-2.5 left-3.5 select-none pointer-events-none mix-blend-multiply z-30 group-hover:scale-110 transition-transform"
                  />

                  <div className="absolute top-0 right-0 w-9 h-9 pointer-events-none z-20 overflow-hidden rounded-tr-[20px]">
                    <Image
                      src="/Container(4).png"
                      alt="Corner Tape"
                      width={36}
                      height={36}
                      className="w-full h-full object-cover select-none"
                    />
                  </div>

                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2 pt-0.5">
                      <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[#0D121C] group-hover:bg-[#0D121C] group-hover:text-white transition-colors duration-300 shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase">
                        STEP {step.stepNum}
                      </span>
                    </div>

                    <h3 className="text-[#0D121C] font-monaSans text-xs md:text-sm lg:text-base font-bold tracking-tight leading-snug">
                      {step.title}
                    </h3>

                    <p className="text-gray-500 font-inter text-[11px] lg:text-xs leading-relaxed mt-1">
                      {step.description}
                    </p>
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