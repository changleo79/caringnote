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
      
      {/* 프리미엄 SVG 로고 - Enhanced Design */}
      <svg
        viewBox="0 0 48 48"
        className="relative z-10 text-white fill-white drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110"
        style={{ width: size * 0.6, height: size * 0.6 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="brandShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.4" />
            <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
          </linearGradient>
          <radialGradient id="brandHighlight" cx="40%" cy="35%" r="40%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.5" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
          </radialGradient>
        </defs>
        
        {/* 심장 - 입체감 있는 디자인 */}
        <path
          d="M24 42.5c-.4 0-.7-.15-1-.45C12.5 33.8 4 27 4 17.5c0-5.5 4-9.5 9.5-9.5 3 0 6 1.5 7.5 4 1.5-2.5 4.5-4 7.5-4 5.5 0 9.5 4 9.5 9.5 0 9.5-8.5 16.3-19 24.55-.3.3-.6.45-1 .45z"
          className="drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
        />
        <path
          d="M24 42.5c-.4 0-.7-.15-1-.45C12.5 33.8 4 27 4 17.5c0-5.5 4-9.5 9.5-9.5 3 0 6 1.5 7.5 4 1.5-2.5 4.5-4 7.5-4 5.5 0 9.5 4 9.5 9.5 0 9.5-8.5 16.3-19 24.55-.3.3-.6.45-1 .45z"
          fill="url(#brandHighlight)"
        />
        <path
          d="M24 42.5c-.4 0-.7-.15-1-.45C12.5 33.8 4 27 4 17.5c0-5.5 4-9.5 9.5-9.5 3 0 6 1.5 7.5 4 1.5-2.5 4.5-4 7.5-4 5.5 0 9.5 4 9.5 9.5 0 9.5-8.5 16.3-19 24.55-.3.3-.6.45-1 .45z"
          fill="url(#brandShine)"
          opacity="0.6"
        />
        
        {/* 노트북 오버레이 - 더 세련된 디자인 */}
        <g opacity="0.25" transform="translate(10, 14)">
          <rect x="0" y="0" width="28" height="20" rx="2.5" fill="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          <rect x="2" y="2" width="24" height="3" rx="1" fill="white" opacity="0.6" />
          <rect x="2" y="7" width="18" height="2" rx="1" fill="white" opacity="0.5" />
          <rect x="2" y="11" width="20" height="2" rx="1" fill="white" opacity="0.5" />
          <circle cx="24" cy="14" r="1.5" fill="white" opacity="0.4" />
        </g>
      </svg>
    </div>
  )
}
