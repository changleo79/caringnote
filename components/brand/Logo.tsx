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
    sm: { icon: "w-8 h-8", text: "text-base", gap: "gap-2" },
    md: { icon: "w-10 h-10", text: "text-lg", gap: "gap-2.5" },
    lg: { icon: "w-12 h-12", text: "text-2xl", gap: "gap-3" },
  }
  const s = sizeClasses[size]

  const IconMark = () => (
    <div
      className={cn(
        "flex items-center justify-center",
        light ? "text-white" : "text-[var(--sn-accent)]",
        s.icon
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={cn(size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 4.5h8.25a3 3 0 0 1 3 3v12H9.5a3 3 0 0 1-3-3v-12Z" />
        <path d="M17.75 8.5h-7a2 2 0 0 0-2 2v8.75" />
        <path d="M11.25 13.25h4" />
      </svg>
    </div>
  )

  const LogoContent = () => (
    <div className={cn("flex items-center", variant !== "icon" && s.gap, className)}>
      <IconMark />
      {variant !== "icon" && (
        <span
          className={cn(
            "font-display font-semibold leading-none tracking-[-0.025em]",
            light ? "text-white" : "text-[var(--sn-ink)]",
            s.text
          )}
        >
          실버노트
        </span>
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
