import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "default" | "icon" | "text"
  size?: "sm" | "md" | "lg"
  className?: string
  href?: string
  light?: boolean
}

export default function Logo({
  variant = "default",
  size = "md",
  className,
  href = "/",
  light = false,
}: LogoProps) {
  const sizeClasses = {
    sm: { icon: "w-8 h-8", text: "text-base", sub: "text-[10px]", gap: "gap-2" },
    md: { icon: "w-10 h-10", text: "text-lg", sub: "text-xs", gap: "gap-2.5" },
    lg: { icon: "w-12 h-12", text: "text-2xl", sub: "text-sm", gap: "gap-3" },
  }
  const s = sizeClasses[size]

  const IconMark = () => (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl",
        light ? "bg-white/15 text-white" : "bg-[var(--sn-accent)] text-white",
        s.icon
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={cn(size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 3h7l4 4v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <path d="M15 3v4h4" />
        <path d="M9.5 13.5c1.2-1.8 3.8-1.8 5 0" />
        <circle cx="10.2" cy="11.2" r="0.7" fill="currentColor" stroke="none" />
        <circle cx="13.8" cy="11.2" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    </div>
  )

  const LogoContent = () => (
    <div className={cn("flex items-center", variant !== "icon" && s.gap, className)}>
      <IconMark />
      {variant !== "icon" && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-display font-semibold leading-tight tracking-tight",
              light ? "text-white" : "text-[var(--sn-ink)]",
              s.text
            )}
          >
            실버노트
          </span>
          {(size === "lg" || variant === "default") && (
            <span
              className={cn(
                "font-medium leading-tight",
                light ? "text-white/70" : "text-[var(--sn-ink-muted)]",
                s.sub
              )}
            >
              Silver Note
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (variant === "icon" && !href) return <LogoContent />

  return (
    <Link href={href} className="inline-block">
      <LogoContent />
    </Link>
  )
}
