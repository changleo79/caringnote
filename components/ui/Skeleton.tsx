import { cn } from "@/lib/utils"

interface SkeletonProps {
  variant?: "rectangular" | "circular" | "text"
  className?: string
  width?: string | number
  height?: string | number
}

export function Skeleton({ 
  variant = "rectangular", 
  className,
  width,
  height 
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 rounded"
  
  const variantClasses = {
    rectangular: "rounded-xl",
    circular: "rounded-full",
    text: "rounded",
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === "number" ? `${width}px` : width
  if (height) style.height = typeof height === "number" ? `${height}px` : height

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
    />
  )
}
