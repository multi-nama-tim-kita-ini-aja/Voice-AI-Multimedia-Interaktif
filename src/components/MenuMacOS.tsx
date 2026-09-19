"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  targetId?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: "about", title: "About", icon: "/notes.png", targetId: "about" },
  { id: "projects", title: "Projects", icon: "/picture.png", targetId: "projects" },
  { id: "services", title: "Services", icon: "/face.png", targetId: "services" },
  { id: "contact", title: "Contact", icon: "/contact.png", targetId: "footer" },
];

export default function MenuMac() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      // Sembunyikan dock jika sisa jarak ke dasar halaman kurang dari 120px
      const isNearBottom = documentHeight - scrollPosition <= 120;
      setIsVisible(!isNearBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleItemClick = (targetId?: string) => {
    if (!targetId) return;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 80, opacity: 0, x: "-50%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-4 md:bottom-6 left-1/2 z-50 flex p-1.5 md:p-[9px] justify-center items-center gap-1.5 md:gap-2 rounded-[16px] md:rounded-[20px] bg-[rgba(247,247,247,0.32)] backdrop-blur-md shadow-[0_2px_6px_0_rgba(0,0,0,0.25),0_2px_6px_0_rgba(255,255,255,0.32)_inset] border-[0.67px] border-[#E6E6EB]"
          onMouseLeave={() => setHoveredId(null)}
        >
          {MENU_ITEMS.map((item) => {
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onClick={() => handleItemClick(item.targetId)}
                className="relative flex flex-col items-center cursor-pointer"
              >
                {/* Tooltip vertikal */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.9 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute -top-10 md:-top-12 z-30 px-2.5 md:px-3.5 py-0.5 md:py-1 rounded-lg md:rounded-xl bg-white text-[#1A1A1A] text-xs md:text-sm font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.15)] pointer-events-none whitespace-nowrap"
                    >
                      {item.title}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon Dock */}
                <motion.div
                  animate={{
                    scale: isHovered ? 0.92 : 1,
                    y: isHovered ? 2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="flex flex-col items-start rounded-[13px] md:rounded-[18px] w-fit overflow-hidden"
                >
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="rounded-[13px] md:rounded-[18px] w-[52px] h-[52px] md:w-[70px] md:h-[70px] object-cover max-w-none select-none"
                  />
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}