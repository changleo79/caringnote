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
      
      {/* 프리미엄 SVG 로고 */}
      <svg
        viewBox="0 0 48 48"
        className="relative z-10 text-white fill-white drop-shadow-xl transform transition-transform duration-500 group-hover:scale-110"
        style={{ width: size * 0.6, height: size * 0.6 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 심장 - 더 세련된 곡선 */}
        <path
          d="M24 42.5c-.4 0-.7-.15-1-.45C12.5 33.8 4 27 4 17.5c0-5.5 4-9.5 9.5-9.5 3 0 6 1.5 7.5 4 1.5-2.5 4.5-4 7.5-4 5.5 0 9.5 4 9.5 9.5 0 9.5-8.5 16.3-19 24.55-.3.3-.6.45-1 .45z"
          className="drop-shadow-lg"
        />
        {/* 노트북 오버레이 */}
        <g opacity="0.25" transform="translate(10, 14)">
          <rect x="0" y="0" width="28" height="20" rx="2.5" fill="white" />
          <line x1="4" y1="4" x2="24" y2="4" stroke="white" strokeWidth="2" />
          <line x1="4" y1="8" x2="20" y2="8" stroke="white" strokeWidth="1.5" />
          <line x1="4" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  )
}
