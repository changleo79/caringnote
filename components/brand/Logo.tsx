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
        
        {/* 프리미엄 SVG 로고 - 입체감 있는 심장 디자인 */}
        <svg
          viewBox="0 0 48 48"
          className={cn(
            "relative z-10 text-white fill-white drop-shadow-2xl",
            "transform transition-transform duration-500 group-hover:scale-110",
            size === "sm" ? "w-6 h-6" : size === "md" ? "w-7 h-7" : "w-9 h-9"
          )}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 입체감을 위한 그라데이션 */}
            <linearGradient id="heartShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.4" />
              <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.1" />
              <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
            </linearGradient>
            {/* 반사 효과 */}
            <linearGradient id="heartReflection" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.3" />
              <stop offset="30%" style="stop-color:#ffffff;stop-opacity:0.1" />
              <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
            </linearGradient>
            {/* 하이라이트 */}
            <radialGradient id="heartHighlight" cx="40%" cy="35%" r="40%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.5" />
              <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
            </radialGradient>
          </defs>
          
          {/* 메인 심장 - 입체감 있는 디자인 */}
          <path
            d="M24 42.5c-.4 0-.7-.15-1-.45C12.5 33.8 4 27 4 17.5c0-5.5 4-9.5 9.5-9.5 3 0 6 1.5 7.5 4 1.5-2.5 4.5-4 7.5-4 5.5 0 9.5 4 9.5 9.5 0 9.5-8.5 16.3-19 24.55-.3.3-.6.45-1 .45z"
            className="drop-shadow-xl"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
          />
          
          {/* 하이라이트 레이어 */}
          <path
            d="M24 42.5c-.4 0-.7-.15-1-.45C12.5 33.8 4 27 4 17.5c0-5.5 4-9.5 9.5-9.5 3 0 6 1.5 7.5 4 1.5-2.5 4.5-4 7.5-4 5.5 0 9.5 4 9.5 9.5 0 9.5-8.5 16.3-19 24.55-.3.3-.6.45-1 .45z"
            fill="url(#heartHighlight)"
          />
          
          {/* 반사 효과 */}
          <path
            d="M18 14c0-2.5 2-4.5 4.5-4.5 1.5 0 3 1 3.5 2.5 0.5-1.5 2-2.5 3.5-2.5 2.5 0 4.5 2 4.5 4.5 0 4-3 6.5-8 10-5-3.5-8-6-8-10z"
            fill="url(#heartReflection)"
          />
          
          {/* 빛나는 효과 */}
          <path
            d="M24 42.5c-.4 0-.7-.15-1-.45C12.5 33.8 4 27 4 17.5c0-5.5 4-9.5 9.5-9.5 3 0 6 1.5 7.5 4 1.5-2.5 4.5-4 7.5-4 5.5 0 9.5 4 9.5 9.5 0 9.5-8.5 16.3-19 24.55-.3.3-.6.45-1 .45z"
            fill="url(#heartShine)"
            opacity="0.6"
          />
          
          {/* 노트북 아이콘 - 더 세련된 디자인 */}
          <g opacity="0.25" transform="translate(10, 14)">
            <rect x="0" y="0" width="28" height="20" rx="2.5" fill="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <rect x="2" y="2" width="24" height="3" rx="1" fill="white" opacity="0.6" />
            <rect x="2" y="7" width="18" height="2" rx="1" fill="white" opacity="0.5" />
            <rect x="2" y="11" width="20" height="2" rx="1" fill="white" opacity="0.5" />
            <circle cx="24" cy="14" r="1.5" fill="white" opacity="0.4" />
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
