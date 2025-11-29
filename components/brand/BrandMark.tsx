import { Heart, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrandMarkProps {
  size?: number
  className?: string
}

export default function BrandMark({ size = 40, className }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500",
        "rounded-2xl shadow-lg shadow-primary-500/30",
        className
      )}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
      <Heart 
        className="relative z-10 text-white fill-white"
        style={{ width: size * 0.5, height: size * 0.5 }}
      />
      <BookOpen 
        className="absolute -bottom-1 -right-1 text-white/90"
        style={{ width: size * 0.25, height: size * 0.25 }}
      />
    </div>
  )
}

