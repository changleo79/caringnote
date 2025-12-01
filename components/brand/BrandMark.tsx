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
        "bg-neutral-900 rounded-lg",
        "transform transition-all duration-200 ease-out",
        "hover:bg-neutral-800 hover:scale-105 active:scale-95",
        "shadow-notion hover:shadow-notion-lg",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* 심장 아이콘 - 미니멀하고 세련된 디자인 */}
      <svg
        viewBox="0 0 24 24"
        className="relative z-10 text-white fill-white transition-transform duration-200"
        style={{ width: size * 0.6, height: size * 0.6 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
