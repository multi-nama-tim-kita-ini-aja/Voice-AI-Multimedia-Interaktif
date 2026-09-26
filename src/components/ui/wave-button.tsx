"use client";

import React from "react";

interface WaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  size?: "default" | "sm";
}

export function CustomWaveButton({
  children = "Start Quiz",
  className = "",
  size = "default",
  ...props
}: WaveButtonProps) {
  const isSm = size === "sm";

  return (
    <>
      <style jsx>{`
        .wave-layer {
          position: absolute;
          left: 50%;
          bottom: 0;
          border-radius: 9999px;
          transform: translate(-50%, 100%);
          transition: transform 1.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .group:hover .wave-yellow {
          transform: translate(-50%, 18%);
        }

        .group:hover .wave-mint {
          transform: translate(-50%, 28%);
          transition-delay: 0.12s;
        }

        .group:hover .wave-coral {
          transform: translate(-50%, 38%);
          transition-delay: 0.24s;
        }
      `}</style>

      <button
        className={`group relative overflow-hidden rounded-full bg-white font-inter font-semibold tracking-tight shadow-[0_4px_14px_rgba(0,0,0,0.08)] active:scale-95 border-0 cursor-pointer select-none transition-all [transform:translateZ(0)] ${
          isSm
            ? "h-10 px-6 text-xs md:text-sm"
            : "h-14 px-10 text-lg shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
        } ${className}`}
        {...props}
      >
        {/* Layer 1: Kuning */}
        <span
          className={`wave-layer wave-yellow bg-[#F5C77E] ${
            isSm ? "w-[200px] h-[200px]" : "w-[260px] h-[260px]"
          }`}
        />

        {/* Layer 2: Hijau Mint */}
        <span
          className={`wave-layer wave-mint bg-[#75C4AA] ${
            isSm ? "w-[170px] h-[170px]" : "w-[220px] h-[220px]"
          }`}
        />

        {/* Layer 3: Merah Coral */}
        <span
          className={`wave-layer wave-coral bg-[#E36961] ${
            isSm ? "w-[140px] h-[140px]" : "w-[180px] h-[180px]"
          }`}
        />

        {/* Text Rolling */}
        <span
          className={`relative z-10 block overflow-hidden pointer-events-none ${
            isSm ? "h-5" : "h-6"
          }`}
        >
          <span
            className={`flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isSm ? "group-hover:-translate-y-5" : "group-hover:-translate-y-6"
            }`}
          >
            <span
              className={`flex items-center justify-center text-[#1A1A1A] ${
                isSm ? "h-5" : "h-6"
              }`}
            >
              {children}
            </span>
            <span
              className={`flex items-center justify-center text-white font-semibold ${
                isSm ? "h-5" : "h-6"
              }`}
            >
              {children}
            </span>
          </span>
        </span>
      </button>
    </>
  );
}