"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { BadgeQuestionMarkIcon, Add01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";

import BowTieDoodle from "@/components/svg/BowTieDoodle";
import DoubleCloudDoodle from "@/components/svg/DoubleCloudDoodle";
import PaperPlaneDoodle from "@/components/svg/PaperPlaneDoodle";
import SmileDoodle from "@/components/svg/SmileDoodle";
import SpiralDoodle from "@/components/svg/SpiralDoodle";
import StarDoodle from "@/components/svg/StarDoodle";
import WaveDoodle from "@/components/svg/WaveDoodle";
import ZigzagDoodle from "@/components/svg/ZigzagDoodle";
import InteractiveEyes from "./InteractiveEyes";

interface FaqItem {
    id: string;
    question: string;
    answer: string;
    bgColor: string;
    posClass: string;
}

const FAQS: FaqItem[] = [
    {
        id: "design",
        question: "How do I submit my answer?",
        answer:
            "Wait until the AI finishes reading the question, then speak your answer or chosen option clearly. The system detects your voice automatically without pressing any buttons.",
        bgColor: "bg-[#FEDCDD]",
        posClass: "md:left-[150px] md:top-[230px] md:-rotate-[-2.5deg]",
    },
    {
        id: "framer",
        question: "Which browsers are supported?",
        answer:
            "We recommend Google Chrome, Microsoft Edge, or Safari. Browsers that restrict speech services by default (like Brave) might require extra mic permissions.",
        bgColor: "bg-[#F7F2B2]",
        posClass: "md:right-[180px] md:top-[205px] md:-rotate-[1.5deg]",
    },
    {
        id: "need",
        question: "Can I repeat or skip questions?",
        answer:
            "Absolutely. Just say 'Repeat' or 'Read again' to hear the question once more, or say 'Skip' to move directly to the next one.",
        bgColor: "bg-[#D8F58A]",
        posClass: "md:right-[60px] md:top-[460px] md:-rotate-[9deg]",
    },
    {
        id: "visuals",
        question: "Do I need to wear headphones?",
        answer:
            "Highly recommended! Wearing headphones prevents audio feedback from your speakers entering the microphone while you answer.",
        bgColor: "bg-[#C7F8D9]",
        posClass: "md:left-1/2 md:-translate-x-1/2 md:top-[630px] md:-rotate-[6deg]",
    },
    {
        id: "start",
        question: "How does scoring work?",
        answer:
            "Each correct answer earns 10 points plus combo streaks. Our AI judge checks semantic meaning, so minor phrasing differences still count as correct.",
        bgColor: "bg-[#BBDAFE]",
        posClass: "md:left-[85px] md:top-[520px] md:-rotate-[-8deg]",
    },
];

export default function FaqSection() {
    const [openId, setOpenId] = useState<string | null>("null");

    const toggleFaq = (id: string) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section
            id="faqs"
            className="relative w-full py-12 md:py-16 md:min-h-[960px] px-4 overflow-hidden flex justify-center items-center"
        >
            {/* Background Grid Pattern dikunci di layer terpisah agar posisinya statis saat accordion dibuka */}
            <div className="absolute inset-0 bg-[url('/garis-kotak.png')] bg-repeat bg-top pointer-events-none -z-10" />

            <div className="relative w-full max-w-[1240px] md:h-[860px] flex flex-col md:block items-center shrink-0">
                {/* ================= STIKER & GAMBAR ================= */}
                {/* Desktop: posisi asli. Mobile: diletakkan di sudut luar agar tidak menimpa kartu */}
                <Image
                    src="/plane.png"
                    alt="Plane Sticker"
                    width={85}
                    height={85}
                    className="absolute top-2 right-2 md:top-12 md:right-28 -rotate-12 pointer-events-none select-none z-10 mix-blend-multiply scale-75 md:scale-100"
                />
                <Image
                    src="/dinosour.png"
                    alt="Dinosaur Sticker"
                    width={85}
                    height={85}
                    className="absolute bottom-4 right-2 md:bottom-24 md:right-20 rotate-6 pointer-events-none select-none z-10 mix-blend-multiply scale-75 md:scale-100"
                />
                <Image
                    src="/pin.png"
                    alt="Pin Sticker"
                    width={50}
                    height={50}
                    className="hidden md:block absolute top-44 left-[460px] pointer-events-none select-none z-30 mix-blend-multiply -rotate-[9deg]"
                />

                {/* ================= ELEMEN DOODLE SVG ================= */}
                {/* Doodle yang rentan menumpuk di mobile dimatikan dengan hidden md:block */}
                <SmileDoodle className="hidden md:block w-14 h-10 text-yellow-400 absolute top-8 left-1/2 -translate-x-1/2 rotate-12 pointer-events-none z-10" />
                <StarDoodle className="absolute top-8 left-2 md:top-20 md:left-24 w-12 h-12 md:w-16 md:h-16 text-amber-400 -rotate-12 pointer-events-none z-10" />
                <WaveDoodle className="hidden md:block w-30 h-15 text-sky-400 absolute top-40 right-[440px] rotate-3 pointer-events-none z-10" />
                <PaperPlaneDoodle className="hidden md:block w-16 h-12 text-violet-400 absolute top-72 left-8 rotate-12 pointer-events-none z-10" />
                <DoubleCloudDoodle className="hidden md:block w-24 h-12 text-pink-400 absolute top-80 right-12 -rotate-6 pointer-events-none z-10" />
                <SpiralDoodle className="hidden md:block w-16 h-16 text-emerald-400 absolute bottom-72 left-72 rotate-45 pointer-events-none z-10" />
                <BowTieDoodle className="absolute bottom-8 left-2 md:bottom-28 md:left-12 w-14 h-10 md:w-20 md:h-14 text-lime-400 -rotate-12 pointer-events-none z-10" />
                <ZigzagDoodle className="hidden md:block w-20 h-8 text-indigo-400 absolute bottom-12 right-80 rotate-6 pointer-events-none z-10" />
                
                {/* Mata interaktif hanya untuk desktop sesuai layout aslinya */}
                <InteractiveEyes className="hidden md:flex absolute bottom-50 right-50 z-10" />

                {/* ================= JUDUL TENGAH ================= */}
                <div className="flex flex-col justify-center items-center relative md:absolute md:left-1/2 md:-translate-x-1/2 md:top-[340px] z-20 select-none mb-8 md:mb-0 pointer-events-none">
                    {/* Badge FAQs */}
                    <div className="absolute -left-6 -top-8 md:-left-8 md:-top-8 w-[124px] h-[50px] -rotate-[19deg] z-20 pointer-events-auto max-md:scale-[0.82] max-md:origin-bottom-left">
                        <div className="relative flex items-center justify-center pl-6 pr-3 rounded-[8px] bg-[#E5F2FA] shadow-[0_4px_12px_rgba(0,0,0,0.06)] w-full h-[36px] top-3 overflow-hidden border border-white/80">
                            <p className="text-[#212121] font-plusJakartaSans text-[14px] font-bold tracking-tight text-center">
                                FAQs
                            </p>
                            <Image
                                src="/paper-blue.png"
                                alt="Paper clip icon"
                                width={14}
                                height={14}
                                className="absolute -right-px -top-px"
                            />
                        </div>

                        <div className="flex justify-center items-center rounded-full bg-[#039CFB] shadow-[-1.4px_2.1px_1.4px_0_rgba(0,0,0,0.24)] w-[29px] h-[29px] absolute left-1 top-px border-[0.93px] border-[#FFF]">
                            <HugeiconsIcon
                                icon={BadgeQuestionMarkIcon}
                                size={15}
                                className="text-white shrink-0"
                            />
                        </div>
                    </div>

                    <p className="text-[#252525] font-monaSans text-[26px] sm:text-[32px] md:text-[42px] font-extrabold leading-[1.05] md:leading-[44px] text-center tracking-[-0.035em]">
                        THINGS TO KNOW 
                    </p>
                    <p className="text-[#252525] font-monaSans text-[26px] sm:text-[32px] md:text-[42px] font-extrabold leading-[1.05] md:leading-[44px] text-center tracking-[-0.035em]">
                        BEFORE YOU PLAY
                    </p>
                </div>

                {/* ================= DAFTAR KARTU FAQ ================= */}
                <div className="w-full max-w-[360px] sm:max-w-[420px] flex flex-col gap-3 md:block md:max-w-none md:w-auto z-20">
                    {FAQS.map((faq) => {
                        const isOpen = openId === faq.id;

                        return (
                            <div
                                key={faq.id}
                                onClick={() => toggleFaq(faq.id)}
                                className={`relative md:absolute ${faq.posClass} z-20 cursor-pointer rounded-[20px] md:rounded-2xl ${faq.bgColor} p-4 md:p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] md:shadow-[6px_6px_0_0_rgba(0,0,0,0.12)] border border-black/5 flex flex-col justify-start transition-all duration-200 hover:shadow-[7px_7px_0_0_rgba(0,0,0,0.16)] w-full md:w-[320px]`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-[#121212] font-monaSans text-[15px] md:text-lg font-semibold tracking-[-0.02em] leading-snug">
                                        {faq.question}
                                    </p>

                                    <motion.div
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10"
                                    >
                                        <HugeiconsIcon
                                            icon={Add01Icon}
                                            size={15}
                                            className="text-[#121212]"
                                        />
                                    </motion.div>
                                </div>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.22, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pt-2.5 text-[#262626] font-inter text-xs md:text-sm font-normal leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}