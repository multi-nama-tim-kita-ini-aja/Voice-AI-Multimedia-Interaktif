"use client";

import React, { useEffect, useRef, useState } from "react";

export default function EyeFollowCursor() {
    const [pos, setPos] = useState({ x: -100, y: -100 });
    const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
    const targetPos = useRef({ x: -100, y: -100 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Posisi mata melayang di kanan atas kursor
            const offsetX = 36;
            const offsetY = -48;
            targetPos.current = { x: e.clientX + offsetX, y: e.clientY + offsetY };

            // Hitung arah sudut kursor relatif ke mata
            const deltaX = e.clientX - pos.x;
            const deltaY = e.clientY - pos.y;
            const angle = Math.atan2(deltaY, deltaX);

            // Jangkauan dibuat lebih lebar dari wadah putih agar pupil menonjol keluar
            const maxDistanceX = 12;
            const maxDistanceY = 14;
            const dist = Math.hypot(deltaX, deltaY);
            const factor = Math.min(dist / 120, 1);

            setPupilOffset({
                x: Math.cos(angle) * maxDistanceX * factor,
                y: Math.sin(angle) * maxDistanceY * factor,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        let animationFrameId: number;
        const updateFollow = () => {
            setPos((prev) => ({
                x: prev.x + (targetPos.current.x - prev.x) * 0.12,
                y: prev.y + (targetPos.current.y - prev.y) * 0.12,
            }));
            animationFrameId = requestAnimationFrame(updateFollow);
        };
        animationFrameId = requestAnimationFrame(updateFollow);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [pos.x, pos.y]);

    return (
        <div
            className="fixed pointer-events-none z-[9999] select-none flex items-center gap-1.5 -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
            }}
        >
            {/* Mata Kiri - overflow-hidden sengaja dilepas agar pupil bisa keluar */}
            <div className="relative flex items-center justify-center w-9 h-14 bg-white rounded-full shadow-md">
                <div
                    className="absolute w-6 h-9 bg-black rounded-full transition-transform duration-75 ease-out z-10"
                    style={{
                        transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                    }}
                >
                    {/* Titik pantulan putih di bawah pupil */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                </div>
            </div>

            {/* Mata Kanan - overflow-hidden sengaja dilepas agar pupil bisa keluar */}
            <div className="relative flex items-center justify-center w-9 h-14 bg-white rounded-full shadow-md">
                <div
                    className="absolute w-6 h-9 bg-black rounded-full transition-transform duration-75 ease-out z-10"
                    style={{
                        transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                    }}
                >
                    {/* Titik pantulan putih di bawah pupil */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                </div>
            </div>
        </div>
    );
}