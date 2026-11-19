"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppleHelloEffectEnglish } from "@/components/ui/apple-hello-effect-english";
import {
  BlackFaceSticker,
  BlackCatSticker,
  FaceSticker,
  CuriousGlobeSticker,
  StarBurstSticker,
  PeaceHandSticker,
} from "stick-it-up";

const stickerComponents = [
  { id: "star-burst", Component: StarBurstSticker },
  { id: "curious-globe", Component: CuriousGlobeSticker },
  { id: "peace-hand", Component: PeaceHandSticker },
  { id: "black-cat", Component: BlackCatSticker },
  { id: "face", Component: FaceSticker },
  { id: "black-face", Component: BlackFaceSticker },
];

const scatterZones = [
  { top: [6, 20], left: [10, 22] }, // Kiri atas
  { top: [5, 16], left: [38, 56] }, // Tengah atas
  { top: [8, 22], left: [72, 86] }, // Kanan atas
  { top: [70, 84], left: [6, 22] }, // Kiri bawah
  { top: [74, 86], left: [38, 56] }, // Tengah bawah
  { top: [68, 84], left: [72, 86] }, // Kanan bawah
];

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

type PositionedSticker = {
  id: string;
  Component: (typeof stickerComponents)[number]["Component"];
  top: number;
  left: number;
  rotate: number;
  delay: number;
};

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [placedStickers, setPlacedStickers] = useState<PositionedSticker[]>([]);

  useEffect(() => {
    const shuffledZones = [...scatterZones].sort(() => Math.random() - 0.5);

    const generated = stickerComponents.map((sticker, index) => {
      const zone = shuffledZones[index];
      return {
        ...sticker,
        top: randomBetween(zone.top[0], zone.top[1]),
        left: randomBetween(zone.left[0], zone.left[1]),
        rotate: randomBetween(-24, 24),
        delay: 0.3 + index * 0.28,
      };
    });

    setPlacedStickers(generated);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  const handleHelloComplete = () => {
    setTimeout(() => {
      setIsVisible(false);
      window.dispatchEvent(new Event("splash-complete"));
    }, 800);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-blue-950 via-sky-400 to-white overflow-hidden"
        >
          {placedStickers.map(({ id, Component, top, left, rotate, delay }) => (
            <motion.div
              key={id}
              initial={{ scale: 0, rotate: rotate * 2, opacity: 0 }}
              animate={{ scale: 1, rotate, opacity: 1 }}
              transition={{
                delay,
                type: "spring",
                stiffness: 260,
                damping: 16,
              }}
              style={{ top: `${top}%`, left: `${left}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="scale-75 md:scale-100">
                <Component size={96} peel />
              </div>
            </motion.div>
          ))}

          <AppleHelloEffectEnglish
            className="relative z-10 h-16 md:h-24 text-white drop-shadow-md"
            durationScale={0.85}
            onAnimationComplete={handleHelloComplete}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
