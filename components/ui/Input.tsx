import { cn } from "@/lib/utils"
import { InputHTMLAttributes, forwardRef, ReactNode } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s/g, "-").toLowerCase()

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sn-ink-faint)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              icon ? "input-with-icon" : "input",
              error && "border-[var(--sn-caution)]",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-[var(--sn-caution)]">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-[var(--sn-ink-muted)]">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, id, ...props }, ref) => {
    const selectId = id || label?.replace(/\s/g, "-").toLowerCase()

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="label">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "input cursor-pointer appearance-none",
            error && "border-[var(--sn-caution)]",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1.5 text-sm text-[var(--sn-caution)]">{error}</p>}
      </div>
    )
  }
)

Select.displayName = "Select"
