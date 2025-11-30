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
        
        {/* 완전히 새로운 세련된 로고 - 노트북과 케어의 조화 */}
        <svg
          viewBox="0 0 64 64"
          className={cn(
            "relative z-10 text-white fill-white drop-shadow-2xl",
            "transform transition-transform duration-500 group-hover:scale-110",
            size === "sm" ? "w-6 h-6" : size === "md" ? "w-7 h-7" : "w-9 h-9"
          )}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <radialGradient id="logoHighlight" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </radialGradient>
          </defs>
          
          {/* 메인 노트북 디자인 - 모던하고 세련된 스타일 */}
          <g transform="translate(8, 12)">
            {/* 노트북 바탕 */}
            <rect x="0" y="0" width="48" height="32" rx="4" ry="4" fill="white" opacity="0.95" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
            
            {/* 화면 그라데이션 */}
            <rect x="2" y="2" width="44" height="26" rx="3" fill="url(#logoShine)" />
            
            {/* 상단 바 */}
            <rect x="6" y="6" width="36" height="4" rx="2" fill="white" opacity="0.3" />
            
            {/* 내용 라인들 - 케어 노트 느낌 */}
            <line x1="8" y1="14" x2="32" y2="14" stroke="white" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
            <line x1="8" y1="18" x2="28" y2="18" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
            <line x1="8" y1="22" x2="30" y2="22" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
            
            {/* 하트 아이콘 - 작고 세련되게 */}
            <path d="M36 16c0-1.5 1-3 2.5-3 0.8 0 1.5 0.5 2 1.2 0.5-0.7 1.2-1.2 2-1.2 1.5 0 2.5 1.5 2.5 3 0 2-1.5 3-4 4.5-2.5-1.5-4-2.5-4-4.5z" 
                  fill="white" opacity="0.5" />
          </g>
          
          {/* 하이라이트 효과 */}
          <circle cx="32" cy="20" r="20" fill="url(#logoHighlight)" opacity="0.3" />
          
          {/* 글로우 효과 */}
          <circle cx="32" cy="28" r="22" fill="white" opacity="0.1" />
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
