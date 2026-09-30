"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CosmicButton } from "@/components/ui/cosmic-button";
import { CustomWaveButton } from "@/components/ui/wave-button";
import { Wave } from "@hugeicons/core-free-icons";

export interface ProjectDetail {
    totalQuestions: string;
    timeperQ: string;
    difficultyLevel: string;
    micStatus: string;
    description: string;
    previewUrl: string;
}

export interface ModalCardItem {
    id: string;
    title: string;
    image: string;
    detail: ProjectDetail;
}

interface CaseStudyModalProps {
    card: ModalCardItem | null;
    onClose: () => void;
}

type MicState = "idle" | "requesting" | "allowed" | "denied";

const emptySubscribe = () => () => { };

export default function CaseStudyModal({ card, onClose }: CaseStudyModalProps) {
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,  // Nilai saat di Client
        () => false  // Nilai saat di Server (SSR)
    );
    const [micState, setMicState] = useState<MicState>("idle");
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    // Cek status izin mic saat modal terbuka
    useEffect(() => {
        if (!card) return;

        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions
                .query({ name: "microphone" as PermissionName })
                .then((permissionStatus) => {
                    if (permissionStatus.state === "granted") {
                        setMicState("allowed");
                    } else if (permissionStatus.state === "denied") {
                        setMicState("denied");
                    } else {
                        setMicState("idle");
                    }

                    permissionStatus.onchange = () => {
                        if (permissionStatus.state === "granted") {
                            setMicState("allowed");
                        } else if (permissionStatus.state === "denied") {
                            setMicState("denied");
                        } else {
                            setMicState("idle");
                        }
                    };
                })
                .catch(() => {
                    setMicState("idle");
                });
        }
    }, [card]);

    // Matikan stream mic saat modal ditutup
    const handleClose = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            setMediaStream(null);
        }
        onClose();
    };

    // Fungsi trigger permission mic browser
    const requestMicPermission = async () => {
        try {
            setMicState("requesting");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMediaStream(stream);
            setMicState("allowed");
        } catch (err: unknown) {
            console.error("Mic access denied:", err);
            setMicState("denied");
        }
    };

    // Kunci scroll halaman (HTML & BODY) ketika popup terbuka
    useEffect(() => {
        if (!card) return;

        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyOverflow = document.body.style.overflow;

        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.overflow = originalBodyOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [card]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {card && (
                <motion.div
                    key="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm select-none"
                    onClick={handleClose}
                >
                    {/* Container Jendela Safari macOS: Fullscreen di Mobile, Card Float di Desktop */}
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
                        {/* Safari Top Bar (Statis di atas) */}
                        <div className="flex items-center justify-between px-3.5 sm:px-6 h-12 bg-[#F6F6F6] border-b border-black/[0.08] shrink-0 rounded-none sm:rounded-t-[22px]">
                            {/* Titik macOS */}
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

                            {/* Search/Address Bar */}
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
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-[#999] shrink-0">
                                    <path
                                        d="M10.5 6A4.5 4.5 0 1 1 9.18 2.82L10.5 1.5M10.5 1.5V4.5H7.5"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            {/* Icon Sudut Kanan */}
                            <div className="relative w-6 h-6 shrink-0">
                                <Image
                                    src="/face.png"
                                    alt="Face Avatar"
                                    fill
                                    className="object-contain mix-blend-multiply"
                                />
                            </div>
                        </div>

                        {/* Area Scrollable Konten Card */}
                        <div
                            className="flex-1 w-full p-4 sm:p-6 flex flex-col gap-5 sm:gap-6 select-text overflow-y-auto overscroll-contain no-scrollbar"
                            onWheel={(e) => e.stopPropagation()}
                        >
                            {/* Gambar Preview Utama */}
                            <div className="relative w-full h-[320px] sm:h-[430px] rounded-xl overflow-hidden shadow-md shrink-0 bg-black/5">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Title & Preview Link */}
                            <div className="flex items-center justify-between shrink-0">
                                <h3 className="text-[#252525] font-monaSans text-xl sm:text-3xl font-bold tracking-tight">
                                    {card.title}
                                </h3>
                                <CustomWaveButton>
                                    Let&apos;s Go
                                </CustomWaveButton>
                            </div>

                            {/* Deskripsi */}
                            <p className="text-[#555] font-monaSans text-sm sm:text-base leading-relaxed">
                                {card.detail.description}
                            </p>

                            {/* 4 Kolom Informasi Metadata */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 py-3 sm:py-4 border-y border-black/[0.08] shrink-0 items-center">
                                <div>
                                    <span className="text-[11px] sm:text-[12px] font-medium text-black/50 font-monaSans block">
                                        Total Questions :
                                    </span>
                                    <span className="text-[13px] sm:text-[14px] font-semibold text-[#252525] font-monaSans">
                                        {card.detail.totalQuestions}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[11px] sm:text-[12px] font-medium text-black/50 font-monaSans block">
                                        Time per Question :
                                    </span>
                                    <span className="text-[13px] sm:text-[14px] font-semibold text-[#252525] font-monaSans">
                                        {card.detail.timeperQ}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[11px] sm:text-[12px] font-medium text-black/50 font-monaSans block">
                                        Difficulty Level :
                                    </span>
                                    <span className="text-[13px] sm:text-[14px] font-semibold text-[#252525] font-monaSans">
                                        {card.detail.difficultyLevel}
                                    </span>
                                </div>

                                {/* Bagian Mic Status */}
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[11px] sm:text-[12px] font-medium text-black/50 font-monaSans block">
                                        Mic Status :
                                    </span>

                                    {micState === "allowed" ? (
                                        /* Pill Gelap Persis Gambar */
                                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1c1e] border border-white/10 shadow-sm animate-in fade-in duration-200">
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
                                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1c1e] border border-red-500/30 text-white hover:bg-[#252528] transition-colors shadow-sm"
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
                                            className="cursor-pointer"
                                        >
                                            {micState === "requesting" ? "Connecting..." : "Enable Voice Mic"}
                                        </CosmicButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}