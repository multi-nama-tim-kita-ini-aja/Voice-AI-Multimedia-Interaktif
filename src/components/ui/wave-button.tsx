"use client";

import React from "react";

interface WaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
}

export function CustomWaveButton({
    children = "Start Quiz",
    className = "",
    ...props
}: WaveButtonProps) {
    return (
        <>
            <style jsx>{`
        /* Posisi awal: busur tenggelam di bawah tombol */
        .wave-layer {
          position: absolute;
          left: 50%;
          bottom: 0;
          border-radius: 9999px;
          transform: translate(-50%, 100%);
          transition: transform 1.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        /* Saat di-hover: naik pelan bertingkat membentuk kubah setengah lingkaran */
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
                className={`group relative overflow-hidden h-14 px-10 rounded-full bg-white font-inter text-lg font-semibold tracking-tight shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-95 border-0 cursor-pointer select-none ${className}`}
                {...props}
            >
                {/* Layer 1: Kuning (Lengkungan terluar di atas) */}
                <span className="wave-layer wave-yellow w-[260px] h-[260px] bg-[#F5C77E]" />

                {/* Layer 2: Hijau Mint */}
                <span className="wave-layer wave-mint w-[220px] h-[220px] bg-[#75C4AA]" />

                {/* Layer 3: Merah Coral (Kubah inti penopang teks) */}
                <span className="wave-layer wave-coral w-[180px] h-[180px] bg-[#E36961]" />

                {/* Text Rolling: Bergulir naik santai mengikuti gelombang */}
                <span className="relative z-10 block h-6 overflow-hidden pointer-events-none">
                    <span className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-6">
                        <span className="h-6 flex items-center justify-center text-[#1A1A1A]">
                            {children}
                        </span>
                        <span className="h-6 flex items-center justify-center text-white font-semibold">
                            {children}
                        </span>
                    </span>
                </span>
            </button>
        </>
    );
}