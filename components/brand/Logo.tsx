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
        
        {/* 완전히 새로운 세련된 하트 로고 */}
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
              <stop offset="50%" stopColor="#ffffff" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.9} />
            </linearGradient>
            <linearGradient id="heartShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.6} />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <radialGradient id="heartGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </radialGradient>
          </defs>
          
          {/* 외부 글로우 */}
          <circle cx="32" cy="32" r="28" fill="url(#heartGlow)" opacity="0.4" />
          
          {/* 메인 하트 - 세련되고 입체적인 디자인 */}
          <g transform="translate(32, 32)">
            {/* 하트 그림자 */}
            <path
              d="M-14,-8 C-14,-16 -8,-20 0,-20 C8,-20 14,-16 14,-8 C14,-2 6,4 0,12 C-6,4 -14,-2 -14,-8 Z"
              fill="black"
              opacity="0.15"
              transform="translate(1, 2)"
            />
            
            {/* 메인 하트 */}
            <path
              d="M-14,-8 C-14,-16 -8,-20 0,-20 C8,-20 14,-16 14,-8 C14,-2 6,4 0,12 C-6,4 -14,-2 -14,-8 Z"
              fill="url(#heartGradient)"
              stroke="white"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
            
            {/* 하트 하이라이트 */}
            <path
              d="M-12,-9 C-12,-15 -7,-18 0,-18 C5,-18 9,-16 11,-12"
              fill="url(#heartShine)"
              opacity="0.8"
            />
            
            {/* 작은 하트 (노트 아이콘) */}
            <g transform="translate(2, -4) scale(0.35)">
              <path
                d="M-6,-2 C-6,-4 -3,-5 0,-5 C3,-5 6,-4 6,-2 C6,-1 3,1 0,4 C-3,1 -6,-1 -6,-2 Z"
                fill="white"
                opacity="0.6"
              />
            </g>
          </g>
          
          {/* 반짝이는 효과 */}
          <circle cx="24" cy="20" r="1.5" fill="white" opacity="0.7">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="24" r="1" fill="white" opacity="0.5">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Text - 프리미엄 타이포그래피 */}
      {variant !== "icon" && (
        <div className="flex flex-col">
          <span className={cn(
            "font-black tracking-tighter",
            "bg-gradient-to-r from-primary-500 via-blue-500 to-primary-600 bg-clip-text text-transparent",
            "leading-none",
            "group-hover:from-primary-400 group-hover:via-blue-400 group-hover:to-primary-500",
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
