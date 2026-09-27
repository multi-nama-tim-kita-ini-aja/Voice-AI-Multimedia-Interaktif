"use client";

import Image from "next/image";
import BowTieDoodle from "@/components/svg/BowTieDoodle";
import DoubleCloudDoodle from "@/components/svg/DoubleCloudDoodle";
import PaperPlaneDoodle from "@/components/svg/PaperPlaneDoodle";
import SmileDoodle from "@/components/svg/SmileDoodle";
import SpiralDoodle from "@/components/svg/SpiralDoodle";
import ZigzagDoodle from "@/components/svg/ZigzagDoodle";
import RocketDoodle from "@/components/svg/RocketDoodle";
import CrownDoodle from "./svg/CrownDoodle";


type Player = {
    rank: number;
    name: string;
    score: number;
    avatar: string;
};

const players: Player[] = [
    {
        rank: 1,
        name: "Enol",
        score: 123601,
        avatar: "/profile-kiro.png",
    },
    {
        rank: 2,
        name: "User9749544",
        score: 100003,
        avatar: "/profile-kiro.png",
    },
    {
        rank: 3,
        name: "User1573441",
        score: 67503,
        avatar: "/profile-kiro.png",
    },
    {
        rank: 4,
        name: "User6626293",
        score: 57997,
        avatar: "/profile-kiro.png",
    },
    {
        rank: 5,
        name: "User8025129",
        score: 53984,
        avatar: "/profile-kiro.png",
    },
    {
        rank: 6,
        name: "Daisy04",
        score: 48784,
        avatar: "/profile-kiro.png",
    },
    {
        rank: 7,
        name: "User7101622",
        score: 47380,
        avatar: "/profile-kiro.png",
    },
    {
        rank: 8,
        name: "User6623795",
        score: 47246,
        avatar: "/profile-kiro.png",
    },
    {
        rank: 9,
        name: "User9186615",
        score: 45132,
        avatar: "/profile-kiro.png",
    },
    {
        rank: 10,
        name: "User1735824",
        score: 14,
        avatar: "/profile-kiro.png",
    },
];

const formatScore = (score: number) => score.toLocaleString("en-US");

function Avatar({
    player,
    large = false,
}: {
    player: Player;
    large?: boolean;
}) {
    return (
        <div
            className={`
                relative shrink-0 overflow-hidden rounded-full
                border-[3px] border-white
                bg-[#D9E7FF]
                shadow-[0_4px_0_rgba(0,0,0,0.12)]
                ${large ? "w-[88px] h-[88px] max-md:w-[65px] max-md:h-[65px]" : "w-[48px] h-[48px]"}
            `}
        >
            <Image
                src={player.avatar}
                alt={player.name}
                fill
                className="object-cover"
            />
        </div>
    );
}

function WoodenPodium({
    rank,
    height,
}: {
    rank: 1 | 2 | 3;
    height: "h-[205px]" | "h-[155px]" | "h-[125px]";
}) {
return (
    <div className={`relative w-[170px] max-md:w-[115px] ${height}`}>

        {/* Grass shadow */}
        <div className="absolute bottom-10 max-md:bottom-[50px] left-1/2 -translate-x-1/2 w-[190px] max-md:w-[130px] h-[28px] rounded-[50%] bg-[#526B2E]/30 blur-[2px]" />

        {/* Grass kiri */}
        <div className="absolute z-30 bottom-[48px] max-md:bottom-[60px] -left-[10px] max-md:left-[4px] w-[38px] max-md:w-[28px]">
            <Image
                src="/grass.png"
                alt=""
                width={100}
                height={100}
                className="w-full h-auto object-contain select-none pointer-events-none"
                draggable={false}
            />
        </div>

        {/* Grass kanan - mirror */}
        <div className="absolute z-30 bottom-[46px] max-md:bottom-[60px] -right-[10px] max-md:right-[-1px] w-[38px] max-md:w-[28px]">
            <Image
                src="/grass.png"
                alt=""
                width={100}
                height={100}
                className="w-full h-auto object-contain scale-x-[-1] select-none pointer-events-none"
                draggable={false}
            />
        </div>

            {/* Daun rank 1 - 3 daun */}
            {rank === 1 && (
                <>
                    {/* Daun kiri atas */}
                    <div className="absolute z-40 left-[2px] max-md:left-[-8px] top-[35px] max-md:top-[40px] w-[24px] max-md:w-[17px] -rotate-[25deg]">
                        <Image
                            src="/leaf.png"
                            alt=""
                            width={100}
                            height={100}
                            className="w-full h-auto object-contain select-none pointer-events-none"
                            draggable={false}
                        />
                    </div>

                    {/* Daun kanan tengah */}
                    <div className="absolute z-40 right-[2px] max-md:right-[-9px] top-[75px] max-md:top-[78px] w-[24px] max-md:w-[17px] rotate-[25deg]">
                        <Image
                            src="/leaf.png"
                            alt=""
                            width={100}
                            height={100}
                            className="w-full h-auto object-contain scale-x-[-1] select-none pointer-events-none"
                            draggable={false}
                        />
                    </div>

                    {/* Daun kiri bawah */}
                    <div className="absolute z-40 left-[2px] max-md:left-[-8px] top-[115px] max-md:top-[90px] w-[24px] max-md:w-[17px] -rotate-[25deg]">
                        <Image
                            src="/leaf.png"
                            alt=""
                            width={100}
                            height={100}
                            className="w-full h-auto object-contain select-none pointer-events-none"
                            draggable={false}
                        />
                    </div>
                </>
            )}

            {/* Daun rank 2 - 2 daun */}
            {rank === 2 && (
                <>
                    {/* Daun kiri */}
                    <div className="absolute z-40 left-[2px] max-md:left-[-8px] top-[40px] max-md:top-[40px] w-[24px] max-md:w-[17px] -rotate-[25deg]">
                        <Image
                            src="/leaf.png"
                            alt=""
                            width={100}
                            height={100}
                            className="w-full h-auto object-contain select-none pointer-events-none"
                            draggable={false}
                        />
                    </div>

                    {/* Daun kanan */}
                    <div className="absolute z-40 right-[2px] max-md:right-[-8px] top-[65px] max-md:top-[70px] w-[24px] max-md:w-[17px] rotate-[25deg]">
                        <Image
                            src="/leaf.png"
                            alt=""
                            width={100}
                            height={100}
                            className="w-full h-auto object-contain scale-x-[-1] select-none pointer-events-none"
                            draggable={false}
                        />
                    </div>
                </>
            )}

            {/* Daun rank 3 - 1 daun */}
            {rank === 3 && (
                <div className="absolute z-40 right-[2px] max-md:right-[-8px] top-[35px] max-md:top-[40px] w-[24px] max-md:w-[17px] rotate-[25deg]">
                    <Image
                        src="/leaf.png"
                        alt=""
                        width={100}
                        height={100}
                        className="w-full h-auto object-contain scale-x-[-1] select-none pointer-events-none"
                        draggable={false}
                    />
                </div>
            )}

                {/* Batang */}
                <div
                    className="
                        absolute bottom-[50px] max-md:bottom-[65px] left-1/2 -translate-x-1/2
                        w-[124px] max-md:w-[100px]
                        h-[calc(100%-75px)] max-md:h-[calc(100%-85px)]
                        rounded-t-[18px] rounded-b-[12px]
                        border-x-[4px] max-md:border-x-[3px]
                        border-[#633719]
                        bg-gradient-to-r
                        from-[#70401F]
                        via-[#B87536]
                        to-[#75421F]
                        shadow-[inset_8px_0_rgba(255,210,130,0.12),inset_-8px_0_rgba(45,25,14,0.16)]
                    "
                >
                {/* Bark */}
                <div className="absolute left-[20px] top-[18px] w-[4px] h-[45px] max-md:h-[35px] rounded-full bg-[#512B18]/35" />
                <div className="absolute right-[20px] top-[28px] w-[4px] h-[50px] max-md:h-[40px] rounded-full bg-[#512B18]/35" />
                <div className="absolute left-[47px] bottom-[15px] w-[4px] h-[35px] max-md:h-[28px] rounded-full bg-[#512B18]/35" />
            </div>

        {/* Permukaan batang */}
        <div
            className="
                absolute z-20 left-1/2 -translate-x-1/2
                top-1 max-md:top-[8px]
                w-[124px] h-[60px]
                max-md:w-[100px] max-md:h-[45px]
                rounded-[50%]
                border-[4px]
                border-[#75431F]
                bg-[#C98943]
                shadow-[inset_0_-5px_rgba(95,52,27,0.2),0_6px_0_rgba(80,50,25,0.15)]
            "
        >

            {/* Tree rings */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[62px] h-[36px] max-md:w-[45px] max-md:h-[27px] rounded-[50%] border-[2px] border-[#70401F]/35" />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[28px] h-[17px] max-md:w-[21px] max-md:h-[13px] rounded-[50%] border-[2px] border-[#70401F]/40" />

            {/* Ranking */}
            <span className="absolute inset-0 flex items-center justify-center text-[#FFF3D2] font-monaSans text-xl max-md:text-sm font-extrabold drop-shadow-[0_2px_0_rgba(70,35,15,0.4)]">
                {rank}
            </span>
        </div>
    </div>
);
}

function TopPlayer({
    player,
    position,
}: {
    player: Player;
    position: "first" | "second" | "third";
}) {
    const isFirst = position === "first";
    const isSecond = position === "second";

    return (
        <div
            className={`
                relative flex flex-col items-center shrink-0
                ${isFirst
                    ? "z-20 -translate-y-[35px] max-md:-translate-y-[20px]"
                    : isSecond
                        ? "z-10 translate-y-[15px]"
                        : "z-10 translate-y-[25px]"
                }
            `}
        >
            {/* Diamond #1 */}
            {isFirst && (
                <div className="absolute -top-[48px] left-1/2 z-40 w-[48px] -translate-x-1/2 rotate-[-8deg] animate-bounce max-md:-top-[35px] max-md:w-[36px]">
                    <Image
                        src="/dm.png"
                        alt=""
                        width={100}
                        height={100}
                        className="h-auto w-full object-contain select-none pointer-events-none"
                        draggable={false}
                    />
                </div>
            )}

            {/* Medal */}
            <div className="relative">
                <Avatar player={player} large />

                <div
                    className="
                        absolute -right-[3px] -bottom-[4px]
                        flex items-center justify-center
                        w-[29px] h-[29px]
                    "
                >
                    <Image
                        src={
                            isFirst
                                ? "/medal1.png"
                                : isSecond
                                ? "/medal2.png"
                                : "/medal3.png"
                        }
                        alt=""
                        width={29}
                        height={29}
                        className="h-full w-full object-contain select-none pointer-events-none"
                        draggable={false}
                    />
                </div>
            </div>

            {/* Name */}
            <p className="mt-3 max-w-[150px] max-md:max-w-[100px] truncate text-[#303044] font-monaSans text-[15px] max-md:text-[11px] font-extrabold">
                {player.name}
            </p>

            {/* Score */}
            <p className="mt-1 text-[#706D62] font-plusJakartaSans text-[12px] max-md:text-[9px] font-bold">
                {formatScore(player.score)} XP
            </p>

            {/* Tree */}
            <WoodenPodium
                rank={player.rank as 1 | 2 | 3}
                height={
                    isFirst
                        ? "h-[205px]"
                        : isSecond
                            ? "h-[155px]"
                            : "h-[125px]"
                }
            />
        </div>
    );
}

export default function Leaderboard() {
    const topThree = players.slice(0, 3);
    const otherPlayers = players.slice(3);

    return (
        <section
            id="leaderboard"
            className="
                relative w-full min-h-screen overflow-hidden
                bg-[url('/leaderboard.png')]
                bg-cover bg-center bg-no-repeat
                px-6 py-24 max-md:px-3 max-md:py-5 sm:max-md:px-4
            "
        >

                {/* ================= ELEMEN DOODLE SVG ================= */}
                {/* Doodle yang rentan menumpuk di mobile dimatikan dengan hidden md:block */}
                <SmileDoodle className="hidden md:block w-14 h-10 text-yellow-400 absolute top-260 right-40 rotate-12 pointer-events-none z-10" />
                <PaperPlaneDoodle className="hidden md:block w-16 h-12 text-amber-600 absolute top-120 right-55 rotate-130 pointer-events-none z-10" />
                <DoubleCloudDoodle className="hidden md:block w-24 h-12 text-emerald-500 absolute top-150 right-280 -rotate-25 pointer-events-none z-10" />
                <SpiralDoodle className="hidden md:block w-16 h-16 text-emerald-400 absolute bottom-34 right-72 rotate-92 pointer-events-none z-10" />
                <BowTieDoodle className="absolute bottom-3 left-70 md:bottom-28 md:left-12 w-14 h-10 md:w-20 md:h-14 text-amber-400 -rotate-9 pointer-events-none z-10" />
                <ZigzagDoodle className="hidden md:block w-20 h-8 text-teal-400 absolute bottom-145 left-40 rotate-6 pointer-events-none z-10" />
                <RocketDoodle className="hidden md:block w-16 h-160 text-sky-300 absolute bottom-255 left-35 -rotate-38 pointer-events-none z-10" />
                <CrownDoodle className="hidden md:block w-20 h-15 text-amber-300 absolute top-25 right-20 rotate-12 pointer-events-none z-10" />
            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <div className="relative z-10 mx-auto w-full max-w-[1100px]">
        
                {/* Header */}
                <div className="flex flex-col items-center text-center">

                    <h2 className="relative mt-5 font-monaSans text-[clamp(42px,7vw,64px)] font-extrabold leading-[0.88] tracking-[-0.045em] max-md:mt-11 max-md:text-[clamp(34px,9vw,48px)]">

                        <span className="relative inline-block -rotate-[3deg]">
                            <span className="text-[#5F8A62] drop-shadow-[3px_4px_0px_#000000]">
                                GLOBAL
                            </span>
                            <Image
                                src="/medal.png"
                                alt=""
                                width={50}
                                height={50}
                                className="absolute -left-[24px] top-0 rotate-[28deg] max-md:-left-[20px] max-md:-top-[2px] max-md:w-[25px]"
                            />
                        </span>
                        <br />

                        <span className="relative inline-block rotate-[2deg]">
                            <span className="text-[#C47A3A] drop-shadow-[3px_4px_0px_#000000]">
                                LEADERBOARD
                            </span>
                            <Image
                                src="/trophy.png"
                                alt=""
                                width={50}
                                height={50}
                                className="absolute -right-[24px] -top-[8px] rotate-[15deg] max-md:-right-[22px] max-md:-top-[5px] max-md:w-[25px]"
                            />
                        </span>
                    </h2>

                    <p className="mt-6 font-plusJakartaSans text-sm font-medium leading-[1.5] text-[#77766E] max-md:text-xs">
                        Speak up, claim your spot
                        <br />
                        and become the quiz champion.
                    </p>
                </div>


                {/* =================================================
                    TOP 3 PODIUM
                ================================================== */}

                <div className="mx-auto mt-5 max-md:mt-0 flex min-h-[430px] w-full items-end justify-center px-2 sm:min-h-[450px]">

                    {/* #2 */}
                    <div className="relative z-20 -mr-[55px] w-[220px] max-md:-mr-[25px] max-md:w-[120px] sm:max-md:-mr-[35px] sm:max-md:w-[140px]">
                        <TopPlayer
                            player={topThree[1]}
                            position="second"
                        />
                    </div>

                    {/* #1 */}
                    <div className="relative z-30 w-[240px] max-md:w-[135px] sm:max-md:w-[155px]">
                        <TopPlayer
                            player={topThree[0]}
                            position="first"
                        />
                    </div>

                    {/* #3 */}
                    <div className="relative z-20 -ml-[55px] w-[220px] max-md:-ml-[25px] max-md:w-[120px] sm:max-md:-ml-[35px] sm:max-md:w-[140px]">
                        <TopPlayer
                            player={topThree[2]}
                            position="third"
                        />
                    </div>

                </div>


                {/* =================================================
                    OTHER PLAYERS
                ================================================== */}

                <div className="relative -top-[30px] mx-auto mt-0 w-full max-w-[820px] rounded-[28px] border-2 border-white/70 bg-white/50 p-2 sm:p-3 shadow-[0_15px_40px_rgba(61,66,48,0.12)] backdrop-blur-sm">

                <Image
                    src="/pin-lb.png"
                    alt=""
                    width={50}
                    height={50}
                    className="hidden md:block absolute -top-[30px] -right-[30px] z-30 rotate-[-0] pointer-events-none select-none"
                />


                    {/* Header */}
                    <div className="grid grid-cols-[55px_1fr_120px] px-5 pb-3 pt-1 text-[#99978D] font-plusJakartaSans text-[9px] font-extrabold tracking-[0.14em] max-md:hidden">
                        <span>RANK</span>
                        <span>PLAYER</span>
                        <span className="text-right">SCORE</span>
                    </div>

                    {otherPlayers.map((player) => {
                        const isCurrentUser = player.rank === 10;

                        return (
                            <div
                                key={player.rank}
                                className={`
                                    group relative mb-2
                                    grid grid-cols-[32px_40px_minmax(0,1fr)_auto]
                                    items-center gap-2 sm:gap-3
                                    min-h-[70px]
                                    rounded-[17px]
                                    border-2
                                    px-4
                                    transition-all duration-200
                                    hover:-translate-y-1
                                    max-md:px-3
                                    ${isCurrentUser
                                        ? "border-[#67B91F] bg-[#9CF044] shadow-[0_5px_0_#62A91E]"
                                        : "border-black/[0.035] bg-white/90 shadow-[0_5px_0_rgba(70,70,72,0.08)] hover:shadow-[0_8px_0_rgba(70,70,72,0.08)]"
                                    }
                                `}
                            >

                                {/* Current player arrow */}
                                {isCurrentUser && (
                                    <div className="absolute -left-[11px] top-1/2 -translate-y-1/2 border-b-[9px] border-l-[12px] border-t-[9px] border-b-transparent border-t-transparent border-l-[#54B51C]" />
                                )}

                                {/* Rank */}
                                <div className="flex items-center justify-center">
                                    <span className="text-[#626274] font-monaSans text-[18px] font-extrabold max-md:text-[15px]">
                                        {player.rank}
                                    </span>
                                </div>

                                {/* Avatar */}
                                <Avatar player={player} />

                                {/* Player info */}
                                <div className="flex min-w-0 flex-col">

                                    <div className="flex items-center gap-2">
                                        <p className="min-w-0 max-w-[220px] truncate text-[#414153] font-monaSans text-[13px] font-extrabold max-md:text-[11px]">
                                            {player.name}
                                        </p>

                                        {isCurrentUser && (
                                            <span className="rounded-full bg-[#4A9E17] px-1.5 py-0.5 text-[7px] font-extrabold text-white">
                                                YOU
                                            </span>
                                        )}
                                    </div>

                                    <span className="mt-1 text-[#99979A] font-plusJakartaSans text-[9px] font-semibold">
                                        Level {Math.max(1, Math.floor(player.score / 1000))}
                                    </span>

                                </div>

                                {/* Score */}
                                <div className="whitespace-nowrap text-[#55546B] font-plusJakartaSans text-[12px] font-extrabold max-md:text-[11px]">
                                    ⭐ {formatScore(player.score)}
                                </div>

                            </div>
                        );
                    })}

                </div>


                {/* Bottom */}
                <div className="relative -top-[30px] mt-8 flex items-center justify-center gap-3 text-[#77776F] font-plusJakartaSans text-xs font-semibold">
                    <Image
                        src="/maple.png"
                        alt=""
                        width={22}
                        height={22}
                        className="h-[22px] w-[22px] -scale-x-100 object-contain select-none pointer-events-none"
                    />

                    <p>
                        Keep playing. Your next victory is waiting.
                    </p>

                    <Image
                        src="/maple.png"
                        alt=""
                        width={22}
                        height={22}
                        className="h-[22px] w-[22px] object-contain select-none pointer-events-none"
                    />
                </div>
            </div>
        </section>
    );
}