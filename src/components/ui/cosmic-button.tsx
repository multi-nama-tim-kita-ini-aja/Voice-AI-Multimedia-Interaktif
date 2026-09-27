"use client";

import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export type CosmicButtonProps<E extends "a" | "button" = "a"> = {
    /** The HTML element to render as. @default "a" */
    as?: E;
    /** Opsi ukuran tombol agar tidak buram akibat scale */
    size?: "sm" | "default" | "lg";
} & ComponentPropsWithoutRef<E>;

export function CosmicButton<E extends "a" | "button" = "a">({
    as,
    size = "default",
    className,
    children,
    ...props
}: CosmicButtonProps<E>) {
    const Element = as ?? "a";
    const isAnchor = Element === "a";

    // Konfigurasi ukuran padding dan font yang tajam
    const sizeConfig = {
        sm: {
            outer: "min-h-7 rounded-[10px] p-[2px]",
            inner: "rounded-[8px] px-2.5 py-1 gap-1.5",
            text: "text-xs font-semibold",
            rounded: "rounded-[10px]",
        },
        default: {
            outer: "min-h-11 min-w-11 rounded-[15px] p-[3px]",
            inner: "rounded-[12px] px-5 py-2.5 gap-3",
            text: "text-base font-medium",
            rounded: "rounded-[15px]",
        },
        lg: {
            outer: "min-h-14 min-w-14 rounded-[18px] p-[3.5px]",
            inner: "rounded-[14px] px-7 py-3 gap-3.5",
            text: "text-lg font-semibold",
            rounded: "rounded-[18px]",
        },
    }[size];

    const baseClassName = cn(
        "group/cosmic relative inline-flex items-center justify-center transition-transform",
        "focus-visible:ring-2 focus-visible:ring-[#adfa1b] focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:focus-visible:ring-offset-[#0c0912]",
        sizeConfig.outer,
        className
    );

    const content = (
        <>
            {/* Animated cosmic border - enlarges on hover */}
            <span
                className={cn(
                    "absolute inset-0 overflow-hidden transition-all duration-300 ease-out group-hover/cosmic:inset-[-2px]",
                    sizeConfig.rounded
                )}
            >
                <span className="animate-cosmic-spin absolute inset-[-200%] bg-[conic-gradient(from_0deg,#adfa1b,#c9ff63,#efffb7,#8cd413,#6f9f19,#92d61b,#adfa1b)] opacity-95" />
            </span>

            {/* Noise/texture overlay on the border - enlarges on hover */}
            <span
                className={cn(
                    "absolute inset-0 overflow-hidden opacity-45 mix-blend-soft-light transition-all duration-300 ease-out group-hover/cosmic:inset-[-2px] dark:opacity-60 dark:mix-blend-overlay",
                    sizeConfig.rounded
                )}
            >
                <span className="animate-cosmic-spin-slow absolute inset-[-200%] bg-[conic-gradient(from_180deg,#efffb7_0%,transparent_30%,#adfa1b_50%,transparent_70%,#7fbf17_100%)]" />
            </span>

            {/* Theme-aware inner background */}
            <span
                className={cn(
                    "bg-white dark:bg-[#0c0912] relative z-10 flex items-center shadow-[inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(15,23,42,0.08),0_1px_1px_rgba(15,23,42,0.08),0_4px_12px_rgba(15,23,42,0.1)] transition-all duration-300 active:scale-[0.98]",
                    sizeConfig.inner
                )}
            >
                <span className={cn("text-[#1e1e1e] dark:text-white tracking-tight", sizeConfig.text)}>
                    {children ?? "Placeholder text"}
                </span>
            </span>
        </>
    );

    if (isAnchor) {
        const { href, rel, target, ...rest } =
            props as ComponentPropsWithoutRef<"a">;
        return (
            <a
                className={baseClassName}
                href={href ?? "https://aisdkagents.com"}
                rel={rel ?? "noopener noreferrer"}
                target={target ?? "_blank"}
                {...rest}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            className={baseClassName}
            {...(props as ComponentPropsWithoutRef<"button">)}
        >
            {content}
        </button>
    );
}