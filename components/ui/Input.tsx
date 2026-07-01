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
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              icon ? "input-with-icon" : "input",
              error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-caption text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-caption text-neutral-500">{hint}</p>}
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
            "input appearance-none cursor-pointer bg-white",
            error && "border-red-400",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1.5 text-caption text-red-600">{error}</p>}
      </div>
    )
  }
)

Select.displayName = "Select"
