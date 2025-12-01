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
  href = "/"
}: LogoProps) {
  const sizeClasses = {
    sm: {
      icon: "w-8 h-8",
      text: "text-lg",
      subtext: "text-xs",
      container: "gap-2"
    },
    md: {
      icon: "w-10 h-10",
      text: "text-xl",
      subtext: "text-xs",
      container: "gap-2.5"
    },
    lg: {
      icon: "w-14 h-14",
      text: "text-3xl",
      subtext: "text-sm",
      container: "gap-3"
    }
  }

  const classes = sizeClasses[size]

  const LogoContent = () => (
    <div className={cn(
      "flex items-center",
      variant === "icon" ? "justify-center" : "",
      classes.container,
      className
    )}>
      {/* Icon Container - Notion/Linear 스타일 미니멀 */}
      <div className={cn(
        "relative flex items-center justify-center",
        "bg-neutral-900 rounded-lg",
        "transform transition-all duration-200 ease-out",
        "hover:bg-neutral-800 hover:scale-105 active:scale-95",
        "shadow-notion hover:shadow-notion-lg",
        classes.icon
      )}>
        {/* 심장 아이콘 - 미니멀하고 세련된 디자인 */}
        <svg
          viewBox="0 0 24 24"
          className={cn(
            "relative z-10 text-white fill-white",
            "transition-transform duration-200",
            size === "sm" ? "w-5 h-5" : size === "md" ? "w-6 h-6" : "w-8 h-8"
          )}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Text - Notion 스타일 타이포그래피 */}
      {variant !== "icon" && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold tracking-tight",
            "text-neutral-900",
            "leading-none",
            classes.text
          )}>
            케어링노트
          </span>
          {size === "lg" && (
            <span className={cn(
              "text-neutral-600 font-medium mt-0.5",
              classes.subtext
            )}>
              Caring Note
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (variant === "icon") {
    return href ? (
      <Link href={href} className="inline-block">
        <LogoContent />
      </Link>
    ) : (
      <LogoContent />
    )
  }

  return (
    <Link 
      href={href}
      className="inline-block group"
    >
      <LogoContent />
    </Link>
  )
}
