"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CosmicButton } from "@/components/ui/cosmic-button";
import { CustomWaveButton } from "@/components/ui/wave-button";
import BrushPreloader from "@/components/ui/brush-preloader";
import { showWarningToast } from "@/components/ui/warning-toaster";

export interface LevelDetail {
  levelName: string;
  totalQuestions: string;
  timePerQ: string;
  description: string;
}

export interface ModalCardItem {
  id: string;
  title: string;
  image: string;
  description: string;
  previewUrl: string;
  levels: {
    "1": LevelDetail;
    "2": LevelDetail;
    "3": LevelDetail;
  };
}

interface CaseStudyModalProps {
  card: ModalCardItem | null;
  onClose: () => void;
}

type MicState = "idle" | "requesting" | "allowed" | "denied";
type LevelType = "1" | "2" | "3";

const emptySubscribe = () => () => {};

export default function CaseStudyModal({ card, onClose }: CaseStudyModalProps) {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [selectedLevel, setSelectedLevel] = useState<LevelType>("1");
  const [micState, setMicState] = useState<MicState>("idle");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    setSelectedLevel("1");
    setShowPreloader(false);
  }, [card]);

  useEffect(() => {
    if (!card) return;

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((permissionStatus) => {
          const status =
            permissionStatus.state === "granted"
              ? "allowed"
              : permissionStatus.state === "denied"
              ? "denied"
              : "idle";
          setMicState(status);

          permissionStatus.onchange = () => {
            const nextStatus =
              permissionStatus.state === "granted"
                ? "allowed"
                : permissionStatus.state === "denied"
                ? "denied"
                : "idle";
            setMicState(nextStatus);
          };
        })
        .catch(() => setMicState("idle"));
    }
  }, [card]);

  const handleClose = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    onClose();
  };

  const requestMicPermission = async () => {
    try {
      setMicState("requesting");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      setMicState("allowed");
    } catch {
      setMicState("denied");
      showWarningToast("Mic Blocked", "Izinkan akses mikrofon di browsermu.");
    }
  };

  const handleStartQuiz = () => {
    if (micState !== "allowed") {
      showWarningToast(
        "Microphone Required",
        "Please enable your microphone first"
      );
      return;
    }
    setShowPreloader(true);
  };

  const handlePreloaderComplete = () => {
    router.push(`/quiz/${card?.id}?level=${selectedLevel}`);
  };

  useEffect(() => {
    if (!card) return;
    const originalHtml = document.documentElement.style.overflow;
    const originalBody = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalHtml;
      document.body.style.overflow = originalBody;
    };
  }, [card]);

  if (!mounted || !card) return null;

  const currentLevelData = card.levels[selectedLevel];

  return createPortal(
    <>
      {showPreloader && <BrushPreloader onComplete={handlePreloaderComplete} />}

      <AnimatePresence>
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm select-none"
          onClick={handleClose}
        >
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 350,
              mass: 0.8,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-[100dvh] sm:h-[90vh] sm:max-h-[750px] sm:max-w-[650px] bg-white rounded-none sm:rounded-[22px] shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex flex-col border-0 sm:border sm:border-white/80 overflow-hidden"
          >
            {/* Top Bar macOS */}
            <div className="flex items-center justify-between px-3.5 sm:px-6 h-12 bg-[#F6F6F6] border-b border-black/[0.08] shrink-0 rounded-none sm:rounded-t-[22px]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-3 h-3 rounded-full bg-[#FD5D5C] border border-[#E0443E] hover:opacity-80 transition-opacity cursor-pointer"
                  title="Close"
                />
                <span className="w-3 h-3 rounded-full bg-[#FAC900] border border-[#DFA123]" />
                <span className="w-3 h-3 rounded-full bg-[#34C75A] border border-[#1FA93D]" />
              </div>

              <div className="flex items-center justify-between px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white border border-black/10 rounded-md flex-1 max-w-[280px] sm:max-w-[420px] mx-2 sm:mx-4 shadow-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#999] truncate">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="shrink-0">
                    <path
                      d="M11.23 11.23L9.04 9.04M2.77 6.42C2.77 4.4 4.4 2.77 6.42 2.77C8.43 2.77 10.06 4.4 10.06 6.42C10.06 8.43 8.43 10.06 6.42 10.06C4.4 10.06 2.77 8.43 2.77 6.42Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[10px] sm:text-[11px] font-medium text-[#777] font-inter truncate">
                    VoxIQ / Quiz {card.title}
                  </span>
                </div>
              </div>

              <div className="relative w-6 h-6 shrink-0">
                <Image
                  src="/face.png"
                  alt="Face Avatar"
                  fill
                  className="object-contain mix-blend-multiply"
                />
              </div>
            </div>

            {/* Scroll Body */}
            <div
              className="flex-1 w-full p-4 sm:p-6 flex flex-col gap-5 sm:gap-6 select-text overflow-y-auto overscroll-contain no-scrollbar"
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[260px] sm:h-[340px] rounded-xl overflow-hidden shadow-md shrink-0 bg-black/5">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between shrink-0">
                <h3 className="text-[#252525] font-monaSans text-xl sm:text-3xl font-bold tracking-tight">
                  {card.title}
                </h3>
                <div onClick={handleStartQuiz}>
                  <CustomWaveButton>
                    Let&apos;s Go
                  </CustomWaveButton>
                </div>
              </div>

              <p className="text-[#555] font-monaSans text-sm sm:text-base leading-relaxed">
                {card.description}
              </p>

              {/* Selector Level */}
              <div className="flex flex-col gap-2 p-3 bg-black/[0.03] rounded-xl border border-black/5">
                <span className="text-xs font-semibold text-[#555] font-monaSans">
                  Select Difficulty Level:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["1", "2", "3"] as LevelType[]).map((lvl) => {
                    const isSelected = selectedLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedLevel(lvl)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold font-monaSans transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#252525] text-white shadow-md scale-[1.02]"
                            : "bg-white text-[#555] hover:bg-black/5 border border-black/10"
                        }`}
                      >
                        <span>Level {lvl}</span>
                        <span className="text-[10px] font-normal opacity-80">
                          {lvl === "1" ? "Easy" : lvl === "2" ? "Medium" : "Hard"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 py-3 sm:py-4 border-y border-black/[0.08] shrink-0 items-center">
                <div>
                  <span className="text-[11px] sm:text-[12px] font-medium text-black/50 font-monaSans block">
                    Total Questions:
                  </span>
                  <span className="text-[13px] sm:text-[14px] font-semibold text-[#252525] font-monaSans">
                    {currentLevelData.totalQuestions}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] sm:text-[12px] font-medium text-black/50 font-monaSans block">
                    Time per Question:
                  </span>
                  <span className="text-[13px] sm:text-[14px] font-semibold text-[#252525] font-monaSans">
                    {currentLevelData.timePerQ}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] sm:text-[12px] font-medium text-black/50 font-monaSans block">
                    Active Mode:
                  </span>
                  <span className="text-[13px] sm:text-[14px] font-semibold text-[#252525] font-monaSans">
                    {currentLevelData.levelName}
                  </span>
                </div>

                {/* Mic Status */}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[11px] sm:text-[12px] font-medium text-black/50 font-monaSans block">
                    Mic Status:
                  </span>

                  {micState === "allowed" ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c1e] border border-white/10 shadow-sm animate-in fade-in duration-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
                      </span>
                      <span className="text-white text-xs font-semibold tracking-tight">
                        Active & Ready
                      </span>
                    </div>
                  ) : micState === "denied" ? (
                    <button
                      type="button"
                      onClick={requestMicPermission}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c1e] border border-red-500/30 text-white hover:bg-[#252528] transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-xs font-semibold tracking-tight">
                        Mic Blocked (Retry)
                      </span>
                    </button>
                  ) : (
                    <CosmicButton
                      as="button"
                      type="button"
                      size="sm"
                      onClick={requestMicPermission}
                      disabled={micState === "requesting"}
                      className="cursor-pointer text-xs"
                    >
                      {micState === "requesting" ? "Connecting..." : "Enable Voice Mic"}
                    </CosmicButton>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>,
    document.body
  );
}