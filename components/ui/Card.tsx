import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(interactive ? "card-interactive" : "card", className)}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = "Card"

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-b border-[var(--sn-line)] px-5 py-4", className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-5", className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t border-[var(--sn-line)] bg-[var(--sn-bg-elevated)] px-5 py-4", className)} {...props}>
      {children}
    </div>
  )
}
