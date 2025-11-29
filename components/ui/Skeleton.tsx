import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
}

export function Skeleton({ 
  className, 
  variant = "rectangular" 
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 rounded"
  
  const variantClasses = {
    text: "h-4 w-full",
    circular: "rounded-full aspect-square",
    rectangular: "rounded-lg"
  }

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    />
  )
}

// 커스텀 스켈레톤 컴포넌트들
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
      <Skeleton variant="rectangular" className="h-32 w-full mb-4" />
      <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
      <Skeleton variant="text" className="h-4 w-full mb-1" />
      <Skeleton variant="text" className="h-4 w-2/3" />
    </div>
  )
}

export function PostSkeleton() {
  return (
    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-1/4" />
          <Skeleton variant="text" className="h-5 w-3/4" />
        </div>
      </div>
    </div>
  )
}

