import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  children: ReactNode
  className?: string
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = "font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md active:scale-95",
    secondary: "bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 active:scale-95",
    outline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 active:scale-95",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:scale-95",
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

