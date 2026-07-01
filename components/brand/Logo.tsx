import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "default" | "icon" | "text"
  size?: "sm" | "md" | "lg"
  className?: string
  href?: string
}

export default function Logo({
  variant = "default",
  size = "md",
  className,
  href = "/",
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
        "flex items-center justify-center rounded-xl bg-brand-600 shadow-sm",
        s.icon
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "text-white",
          size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    </div>
  )

  const LogoContent = () => (
    <div
      className={cn(
        "flex items-center",
        variant !== "icon" && s.gap,
        className
      )}
    >
      <IconMark />
      {variant !== "icon" && (
        <div className="flex flex-col">
          <span className={cn("font-semibold text-neutral-900 leading-tight tracking-tight", s.text)}>
            실버노트
          </span>
          {(size === "lg" || variant === "default") && (
            <span className={cn("text-neutral-500 font-medium leading-tight", s.sub)}>
              Silver Note
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (variant === "icon" && !href) {
    return <LogoContent />
  }

  return (
    <Link href={href} className="inline-block">
      <LogoContent />
    </Link>
  )
}
