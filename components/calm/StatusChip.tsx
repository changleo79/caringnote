import { cn } from "@/lib/utils"

const MAP = {
  GOOD: { label: "좋음", className: "chip-good" },
  OK: { label: "보통", className: "chip-ok" },
  CAUTION: { label: "주의", className: "chip-caution" },
} as const

export function StatusChip({
  status,
  className,
}: {
  status?: string | null
  className?: string
}) {
  const key = (status || "OK") as keyof typeof MAP
  const item = MAP[key] || MAP.OK
  return <span className={cn(item.className, className)}>{item.label}</span>
}
