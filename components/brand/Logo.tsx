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
      icon: "w-10 h-10",
      text: "text-xl",
      subtext: "text-xs",
      container: "gap-2.5"
    },
    md: {
      icon: "w-12 h-12",
      text: "text-2xl",
      subtext: "text-xs",
      container: "gap-3"
    },
    lg: {
      icon: "w-16 h-16",
      text: "text-4xl",
      subtext: "text-sm",
      container: "gap-4"
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
      {/* Icon Container - 프리미엄 디자인 */}
      <div className={cn(
        "relative flex items-center justify-center",
        "bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500",
        "rounded-2xl shadow-xl shadow-primary-500/30",
        "transform transition-all duration-500 ease-out",
        "hover:scale-110 hover:shadow-2xl hover:shadow-primary-500/40 hover:rotate-2",
        "group",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500",
        classes.icon
      )}>
        {/* Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent rounded-2xl opacity-60"></div>
        
        {/* 프리미엄 SVG 로고 - 심장과 노트북 조합 */}
        <svg
          viewBox="0 0 48 48"
          className={cn(
            "relative z-10 text-white fill-white drop-shadow-lg",
            "transform transition-transform duration-500 group-hover:scale-110",
            size === "sm" ? "w-6 h-6" : size === "md" ? "w-7 h-7" : "w-9 h-9"
          )}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 심장 - 더 부드럽고 세련된 곡선 */}
          <path
            d="M24 42.5c-.4 0-.7-.15-1-.45C12.5 33.8 4 27 4 17.5c0-5.5 4-9.5 9.5-9.5 3 0 6 1.5 7.5 4 1.5-2.5 4.5-4 7.5-4 5.5 0 9.5 4 9.5 9.5 0 9.5-8.5 16.3-19 24.55-.3.3-.6.45-1 .45z"
            className="drop-shadow-md"
          />
          {/* 노트북 오버레이 - 더 세련된 디자인 */}
          <g opacity="0.2" transform="translate(10, 14)">
            <rect x="0" y="0" width="28" height="20" rx="2" fill="white" />
            <line x1="4" y1="4" x2="24" y2="4" stroke="white" strokeWidth="1.5" />
            <line x1="4" y1="8" x2="20" y2="8" stroke="white" strokeWidth="1" />
            <line x1="4" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Text - 프리미엄 타이포그래피 */}
      {variant !== "icon" && (
        <div className="flex flex-col">
          <span className={cn(
            "font-black tracking-tighter",
            "bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 bg-clip-text text-transparent",
            "leading-none",
            "group-hover:from-primary-700 group-hover:via-primary-600 group-hover:to-accent-700",
            "transition-all duration-500",
            "drop-shadow-sm",
            classes.text
          )}>
            케어링노트
          </span>
          {size === "lg" && (
            <span className={cn(
              "text-gray-600 font-semibold mt-1 tracking-wider",
              "group-hover:text-gray-700 transition-colors duration-300",
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
