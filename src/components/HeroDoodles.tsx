"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import StarDoodle from "@/components/svg/StarDoodle";
import WaveDoodle from "@/components/svg/WaveDoodle";
import PaperPlaneDoodle from "@/components/svg/PaperPlaneDoodle";
import SpiralDoodle from "@/components/svg/SpiralDoodle";
import ZigzagDoodle from "@/components/svg/ZigzagDoodle";

type ParallaxDoodleProps = {
  children: React.ReactNode;
  className: string;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  isReady: boolean;
  delay?: number;
  depth?: number;
  tilt?: number;
};

function ParallaxDoodle({
  children,
  className,
  smoothX,
  smoothY,
  isReady,
  delay = 0,
  depth = 30,
  tilt = 18,
}: ParallaxDoodleProps) {
  const x = useTransform(smoothX, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(smoothY, [-0.5, 0.5], [-depth, depth]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [tilt, -tilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-tilt, tilt]);

  return (
    <motion.div
      drag
      dragMomentum={true}
      whileHover={{ scale: 1.08 }}
      whileDrag={{ scale: 1.15, zIndex: 50 }}
      initial={{ scale: 0, opacity: 0, rotate: -15 }}
      animate={
        isReady
          ? { scale: 1, opacity: 1, rotate: 0 }
          : { scale: 0, opacity: 0, rotate: -15 }
      }
      transition={{
        delay,
        type: "spring",
        stiffness: 260,
        damping: 18,
      }}
      className={`${className} cursor-grab active:cursor-grabbing select-none touch-none`}
    >
      <motion.div
        style={{
          x,
          y,
          rotateX,
          rotateY,
          transformPerspective: 600,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function HeroDoodles({ isReady }: { isReady: boolean }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <ParallaxDoodle
        smoothX={smoothX}
        smoothY={smoothY}
        isReady={isReady}
        delay={0.25}
        depth={35}
        tilt={20}
        className="hidden md:block absolute top-20 left-40 z-20"
      >
        <StarDoodle className="w-30 h-30 text-yellow-400 -rotate-12" />
      </ParallaxDoodle>

      <ParallaxDoodle
        smoothX={smoothX}
        smoothY={smoothY}
        isReady={isReady}
        delay={0.4}
        depth={20}
        tilt={15}
        className="hidden md:block absolute top-12 right-20 z-20"
      >
        <WaveDoodle className="w-16 h-16 text-sky-400" />
      </ParallaxDoodle>

      <ParallaxDoodle
        smoothX={smoothX}
        smoothY={smoothY}
        isReady={isReady}
        delay={0.55}
        depth={45}
        tilt={25}
        className="hidden md:block absolute top-32 right-68 z-20"
      >
        <PaperPlaneDoodle className="w-16 h-12 text-white/90 -rotate-[-9deg]" />
      </ParallaxDoodle>

      <ParallaxDoodle
        smoothX={smoothX}
        smoothY={smoothY}
        isReady={isReady}
        delay={0.7}
        depth={25}
        tilt={22}
        className="hidden md:block absolute top-110 left-70 z-20"
      >
        <SpiralDoodle className="w-20 h-16 text-lime-400 -rotate-12" />
      </ParallaxDoodle>

      <ParallaxDoodle
        smoothX={smoothX}
        smoothY={smoothY}
        isReady={isReady}
        delay={0.85}
        depth={30}
        tilt={18}
        className="hidden md:block absolute bottom-32 right-72 z-20"
      >
        <ZigzagDoodle className="w-20 h-10 text-violet-400 -rotate-6" />
      </ParallaxDoodle>
    </>
  );
}