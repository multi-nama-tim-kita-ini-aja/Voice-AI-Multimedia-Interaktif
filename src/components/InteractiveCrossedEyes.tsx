"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface EyeProps {
  size: number;
  isBlinking: boolean;
  isCrossed?: boolean;
}

function Eye({ size, isBlinking, isCrossed = false }: EyeProps) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;

      // Jika eyeIsCrossed (mata juling), arahkan pupil berlawanan secara horizontal / offset ke dalam
      const effectiveX = isCrossed ? -deltaX * 0.85 : deltaX;
      const angle = Math.atan2(deltaY, effectiveX);
      const distance = Math.hypot(deltaX, deltaY);

      const maxDistance = size * 0.24;
      const currentDistance = Math.min(distance, maxDistance);

      setPupilPos({
        x: Math.cos(angle) * currentDistance,
        y: Math.sin(angle) * currentDistance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size, isCrossed]);

  const pupilSize = size * 0.44;

  return (
    <div
      ref={eyeRef}
      style={{ width: size, height: size }}
      className="relative rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden border border-black/10"
    >
      <motion.div
        animate={{
          x: pupilPos.x,
          y: pupilPos.y,
          scaleY: isBlinking ? 0.05 : 1,
        }}
        transition={{
          x: { type: "tween", ease: "easeOut", duration: 0.08 },
          y: { type: "tween", ease: "easeOut", duration: 0.08 },
          scaleY: { duration: isBlinking ? 0.08 : 0.14, ease: "easeInOut" },
        }}
        style={{
          width: pupilSize,
          height: pupilSize,
        }}
        className="rounded-full bg-[#121212] origin-center"
      />
    </div>
  );
}

export default function InteractiveCrossedEyes({
  className = "",
  size = 44,
}: {
  className?: string;
  size?: number;
}) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerBlink = () => {
      setIsBlinking(true);

      setTimeout(() => {
        setIsBlinking(false);
      }, 120);

      const nextBlinkDelay = Math.random() * 2500 + 2500;
      timeoutId = setTimeout(triggerBlink, nextBlinkDelay);
    };

    const initialDelay = Math.random() * 2000 + 1500;
    timeoutId = setTimeout(triggerBlink, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Mata Kiri (Normal tracking) */}
      <Eye size={size} isBlinking={isBlinking} isCrossed={false} />
      {/* Mata Kanan (Juling tracking) */}
      <Eye size={size} isBlinking={isBlinking} isCrossed={true} />
    </div>
  );
}
