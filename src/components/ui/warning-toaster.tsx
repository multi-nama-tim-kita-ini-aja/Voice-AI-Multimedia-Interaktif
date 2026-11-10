"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";

interface WarningToastProps {
  id: string | number;
  title?: string;
  message?: string;
  duration?: number;
}

export function WarningToast({
  id,
  title = "Microphone Required",
  message = "Please enable your microphone first",
  duration = 3500,
}: WarningToastProps) {
  return (
    <div className="relative flex w-[calc(100vw-32px)] max-w-[320px] sm:w-[280px] items-center justify-between rounded-[16px] sm:rounded-[18px] bg-white/95 backdrop-blur-md border border-black/[0.08] px-3 sm:px-3 py-2 sm:py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden select-none mx-auto">
      {/* Soft Yellow Glow di area kiri icon */}
      <div className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-amber-400/25 blur-lg" />

      {/* Bagian Kiri: Icon + Teks */}
      <div className="relative z-10 flex items-center gap-2.5 min-w-0 pr-2">
        {/* Lingkaran Icon Compact */}
        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
          <svg
            className="w-3.5 h-3.5 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Info Text */}
        <div className="flex flex-col min-w-0">
          <h4 className="text-[12px] font-semibold text-[#18181b] tracking-tight leading-none truncate">
            {title}
          </h4>
          <p className="text-[10px] sm:text-[10.5px] text-[#71717a] leading-tight mt-1 truncate">
            {message}
          </p>
        </div>
      </div>

      {/* Tombol Close (x) */}
      <button
        type="button"
        onClick={() => toast.dismiss(id)}
        className="relative z-10 text-[#a1a1aa] hover:text-[#52525b] transition-colors p-1.5 cursor-pointer shrink-0 text-[11px] leading-none active:scale-95"
      >
        ✕
      </button>

      {/* Progress Bar Garis Waktu */}
      <div className="absolute bottom-0 left-0 h-[1.5px] w-full bg-black/[0.04]">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className="h-full bg-amber-400"
        />
      </div>
    </div>
  );
}

export const showWarningToast = (
  title?: string,
  message?: string,
  duration = 3500,
) => {
  toast.custom(
    (id) => (
      <WarningToast
        id={id}
        title={title}
        message={message}
        duration={duration}
      />
    ),
    { duration },
  );
};
