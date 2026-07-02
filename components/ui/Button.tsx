import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className, children, ...props }, ref) => {
    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      danger: "btn bg-red-600 text-white hover:bg-red-700 min-h-[48px] px-6 py-3 rounded-xl font-semibold",
    }

    const sizes = {
      sm: "min-h-[40px] px-4 py-2 text-caption",
      md: "",
      lg: "min-h-[52px] px-8 py-4 text-body-lg",
    }

    return (
      <button
        ref={ref}
        className={cn(
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
