import { cn } from "@/lib/utils"

interface BrandMarkProps {
  size?: number
  className?: string
}

export default function BrandMark({ size = 48, className }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-brand-600 shadow-sm",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        className="text-white"
        style={{ width: size * 0.5, height: size * 0.5 }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    </div>
  )
}
