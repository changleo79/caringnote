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
        
        {/* 초세련된 밝은 하트 로고 */}
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
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={1} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.98} />
            </linearGradient>
            <linearGradient id="heartShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
              <stop offset="40%" stopColor="#ffffff" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <radialGradient id="heartGlow" cx="45%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </radialGradient>
            <linearGradient id="heartReflection" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          
          {/* 외부 글로우 - 더 밝게 */}
          <circle cx="32" cy="32" r="30" fill="url(#heartGlow)" opacity="0.6" />
          
          {/* 메인 하트 - 밝고 깔끔한 디자인 */}
          <g transform="translate(32, 32)">
            {/* 메인 하트 - 밝은 흰색 */}
            <path
              d="M-15,-9 C-15,-17 -8,-21 0,-21 C8,-21 15,-17 15,-9 C15,-2 7,5 0,13 C-7,5 -15,-2 -15,-9 Z"
              fill="url(#heartGradient)"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            
            {/* 상단 하이라이트 - 더 강하게 */}
            <path
              d="M-13,-10 C-13,-16 -7,-19 0,-19 C5,-19 9,-17 11,-13"
              fill="url(#heartShine)"
              opacity="1"
            />
            
            {/* 반사 효과 */}
            <ellipse cx="-8" cy="-11" rx="4" ry="6" fill="url(#heartReflection)" opacity="0.7" transform="rotate(-15)" />
            
            {/* 작은 하트 (노트 아이콘) - 더 밝게 */}
            <g transform="translate(3, -5) scale(0.4)">
              <path
                d="M-6,-2 C-6,-4 -3,-5 0,-5 C3,-5 6,-4 6,-2 C6,-1 3,1 0,4 C-3,1 -6,-1 -6,-2 Z"
                fill="white"
                opacity="0.9"
              />
            </g>
          </g>
          
          {/* 반짝이는 효과 - 더 밝고 많게 */}
          <circle cx="22" cy="18" r="2" fill="white" opacity="0.9">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="42" cy="22" r="1.5" fill="white" opacity="0.8">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="28" cy="28" r="1" fill="white" opacity="0.7">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.7s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Text - 프리미엄 타이포그래피 */}
      {variant !== "icon" && (
        <div className="flex flex-col">
          <span className={cn(
            "font-black tracking-tighter",
            "bg-gradient-to-r from-blue-400 via-primary-400 to-blue-500 bg-clip-text text-transparent",
            "leading-none",
            "group-hover:from-blue-300 group-hover:via-primary-300 group-hover:to-blue-400",
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
