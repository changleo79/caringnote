import { cn } from "@/lib/utils"

interface BrandMarkProps {
  size?: number
  className?: string
}

export default function BrandMark({ size = 80, className }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500",
        "rounded-3xl shadow-2xl shadow-primary-500/30",
        "transform transition-all duration-500 ease-out",
        "hover:scale-110 hover:shadow-3xl hover:shadow-primary-500/40 hover:rotate-3",
        "group",
        "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/30 before:via-transparent before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent rounded-3xl opacity-70"></div>
      
      {/* 새로운 세련된 하트 로고 */}
      <svg
        viewBox="0 0 64 64"
        className="relative z-10 text-white fill-white drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110"
        style={{ width: size * 0.8, height: size * 0.8 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="brandMarkHeartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id="brandMarkHeartShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.6} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="brandMarkHeartGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </radialGradient>
        </defs>
        
        {/* 외부 글로우 */}
        <circle cx="32" cy="32" r="28" fill="url(#brandMarkHeartGlow)" opacity="0.4" />
        
        {/* 메인 하트 */}
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
            fill="url(#brandMarkHeartGradient)"
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          
          {/* 하트 하이라이트 */}
          <path
            d="M-12,-9 C-12,-15 -7,-18 0,-18 C5,-18 9,-16 11,-12"
            fill="url(#brandMarkHeartShine)"
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
  )
}
