import { cn } from "@/lib/utils"

export function ChipPicker({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: { id: string; label: string }[]
  value: string | string[]
  onChange: (next: string | string[]) => void
  multi?: boolean
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : []

  const toggle = (id: string) => {
    if (multi) {
      const next = selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
      onChange(next)
    } else {
      onChange(id)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = selected.includes(opt.id)
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={cn(
              "min-h-[52px] rounded-2xl border px-4 text-[15px] font-medium transition",
              on
                ? "border-[var(--sn-accent)] bg-[var(--sn-accent)] text-white"
                : "border-[var(--sn-line-strong)] bg-[var(--sn-surface)] text-[var(--sn-ink)]"
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
