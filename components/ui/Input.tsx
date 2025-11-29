import { cn } from "@/lib/utils"
import { InputHTMLAttributes, ReactNode } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
}

export function Input({ label, icon, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full py-3 border border-gray-200 rounded-xl input-focus outline-none transition bg-gray-50/50",
            icon && "pl-12 pr-4",
            !icon && "px-4",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

