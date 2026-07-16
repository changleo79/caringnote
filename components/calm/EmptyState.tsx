export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="px-2 py-16 text-center">
      <p className="font-display text-xl font-semibold text-[var(--sn-ink)]">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-sm text-[var(--sn-ink-muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
