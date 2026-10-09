"use client"

import { forwardRef, useCallback, useRef, type ComponentProps } from "react"
import { Warp, type WarpProps } from "@paper-design/shaders-react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const DEFAULT_WARP: Partial<WarpProps> = {
  colors: ["#fda4af", "#0070f3", "#fb923c", "#f472b6", "#00d4ff"],
  distortion: 0.25,
  height: 720,
  proportion: 0.54,
  scale: 0.2,
  shape: "checks",
  shapeScale: 1,
  softness: 1,
  speed: 0.1,
  swirl: 0.8,
  swirlIterations: 10,
  width: 1280,
}

type WarpContainerProps = Omit<ComponentProps<"div">, "children"> & {
  isActive?: boolean
  pulseDurationSec?: number
  warpProps?: Partial<WarpProps>
}

type WarpCanvasProps = {
  live: boolean
  speed: number
  warpProps?: Partial<WarpProps>
  className?: string
  pulseDurationSec: number
}

function WarpCanvas({
  live,
  speed,
  warpProps,
  className,
  pulseDurationSec,
}: WarpCanvasProps) {
  return (
    <motion.div
      animate={
        live
          ? {
              scale: [1, 1.055, 0.99, 1],
              rotate: [0, 2, -1.5, 0],
            }
          : { scale: 1, rotate: 0 }
      }
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 origin-center rounded-full",
        className,
      )}
      transition={{
        duration: pulseDurationSec,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      <Warp
        {...DEFAULT_WARP}
        {...warpProps}
        speed={live ? speed : 0}
      />
    </motion.div>
  )
}

function useLiveWarp(
  rootRef: React.RefObject<HTMLDivElement | null>,
  isActive: boolean,
) {
  const reduceMotion = useReducedMotion()
  const inView = useInView(rootRef, {
    amount: 0.2,
    margin: "0px 0px -10% 0px",
  })

  return isActive && inView && !reduceMotion
}

export type AiBlobWarpProps = WarpContainerProps

/**
 * Circular, animated Warp blob for AI voice states.
 */
export const AiBlobWarp = forwardRef<HTMLDivElement, AiBlobWarpProps>(
  function AiBlobWarpImpl(
    {
      className,
      isActive = true,
      pulseDurationSec = 2.4,
      warpProps,
      ...props
    },
    forwardedRef,
  ) {
    const { className: warpClassName, speed: warpSpeed, ...restWarpProps } =
      warpProps ?? {}
    const rootRef = useRef<HTMLDivElement>(null)
    const live = useLiveWarp(rootRef, isActive)

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof forwardedRef === "function") {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [forwardedRef],
    )

    return (
      <div
        className={cn(
          "relative isolate size-12 overflow-hidden rounded-full bg-muted",
          className,
        )}
        ref={setRefs}
        {...props}
      >
        <WarpCanvas
          className={warpClassName}
          live={live}
          pulseDurationSec={pulseDurationSec}
          speed={warpSpeed ?? DEFAULT_WARP.speed ?? 1}
          warpProps={restWarpProps}
        />
      </div>
    )
  },
)

AiBlobWarp.displayName = "AiBlobWarp"

export type AiBlobWarpAvatarProps = WarpContainerProps

/**
 * Circular avatar frame with an animated Warp shader inside.
 */
export const AiBlobWarpAvatar = forwardRef<
  HTMLDivElement,
  AiBlobWarpAvatarProps
>(function AiBlobWarpAvatarImpl(
  {
    className,
    isActive = true,
    pulseDurationSec = 5.2,
    warpProps,
    ...props
  },
  forwardedRef,
) {
  const { className: warpClassName, speed: warpSpeed, ...restWarpProps } =
    warpProps ?? {}
  const rootRef = useRef<HTMLDivElement>(null)
  const live = useLiveWarp(rootRef, isActive)

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (typeof forwardedRef === "function") {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    },
    [forwardedRef],
  )

  return (
    <div
      className={cn(
        "relative isolate size-8 overflow-hidden rounded-full bg-muted shadow-foreground/10 shadow-sm ring-1 ring-foreground/10",
        className,
      )}
      ref={setRefs}
      {...props}
    >
      <WarpCanvas
        className={warpClassName}
        live={live}
        pulseDurationSec={pulseDurationSec}
        speed={warpSpeed ?? DEFAULT_WARP.speed ?? 1}
        warpProps={restWarpProps}
      />
    </div>
  )
})

AiBlobWarpAvatar.displayName = "AiBlobWarpAvatar"
