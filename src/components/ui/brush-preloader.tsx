"use client";

import { motion } from "framer-motion";

interface BrushPreloaderProps {
  onComplete?: () => void;
}

export default function BrushPreloader({ onComplete }: BrushPreloaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-transparent pointer-events-none select-none overflow-hidden"
    >
      {/* Kontainer Animasi Kuas Bergerak */}
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{
          scale: [1, 1, 1.15, 22], // Membesar drastis di akhir untuk menyapu layar
          rotate: [0, -2, 2, 0],
        }}
        transition={{
          duration: 1.5,
          times: [0, 0.45, 0.7, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
        onAnimationComplete={() => {
          if (onComplete) onComplete();
        }}
        className="relative w-[340px] sm:w-[460px] h-[240px] sm:h-[300px] flex items-center justify-center"
      >
        <svg
          viewBox="0 0 500 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.18)]"
        >
          {/* Garis Coretan Gelombang Kuas Hitam */}
          <motion.path
            d="M 50 180 C 90 230, 110 70, 160 180 C 200 240, 240 80, 290 190 C 330 250, 390 100, 440 140"
            stroke="#fff"
            strokeWidth="58"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 1.0,
              ease: "easeInOut",
            }}
          />

          {/* Titik Tetesan Cairan Atas */}
          <motion.circle
            cx="175"
            cy="115"
            r="14"
            fill="#1c1c1e"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ delay: 0.35, duration: 0.3, ease: "easeOut" }}
          />

          {/* Titik Tetesan Cairan Bawah */}
          <motion.circle
            cx="305"
            cy="125"
            r="16"
            fill="#1c1c1e"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ delay: 0.55, duration: 0.3, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}