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
      container: "gap-2.5"
    },
    md: {
      icon: "w-10 h-10",
      text: "text-2xl",
      container: "gap-3"
    },
    lg: {
      icon: "w-14 h-14",
      text: "text-4xl",
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
      {/* Icon Container - 개선된 디자인 */}
      <div className={cn(
        "relative flex items-center justify-center",
        "bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500",
        "rounded-2xl shadow-lg shadow-primary-500/25",
        "transform transition-all duration-300",
        "hover:scale-105 hover:shadow-xl hover:shadow-primary-500/35",
        "group",
        classes.icon
      )}>
        {/* Glow 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* SVG 로고 - 더 세련된 디자인 */}
        <svg
          viewBox="0 0 40 40"
          className={cn(
            "relative z-10 text-white fill-white",
            size === "sm" ? "w-5 h-5" : size === "md" ? "w-6 h-6" : "w-8 h-8"
          )}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 심장 아이콘 - 더 부드럽고 현대적인 디자인 */}
          <path
            d="M20 34.6c-.3 0-.6-.1-.8-.3C10.8 26.7 4 21.2 4 13.5c0-4.2 3.2-7.5 7.5-7.5 2.4 0 4.6 1.1 6 3 1.4-1.9 3.6-3 6-3 4.3 0 7.5 3.3 7.5 7.5 0 7.7-6.8 13.2-15.2 20.8-.2.2-.5.3-.8.3z"
            className="drop-shadow-sm"
          />
          {/* 노트북/노트 아이콘 오버레이 */}
          <path
            d="M26 18h-8v2h8v-2zm-8-4h12v2H18v-2zm0 8h10v2H18v-2z"
            fill="currentColor"
            opacity="0.15"
            transform="translate(0, -2)"
          />
        </svg>
      </div>

      {/* Text */}
      {variant !== "icon" && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 bg-clip-text text-transparent",
            "leading-tight tracking-tight",
            "group-hover:from-primary-700 group-hover:to-accent-700 transition-all duration-300",
            classes.text
          )}>
            케어링노트
          </span>
          {size === "lg" && (
            <span className="text-xs text-gray-500 font-medium mt-1 tracking-wide">
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
