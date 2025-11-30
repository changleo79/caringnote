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
      
      {/* 새로운 세련된 로고 - 노트북과 케어의 조화 */}
      <svg
        viewBox="0 0 64 64"
        className="relative z-10 text-white fill-white drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110"
        style={{ width: size * 0.8, height: size * 0.8 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="brandMarkShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.5" />
            <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
          </linearGradient>
          <radialGradient id="brandMarkHighlight" cx="50%" cy="30%" r="50%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
          </radialGradient>
        </defs>
        
        {/* 메인 노트북 디자인 */}
        <g transform="translate(8, 12)">
          <rect x="0" y="0" width="48" height="32" rx="4" ry="4" fill="white" opacity="0.95" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
          <rect x="2" y="2" width="44" height="26" rx="3" fill="url(#brandMarkShine)" />
          <rect x="6" y="6" width="36" height="4" rx="2" fill="white" opacity="0.3" />
          <line x1="8" y1="14" x2="32" y2="14" stroke="white" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
          <line x1="8" y1="18" x2="28" y2="18" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
          <line x1="8" y1="22" x2="30" y2="22" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
          <path d="M36 16c0-1.5 1-3 2.5-3 0.8 0 1.5 0.5 2 1.2 0.5-0.7 1.2-1.2 2-1.2 1.5 0 2.5 1.5 2.5 3 0 2-1.5 3-4 4.5-2.5-1.5-4-2.5-4-4.5z" 
                fill="white" opacity="0.5" />
        </g>
        
        <circle cx="32" cy="20" r="20" fill="url(#brandMarkHighlight)" opacity="0.3" />
        <circle cx="32" cy="28" r="22" fill="white" opacity="0.1" />
      </svg>
    </div>
  )
}
