import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiVoiceIcon, VictoryFinger02Icon } from "@hugeicons/core-free-icons";
import StarDoodle from "@/components/svg/StarDoodle";
import WaveDoodle from "@/components/svg/WaveDoodle";
import PaperPlaneDoodle from "@/components/svg/PaperPlaneDoodle";
import SpiralDoodle from "@/components/svg/SpiralDoodle";
import ZigzagDoodle from "@/components/svg/ZigzagDoodle";

export default function HeroSection() {
    return (
        <section className="relative w-full min-h-screen overflow-hidden">
            {/* Background Hero */}
            <Image
                src="/bukit-hero.png"
                alt="Hero Background"
                fill
                priority
                className="object-cover -z-10"
            />

            {/* Navbar */}
            <header className="flex p-6 justify-center items-start gap-[291px] w-full h-[68px]">
                <div className="flex justify-center items-center gap-2.5 shrink-0 w-[109px] h-5">
                    <div className="flex flex-col items-start w-fit">
                        <p className="text-[#FFF] font-inter text-2xl font-semibold leading-[20.4px] w-fit tracking-[-0.04em]">
                            VoxIQ®
                        </p>
                    </div>
                </div>
            </header>

            {/* Hero Content */}
            <div className="flex p-6 flex-col justify-center items-center gap-10 w-full min-h-[calc(100vh-68px)] max-md:px-4 max-md:py-8 max-md:justify-center">

                {/* Audio Status Badge */}
                <div className="relative shrink-0 max-md:-translate-y-8">
                    <div className="flex p-3 items-start gap-3 shrink-0 rounded-2xl bg-[rgba(255,255,255,0.12)] shadow-[0_1px_0.5px_0_rgba(255,255,255,0.45)_inset] w-[295px] max-md:w-[280px] h-[60px] overflow-hidden relative backdrop-blur-sm">
                        <div className="flex justify-center items-center gap-4 shrink-0 w-[271px] max-md:w-full h-9">
                            <div className="relative shrink-0 rounded-[100px] w-9 h-9 overflow-hidden">
                                <Image
                                    src="/profile-kiro.png"
                                    alt="Voice AI Host"
                                    width={36}
                                    height={36}
                                    className="rounded-[100px] object-cover"
                                />
                            </div>
                            <div className="flex flex-col items-start gap-2 shrink-0 w-[219px] max-md:w-auto h-8">
                                <div className="flex flex-col items-start w-fit">
                                    <p className="text-[#FFF] font-inter text-base max-md:text-sm font-medium leading-[13.6px] w-fit tracking-[-0.04em]">
                                        KIRO - VOICE AI ASSISTANT
                                    </p>
                                </div>
                                <div className="flex justify-center items-center gap-1.5 shrink-0 w-[118px] h-2.5">
                                    <div className="shrink-0 rounded-lg opacity-[50.85%] bg-[#34C75A] w-2 h-2 animate-pulse"></div>
                                    <div className="flex flex-col items-start w-fit">
                                        <p className="text-[#FFF] font-inter text-xs font-medium leading-[10.2px] w-fit tracking-[-0.04em]">
                                            Mic Active & Ready
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-2xl border-2 border-[rgba(255,255,255,0.18)] pointer-events-none"></div>
                    </div>
                </div>

                {/* Doodles: Posisi Desktop 100% Asli, Disembunyikan di Mobile */}
                <StarDoodle className="hidden md:block w-30 h-30 text-yellow-400 absolute top-20 left-40 -rotate-12 pointer-events-none" />
                <WaveDoodle className="hidden md:block w-16 h-16 text-sky-400 absolute top-12 right-20 pointer-events-none" />
                <PaperPlaneDoodle className="hidden md:block w-16 h-12 text-white/90 absolute top-32 right-68 -rotate-[-9deg] pointer-events-none" />
                <SpiralDoodle className="hidden md:block w-20 h-16 text-lime-400 absolute top-110 left-70 -rotate-12 z-20 pointer-events-none" />
                <ZigzagDoodle className="hidden md:block w-20 h-10 text-violet-400 absolute bottom-32 right-72 -rotate-6 pointer-events-none" />

                {/* Heading with Feature Badges */}
                <div className="shrink-0 w-[739px] h-[180px] relative max-md:w-full max-md:max-w-[340px] max-md:h-auto max-md:shrink max-md:flex max-md:flex-col max-md:items-center">

                    {/* Teks Judul */}
                    <p className="text-[#FFF] font-monaSans text-[56px] font-extrabold leading-[50.4px] w-[739px] h-[101px] absolute left-0 top-[39px] text-center tracking-[-0.0464em] max-md:static max-md:w-full max-md:h-auto max-md:text-[38px] max-md:leading-[0.98]">
                        ANSWER QUIZZES JUST USING YOUR VOICE
                    </p>

                    {/* Speech Recognition Tag */}
                    <div className="w-[113px] h-[54px] absolute left-[658px] -top-9 -rotate-[-9deg] max-md:left-auto max-md:-right-1 max-md:-top-9 max-md:rotate-[8deg] max-md:scale-[0.82] max-md:origin-top-right z-20">
                        <div className="flex py-[3px] px-2 justify-center items-center gap-[3px] rounded-[5.2px] bg-[#F4EAF5] shadow-[0_0_7px_0_rgba(0,0,0,0.04)] w-[113px] h-[34px] absolute left-0 top-5 overflow-hidden">
                            <div className="flex flex-col items-center shrink-0 w-[98px]">
                                <p className="text-[#212121] font-plusJakartaSans text-[13px] font-semibold leading-[15.62px] w-fit">
                                    Smart Audio
                                </p>
                            </div>
                            <Image
                                src="/paper-purple.png"
                                alt="Mic Icon"
                                width={13}
                                height={13}
                                className="absolute -right-px -top-0.5"
                            />
                        </div>

                        <div className="flex justify-center items-center rounded-full bg-[#EC68FD] shadow-[-1.4px_2.1px_1.4px_0_rgba(0,0,0,0.24)] w-[29px] h-[29px] absolute left-1 top-px border-[0.93px] border-[#FFF]">
                            <HugeiconsIcon
                                icon={AiVoiceIcon}
                                size={15}
                                className="text-white shrink-0"
                            />
                        </div>
                    </div>

                    {/* Voice Trivia Tag */}
                    <div className="w-[113px] h-[54px] absolute left-[235px] top-[51px] -rotate-[9deg] max-md:left-[-4px] max-md:top-auto max-md:-bottom-9 max-md:-rotate-[9deg] max-md:scale-[0.82] max-md:origin-bottom-left z-20">
                        <div className="flex py-[3px] px-2 justify-center items-center gap-[3px] rounded-[5.2px] bg-[#F4F8E8] shadow-[0_0_7px_0_rgba(0,0,0,0.04)] w-[113px] h-[34px] absolute left-0 top-5 overflow-hidden">
                            <div className="flex flex-col items-center shrink-0 w-[98px]">
                                <p className="text-[#212121] font-plusJakartaSans text-[13px] font-semibold leading-[15.62px] w-fit">
                                    Hands-Free
                                </p>
                            </div>
                            <Image
                                src="/paper-green.png"
                                alt="Mic Icon"
                                width={13}
                                height={13}
                                className="absolute -right-px -top-0.5"
                            />
                        </div>
                        <div className="flex justify-center items-center rounded-full bg-[#93BA06] shadow-[-1.4px_2.1px_1.4px_0_rgba(0,0,0,0.24)] w-[29px] h-[29px] absolute left-1 top-px border-[0.93px] border-[#FFF]">
                            <HugeiconsIcon
                                icon={VictoryFinger02Icon}
                                size={15}
                                className="text-white shrink-0"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}