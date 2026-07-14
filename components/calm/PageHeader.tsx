import { cn } from "@/lib/utils"

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
  action?: React.ReactNode
}) {
  return (
    <header className={cn("page-header flex items-start justify-between gap-4", className)}>
      <div>
        {eyebrow ? (
          <p className="mb-1 text-sm font-semibold tracking-wide text-[var(--sn-accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="page-title">{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
      </div>
      {action}
    </header>
  )
}
