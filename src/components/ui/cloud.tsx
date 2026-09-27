"use client";

export default function Cloud() {
    return (
        <div className="relative z-50 hidden h-0 select-none pointer-events-none md:block">

            <style>{`
                @keyframes cloudFloat {
                    0%, 100% {
                        translate: 0 0;
                    }
                    50% {
                        translate: 40px 0;
                    }
                }
            `}</style>

            {/* CLOUD LEFT */}
            <div
                className="
                    pointer-events-none absolute
                    left-[-3%] top-[-105px]
                    h-[190px] w-[560px]
                    bg-[url('/cloud-border.png')]
                    bg-no-repeat bg-contain bg-left-top
                    select-none
                "
                style={{
                    animation: "cloudFloat 7s ease-in-out infinite",
                }}
            />

            {/* CLOUD CENTER */}
            <div
                className="
                    pointer-events-none absolute
                    left-[30%] top-[-135px]
                    h-[210px] w-[650px]
                    -translate-x-1/2
                    bg-[url('/cloud-border.png')]
                    bg-no-repeat bg-contain bg-center-top
                    select-none
                "
                style={{
                    animation: "cloudFloat 9s ease-in-out infinite reverse",
                }}
            />

            {/* CLOUD RIGHT */}
            <div
                className="
                    pointer-events-none absolute
                    right-[-2%] top-[-100px]
                    h-[190px] w-[560px]
                    bg-[url('/cloud-border.png')]
                    bg-no-repeat bg-contain bg-right-top
                    select-none
                "
                style={{
                    animation: "cloudFloat 8s ease-in-out infinite",
                    animationDelay: "-2s",
                }}
            />

        </div>
    );
}