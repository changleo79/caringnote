import Link from "next/link"
import { Heart, BookOpen } from "lucide-react"
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
      icon: "w-6 h-6",
      text: "text-lg",
      container: "gap-2"
    },
    md: {
      icon: "w-8 h-8",
      text: "text-2xl",
      container: "gap-2.5"
    },
    lg: {
      icon: "w-12 h-12",
      text: "text-4xl",
      container: "gap-3"
    }
  }

  const classes = sizeClasses[size]

  const LogoContent = () => (
    <div className={cn(
      "flex items-center",
      classes.container,
      className
    )}>
      {/* Icon Container */}
      <div className={cn(
        "relative flex items-center justify-center",
        "bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500",
        "rounded-2xl shadow-lg shadow-primary-500/30",
        "transform transition-transform hover:scale-105",
        classes.icon
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
        <Heart className={cn(
          "relative z-10 text-white fill-white",
          size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-7 h-7"
        )} />
        <BookOpen className={cn(
          "absolute -bottom-0.5 -right-0.5 text-white/90",
          size === "sm" ? "w-2 h-2" : size === "md" ? "w-2.5 h-2.5" : "w-3.5 h-3.5"
        )} />
      </div>

      {/* Text */}
      {variant !== "icon" && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent",
            "leading-tight tracking-tight",
            classes.text
          )}>
            케어링노트
          </span>
          {size === "lg" && (
            <span className="text-xs text-gray-500 font-medium mt-0.5">
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

